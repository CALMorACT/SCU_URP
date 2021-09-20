/*
 * @Author: holakk
 * @Date: 2021-03-18 22:09:21
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 21:26:20
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\ControlPoll.js
 */
import React from 'react';
import { Button, message } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';

import { coursePicker, PoolStatus } from '../../node/URPS_pickCourse';
import {
  isPolling,
  coursePool,
  isCourseSelectingTime,
} from '../../node/stateMange';

export function StartCoursePoolButton() {
  const isTime = useRecoilValue(isCourseSelectingTime);
  const [pollS, setPollS] = useRecoilState(isPolling);
  const [pool, setPool] = useRecoilState(coursePool);
  const startPolling = async () => {
    setPollS(true);
    try {
      while (pollS) {
        coursePicker.update_view_course_pool(pool, setPool);
        // eslint-disable-next-line no-await-in-loop
        await coursePicker.polling_once();
      }
    } catch (error) {
      message.error(`抢课错误: ${error}`, 1);
    }
  };
  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={startPolling}
      disabled={pool === [] || !isTime}
    >
      开始抢课
    </Button>
  );
}
export function StopCoursePoolButton() {
  const [, setPollS] = useRecoilState(isPolling);

  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={() => {
        setPollS(false);
      }}
      disabled={coursePicker.pool_status === PoolStatus.OK}
    >
      停止抢课
    </Button>
  );
}
export default {
  StartCoursePoolButton,
  StopCoursePoolButton,
};
