/*
 * @Author: holakk
 * @Date: 2021-03-18 22:09:21
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-14 13:03:18
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\ControlPoll.js
 */
import React from 'react';
import { Button } from 'antd';

export function StartCoursePoolButton(props) {
  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={props.startPool}
      disabled={props.disabled}
    >
      开始抢课
    </Button>
  );
}
export default {
  StartCoursePoolButton,
};
