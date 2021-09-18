/*
 * @Author: holakk
 * @Date: 2021-02-10 18:18:34
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-17 10:55:55
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\aimsCourseList.js
 */
import React from 'react';
import { coursePicker } from '../node/URPS_pickCourse';
import { CoursePoolInfo } from './CoursePool/InfoDescriptions';
import { CoursePoolListShow } from './CoursePool/PoolListShow';
import {
  StartCoursePoolButton,
  StopCoursePoolButton,
} from './CoursePool/ControlButton';

export function AimsCourseList() {
  // 设置刷新间隔
  coursePicker.config(1);
  return (
    <div>
      <CoursePoolInfo />
      <CoursePoolListShow />
      <StartCoursePoolButton />
      <StopCoursePoolButton />
    </div>
  );
}

export default {};
