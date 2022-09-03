/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: holakk
 * @Date: 2021-02-03 18:25:14
 * @LastEditors: holakk
 * @LastEditTime: 2021-10-11 15:21:58
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\login.js
 */

import { useEffect, useState } from 'react';
import { Form, Input, Button, Tooltip, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';

import { refreshVerifyCode, login } from '../node/URPS_login';

import styles from '../css/login.css';

// 验证码组件
function VerifyCode(props: { setImgSrc: (n: string) => void; imgSrc: string }) {
  const { imgSrc, setImgSrc } = props;
  useEffect(() => {
    refreshVerifyCode(setImgSrc);
  }, [setImgSrc]);
  return (
    <Tooltip title="点击刷新" color="blue" key="blue" placement="bottomRight">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={imgSrc}
        onClick={refreshVerifyCode}
        className={`${styles['verify-code-img']} inline-block`}
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
  const [form] = Form.useForm();
  const [imgSrc, setImgSrc] = useState('');
  useEffect(() => {
    window.electron.ipcRenderer.send('test_cookie');
    window.electron.ipcRenderer.on('test_cookie_reply', (_, arg) => {
      // eslint-disable-next-line no-console
      console.log(`ifCookieUsed: ${arg[0]}`);
      if (arg[0]) {
        message.success('自动登录', 1);
        props.history.replace('/mainPanel');
      } else {
        form.setFieldsValue({
          stu_num: arg[1],
          password: arg[2],
        });
      }
    });
  }, [form, props]);
  const validateMessages = {
    string: {
      // eslint-disable-next-line no-template-curly-in-string
      len: '${name}长度需为${len}',
    },
  };
  return (
    <div
      className={`${styles['login-form']} p-6 max-w-sm mx-auto bg-blue-50 rounded-xl shadow-md flex items-center space-x-4`}
      style={{ margin: 'auto' }}
    >
      <Form
        name="normal_login"
        onFinish={(values) => {
          login(values.stu_num, values.password, values.verify_code)
            .then((isRight) => {
              if (isRight) {
                props.history.replace('/mainPanel');
                return 0;
              }
              message.error('验证码输入错误', 1);
              refreshVerifyCode(setImgSrc);
              return 1;
            })
            .catch((error) => {
              console.log(`${error}`);
            });
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
        <Form.Item name="verify_code">
          <Form.Item
            name="verify_code_input"
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
              className={`${styles['verify-code-input']} w-3/5`}
            />
          </Form.Item>
          <VerifyCode imgSrc={imgSrc} setImgSrc={setImgSrc} />
        </Form.Item>
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
