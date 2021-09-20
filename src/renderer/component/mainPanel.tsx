/*
 * @Author: holakk
 * @Date: 2021-02-10 18:18:44
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-20 00:25:46
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\mainPanel.js
 */
import React from 'react';
import { Tabs } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale/zh_CN';

import { CourseList } from './CourseSearch';
import { AimsCourseList } from './CoursePoll';
import { Manual } from './Manual';

const { TabPane } = Tabs;

export default function MainPanel() {
  return (
    <Tabs
      centered
      defaultActiveKey="use_manual"
      size="large"
      tabPosition="left"
    >
      <TabPane tab="添加课程" key="add_course">
        <CourseList />
      </TabPane>
      <TabPane tab="抢课情况" key="aims_course_info">
        <AimsCourseList />
      </TabPane>
      <TabPane tab="使用说明" key="use_manual">
        <Manual />
      </TabPane>
    </Tabs>
  );
}
