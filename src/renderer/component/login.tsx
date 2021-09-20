/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: holakk
 * @Date: 2021-02-03 18:25:14
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-20 11:50:38
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\login.js
 */

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tooltip, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';

import { refreshVerifyCode, login } from '../node/URPS_login';

import styles from '../css/login.css';

// 验证码组件
function VerifyCode() {
  const [imgSrc, setImgSrc] = useState('');
  useEffect(() => {
    refreshVerifyCode(setImgSrc);
  }, []);
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
  history: { replace: (arg0: string) => void };
}) {
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');
  useEffect(() => {
    window.electron.ipcRenderer.send('test_cookie');
    window.electron.ipcRenderer.on('test_cookie_reply', (_, arg) => {
      // eslint-disable-next-line no-console
      console.log(`ifCookieUsed: ${arg[0]}`);
      if (arg[0]) {
        message.success('自动登录', 1);
        props.history.replace('/mainPanel');
      } else {
        setUserName(arg[1]);
        setUserPass(arg[2]);
      }
    });
  }, [props, setUserName, setUserPass]);
  const validateMessages = {
    string: {
      // eslint-disable-next-line no-template-curly-in-string
      len: '${name}长度需为${len}',
    },
  };
  return (
    <div style={{ margin: 'auto' }}>
      <Form
        name="normal_login"
        className={styles['login-form']}
        fields={[
          {
            name: 'stu_num',
            value: userName,
          },
          {
            name: 'password',
            value: userPass,
          },
        ]}
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
