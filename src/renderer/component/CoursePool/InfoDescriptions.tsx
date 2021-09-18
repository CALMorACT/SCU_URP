/*
 * @Author: holakk
 * @Date: 2021-03-18 22:02:00
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-17 11:57:52
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\InfoDescriptions.js
 */
import React, { useState } from 'react';
import { Descriptions, Badge } from 'antd';

import { coursePicker, PoolStatus } from '../../node/URPS_pickCourse';

// 统计抢课时长
function UsedTime(props: { pool_status: PoolStatus }) {
  const [usedTime, setUsedTime] = useState(0);
  setInterval(() => {
    if (props.pool_status === PoolStatus.OK) {
      setUsedTime(usedTime + 1);
    }
  }, 1000);
  const formatSecond = (result: number) => {
    const h = Math.floor((result / 3600) % 24);
    const m = Math.floor((result / 60) % 60);
    const s = Math.floor(result % 60);
    return `${(Array(2).join('0') + h).slice(-2)}小时${(
      Array(2).join('0') + m
    ).slice(-2)}分${(Array(2).join('0') + s).slice(-2)}秒`;
  };
  return <h4>{formatSecond(usedTime)}</h4>;
}
// 定时刷新的反应抢课状态
export function CoursePoolInfo() {
  const [userName, setUserName] = useState(
    coursePicker.user_name === '' ? '未知' : coursePicker.user_name
  );
  const [pollInterval, setPollInterval] = useState(coursePicker.poll_interval);
  const [coursePoolsCount, setCoursePoolsCount] = useState(
    coursePicker.course_pool ? Object.keys(coursePicker.course_pool).length : 0
  );
  const [pollStatus, setPoolStatus] = useState(coursePicker.pool_status);
  const getPoolStatusShow = () => {
    switch (pollStatus) {
      case PoolStatus.Wait:
        return <Badge status="default" text="等待中" />;
      case PoolStatus.DIE:
        return <Badge status="error" text="选课池崩溃请刷新" />;
      case PoolStatus.OK:
        return <Badge status="success" text="选课完成" />;
      default:
        return <Badge status="default" text="等待中" />;
    }
  };
  const [pollStatusShow, setPoolStatusShow] = useState(getPoolStatusShow());
  setInterval(() => {
    setUserName(
      coursePicker.user_name === '' ? '未知' : coursePicker.user_name
    );
    setPollInterval(coursePicker.poll_interval);
    setCoursePoolsCount(
      coursePicker.course_pool
        ? Object.keys(coursePicker.course_pool).length
        : 0
    );
    setPoolStatus(coursePicker.pool_status);
    setPoolStatusShow(getPoolStatusShow());
  }, 2000);
  return (
    <Descriptions title="抢课池目前状况" bordered>
      <Descriptions.Item label="用户" span={2}>
        {userName}
      </Descriptions.Item>
      <Descriptions.Item label="间隔时间">{pollInterval}秒</Descriptions.Item>
      <Descriptions.Item label="课程数量">{coursePoolsCount}</Descriptions.Item>
      <Descriptions.Item label="已抢时长" span={2}>
        <UsedTime pool_status={pollStatus} />
      </Descriptions.Item>
      <Descriptions.Item label="抢课池状态" span={3}>
        {pollStatusShow}
      </Descriptions.Item>
    </Descriptions>
  );
}
export default CoursePoolInfo;
