/*
 * @Author: holakk
 * @Date: 2021-02-06 17:30:37
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-20 19:58:56
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\node\URPS_login.js
 */

import axios from 'axios';
import qs from 'qs';
// import { ContactsFilled } from '@ant-design/icons';
import CryptoJS from 'crypto-js';

import { urls, axiosURPS } from './baseGen';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function refreshVerifyCode(event: any = null) {
  axios
    .get(urls.login_verify_code, { responseType: 'arraybuffer' })
    .then((response) => {
      if (typeof event !== 'function') {
        event.target.src = `data:image/png;base64,${btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )}`;
      } else {
        event(
          `data:image/png;base64,${btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )}`
        );
      }
      return 1;
    })
    .catch(() => {
      throw new Error('无法获取验证码');
    });
}

export async function login(
  stuNum: string,
  stuPassword: string,
  verifyCode: string
): Promise<boolean> {
  const encryptPasswordMd5 = CryptoJS.MD5(stuPassword).toString(
    CryptoJS.enc.Hex
  );
  const postData = {
    j_username: stuNum,
    j_password: encryptPasswordMd5,
    j_captcha: verifyCode,
  };

  try {
    const response = await axiosURPS.post(
      urls.login_submit,
      qs.stringify(postData),
      { maxRedirects: 0 }
    );
    if (response.data.indexOf('验证码错误') !== -1) {
      return false;
    }
    if (response.data.indexOf('成绩查询') !== -1) {
      // eslint-disable-next-line no-console
      console.log('登录正常');
      window.electron.ipcRenderer.send('store_cookie', [stuNum, stuPassword]);
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`无法登陆: ${error.message}`);
  }
  return false;
}
export default { login, refreshVerifyCode };
