/*
 * @Author: holakk
 * @Date: 2021-09-14 21:44:51
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-20 12:07:17
 * @Description: file content
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, listener) {
      const validChannels = ['ipc-example', 'test_cookie_reply'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, listener);
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    send: ipcRenderer.send,
  },
});
