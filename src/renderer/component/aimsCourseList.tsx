/*
 * @Author: holakk
 * @Date: 2021-02-10 18:18:34
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 23:10:02
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\aimsCourseList.js
 */
import React, { useState } from 'react';
import { message } from 'antd';
import { coursePicker } from '../node/URPS_pickCourse';
import { CoursePoolInfo } from './CoursePool/InfoDescriptions';
import {
  CoursePoolListShow,
  RemoveCoursePoolButton,
} from './CoursePool/PoolListShow';
import { StartCoursePoolButton } from './CoursePool/ControlPoll';

export function AimsCourseList(props) {
  const [course_remove_keys, setCourseRemoveKeys] = useState(null);
  const [polling_cutter, setPollingCutter] = useState(false);
  const remove_course_from_pool = () => {
    for (const remove_key of course_remove_keys) {
      coursePicker.course_remove_listener(remove_key);
    }
  };
  const start_polling = () => {
    try {
      coursePicker.begin_polling();
    } catch (error) {
      message.error(error.message, 1);
    }
  };
  // 设置刷新间隔
  coursePicker.config(1);
  return (
    <div>
      <CoursePoolInfo picker={coursePicker} />
      <CoursePoolListShow
        aims_courses={coursePicker.course_pool}
        set_course_remove_keys={setCourseRemoveKeys}
      />
      <RemoveCoursePoolButton
        disable={!course_remove_keys}
        removePool={remove_course_from_pool}
      />
      <StartCoursePoolButton
        disable={!course_remove_keys}
        startPool={start_polling}
      />
    </div>
  );
}
