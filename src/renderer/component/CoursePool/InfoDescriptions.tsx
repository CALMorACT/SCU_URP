/*
 * @Author: holakk
 * @Date: 2021-03-18 22:02:00
 * @LastEditors: holakk
 * @LastEditTime: 2021-06-10 20:14:50
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\InfoDescriptions.js
 */
import React, { useState } from 'react';
import { Descriptions, Badge, Button } from 'antd';

// 统计抢课时长
function UsedTime(props) {
  const [used_time, setUsedTime] = useState(0);
  setInterval(() => {
    if (
      props.poll_status === '查询状态正常' &&
      props.poll_status === '抢课网络正常'
    ) {
      setUsedTime(used_time + 1);
    }
  }, 1000);
  const formatSecond = (result) => {
    const h = Math.floor((result / 3600) % 24);
    const m = Math.floor((result / 60) % 60);
    const s = Math.floor(result % 60);
    result = `${(Array(2).join('0') + s).slice(-2)}秒`;
    result = `${(Array(2).join('0') + m).slice(-2)}分钟${result}`;
    result = `${(Array(2).join('0') + h).slice(-2)}小时${result}`;
    return result;
  };
  return <h4>{formatSecond(used_time)}</h4>;
}
// 定时刷新的反应抢课状态
export function CoursePoolInfo(props) {
  const [username, setUserName] = useState(
    props.picker.username === '' ? '未知' : props.picker.user_name
  );
  const [refresh_time, setRefreshTime] = useState(props.picker.refresh_time);
  const [course_pools_count, setCoursePools_count] = useState(
    props.picker.course_pools
      ? Object.keys(props.picker.course_pools).length
      : 0
  );
  const [poll_status, setPoolStatus] = useState(props.picker.poll_status);
  const setPoolStatus_show = () => {
    switch (poll_status) {
      case '等待':
        return <Badge status="default" text={props.picker.poll_status} />;
      case '课程池中没有课程':
        return <Badge status="warning" text={props.picker.poll_status} />;
      case '查询状态正常':
      case '抢课网络正常':
        return <Badge status="processing" text={props.picker.poll_status} />;
      case '抢课网络异常':
      case '提交抢课失败':
      case '查询状态失败':
        return <Badge status="error" text={props.picker.poll_status} />;
      case '抢课成功但请自行查看课表确定':
        return <Badge status="success" text={props.picker.poll_status} />;
      default:
        return <Badge status="error" text={props.picker.poll_status} />;
    }
  };
  const [poll_status_show, setPoolStatusShow] = useState(setPoolStatus_show());
  const timer = setInterval(() => {
    setUserName(props.picker.username === '' ? '未知' : props.picker.user_name);
    setRefreshTime(props.picker.refresh_time);
    setCoursePools_count(
      props.picker.course_pools
        ? Object.keys(props.picker.course_pools).length
        : 0
    );
    setPoolStatus(props.picker.poll_status);
    setPoolStatusShow(setPoolStatus_show());
  }, 1000);
  return (
    <Descriptions title="抢课池目前状况" bordered>
      <Descriptions.Item label="用户" span={2}>
        {username}
      </Descriptions.Item>
      <Descriptions.Item label="间隔时间">{refresh_time}秒</Descriptions.Item>
      <Descriptions.Item label="课程数量">
        {course_pools_count}
      </Descriptions.Item>
      <Descriptions.Item label="已抢时长" span={2}>
        <UsedTime poll_status={poll_status} />
      </Descriptions.Item>
      <Descriptions.Item label="抢课池状态" span={3}>
        {poll_status_show}
      </Descriptions.Item>
    </Descriptions>
  );
}
export default CoursePoolInfo;
