/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';
import Store, { Schema } from 'electron-store';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

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
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
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
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
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

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

type StoreType = {
  user_info: {
    cookie: Electron.Cookie[];
    user_name: string;
    user_pass: string;
  };
};
const schema: Schema<StoreType> = {
  user_info: {
    type: 'object',
    properties: {
      cookie: {
        type: 'array',
      },
      user_name: {
        type: 'string',
      },
      user_pass: {
        type: 'string',
      },
    },
  },
};

const store = new Store<StoreType>({ schema, encryptionKey: 'min' });

ipcMain.on('store_cookie', (_, args) => {
  session.defaultSession.cookies
    .get({ url: 'http://zhjw.scu.edu.cn' })
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

Store.initRenderer();
ipcMain.on('test_cookie', (event) => {
  const userCookies: Electron.Cookie[] = store.get('user_info.cookie', []);
  const cookieLogin = userCookies.filter(
    (value: Electron.Cookie) => value.name === 'JSESSIONID'
  );
  if (userCookies !== [] && cookieLogin !== []) {
    console.log(cookieLogin);
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
          console.log('Cookie using');
          userCookies.forEach((cookieItem) => {
            session.defaultSession.cookies.set(
              Object.assign(cookieItem, { url: 'http://zhjw.scu.edu.cn' })
            );
          });
          event.reply('test_cookie_reply', true);
        } else {
          console.log('cookie over');
          event.reply('test_cookie_reply', false);
        }
        return 0;
      })
      .catch(() => {
        console.log('cookie test error');
        event.reply('test_cookie_reply', false);
      });
  }
});
