/*
 * @Author: holakk
 * @Date: 2021-09-19 23:04:57
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-20 12:13:17
 * @Description: file content
 */
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (
          channel: string,
          listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
        ) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}
export {};
