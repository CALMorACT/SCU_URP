/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';

import MenuBuilder from './menu';
import { resolveHtmlPath, store } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // FIXME: I can' t solve this problem for conflicts between withCredentials and Access-Control-Allow-Origin
  // some ideas I have:
  //            use onSendHeaders to sent cookie not withCredentials
  // or         use Access-Control-Allow-Origin with appoint the domain for dev
  // or         use Proxy to fix the problem

  // I use the easiest method but not security (webSecurity: false). So stupid but effective
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  );
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on('store_cookie', (_, args) => {
  mainWindow?.webContents.session.cookies
    .get({})
    .then((cookies) => {
      store.set('user_info', {
        cookie: cookies,
        user_name: args[0],
        user_pass: args[1],
      });
      return 0;
    })
    .catch((error) => {
      console.log(error);
    });
});

ipcMain.on('test_cookie', (event) => {
  const userCookies: Electron.Cookie[] = store.get('user_info.cookie', []);
  const userName: string = store.get('user_info.user_name', '');
  const userPass: string = store.get('user_info.user_pass', '');
  const cookieLogin = userCookies.filter(
    (value: Electron.Cookie) => value.name === 'JSESSIONID'
  );
  if (userCookies !== [] && cookieLogin !== []) {
    axios({
      method: 'get',
      url: 'http://zhjw.scu.edu.cn/',
      headers: {
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36 Edg/88.0.705.74',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Cache-Control': 'max-age=0',
        Cookie: `${cookieLogin[0].name}=${cookieLogin[0].value}`,
      },
    })
      .then((response) => {
        if (response.data.indexOf('成绩查询') !== -1) {
          console.log(userCookies);
          console.log('Cookie using');
          mainWindow?.webContents.session.cookies.remove(
            'http://zhjw.scu.edu.cn',
            'JSESSIONID'
          );
          userCookies.forEach((cookieItem) => {
            const {
              secure = false,
              domain = '',
              path: thispath = '',
            } = cookieItem;
            mainWindow?.webContents.session.cookies.set(
              Object.assign(cookieItem, {
                url:
                  (secure ? 'https://' : 'http://') +
                  domain.replace(/^\./, '') +
                  thispath,
              })
            );
          });
          event.reply('test_cookie_reply', [true]);
        } else {
          console.log('cookie over');
          event.reply('test_cookie_reply', [false, userName, userPass]);
        }
        return 0;
      })
      .catch(() => {
        console.log('cookie test error');
        event.reply('test_cookie_reply', false);
      });
  }
});
app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
