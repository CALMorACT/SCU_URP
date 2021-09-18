/*
 * @Author: holakk
 * @Date: 2021-09-14 21:44:51
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-17 11:12:22
 * @Description: file content
 */
/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

import Store, { Schema } from 'electron-store';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

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

export const store = new Store<StoreType>({ schema, encryptionKey: 'min' });
