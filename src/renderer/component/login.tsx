/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: holakk
 * @Date: 2021-02-03 18:25:14
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 10:48:59
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\login.js
 */

import React, { useState } from 'react';
import { Form, Input, Button, Tooltip } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import { ipcRenderer } from 'electron';
import { storeUser } from '../node/baseGen';

import { refreshVerifyCode, login } from '../node/URPS_login';

import '../App.global.css';
import styles from '../css/login.css';

// 验证码组件
function VerifyCode() {
  const [imgSrc, setImgSrc] = useState('');
  useState(() => refreshVerifyCode(setImgSrc));
  return (
    <Tooltip title="点击刷新" color="blue" key="blue" placement="rightTop">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={imgSrc}
        onClick={refreshVerifyCode}
        className={styles['verify-code-img']}
        id="verify-code-img"
        alt="Verify-Code"
      />
    </Tooltip>
  );
}
// 登录组件
function NormalLoginForm(props: {
  // eslint-disable-next-line react/no-unused-prop-types
  location: { state: { from: { pathname: string } | { pathname: string } } };
  history: { replace: (arg0: string) => void };
}) {
  ipcRenderer.send('test_cookie');
  const [ifCookieUsed, setIfCookieUsed] = useState(false);
  const validateMessages = {
    string: {
      // eslint-disable-next-line no-template-curly-in-string
      len: '${name}长度需为${len}',
    },
  };
  ipcRenderer.on('test_cookie_reply', (_, arg) => {
    setIfCookieUsed(arg);
  });
  // eslint-disable-next-line no-console
  console.log(`ifCookieUsed: ${ifCookieUsed}`);
  if (ifCookieUsed) {
    props.history.replace('/mainPanel');
    return <div />;
  }
  return (
    <div style={{ margin: 'auto' }}>
      <Form
        name="normal_login"
        className={styles['login-form']}
        initialValues={{
          stu_num: storeUser.get('user_info.user_name'),
          password: storeUser.get('user_info.user_pass'),
        }}
        onFinish={(values) => {
          login(values.stu_num, values.password, values.verify_code);
          props.history.replace('/mainPanel');
        }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="stu_num"
          rules={[
            {
              required: true,
              message: '请输入学号',
            },
            {
              type: 'string',
              len: 13,
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="学号"
            autoComplete="on"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item
          name="verify_code"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
            {
              type: 'string',
              len: 4,
            },
          ]}
        >
          <Input
            prefix={<VerifiedOutlined className="site-form-item-icon" />}
            placeholder="验证码"
            allowClear
            className={styles['verify-code-input']}
          />
        </Form.Item>
        <VerifyCode />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles['login-form-button']}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NormalLoginForm;
