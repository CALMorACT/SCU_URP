/*
 * @Author: holakk
 * @Date: 2021-02-10 19:03:03
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-15 22:41:04
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\manual.js
 */
import React from 'react';
import { Steps, Button, message } from 'antd';
import styles from '../css/manual.css';

const { Step } = Steps;

const steps = [
  {
    title: '查询课程',
    content: '进入添加课程界面查询课程',
  },
  {
    title: '加入课程池',
    content: '查询后点击目标课程加入课程池（可以同时加多个课程）',
  },
  {
    title: '开启抢课轮询',
    content:
      '进入抢课情况界面点击开始，同时可以在抢课情况界面查看当前状态（用户为你的名字时证明登陆成功）',
  },
  {
    title: '停止抢课轮询',
    content: '进入抢课情况界面点击停止',
  },
];

export function Manual() {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={styles['steps-content']}>{steps[current].content}</div>
      <div className={styles['steps-action']}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success('Processing complete!')}
          >
            完成
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}

export default { Manual };
