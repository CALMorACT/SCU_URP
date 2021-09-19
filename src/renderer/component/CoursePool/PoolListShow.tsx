/*
 * @Author: holakk
 * @Date: 2021-03-18 22:08:44
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 15:29:55
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\PoolListShow.js
 */
import React from 'react';
import { Table, Button } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PollState } from '../../node/baseGen';
import { coursePool } from '../../node/stateMange';

const { Column, ColumnGroup } = Table;

// 显示抢课池中课程
export function CoursePoolListShow() {
  const Pool = useRecoilValue(coursePool);
  console.log(Pool);
  return (
    <div>
      <Table
        title={() => (
          <div>
            抢课列表
            <Button type="text" onClick={() => {}}>
              刷新
            </Button>
          </div>
        )}
        dataSource={Pool}
      >
        <Column title="课程名" dataIndex="course_name" key="course_name" />
        <Column
          title="课程教师"
          dataIndex="course_teacher"
          key="course_teacher"
        />
        <Column title="课程号" dataIndex="course_num" key="course_num" />
        <Column title="课序号" dataIndex="course_sort" key="course_sort" />
        <Column title="课余量" dataIndex="course_remain" key="course_remain" />
        <ColumnGroup title="课程时间">
          <Column
            title="周数"
            dataIndex="course_time_week"
            key="course_time_week"
            render={(value, _, row_index) => {
              const obj = {
                children: value.map((item: string, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`course_time_week_${row_index}_${index}`}>
                    {item}
                  </div>
                )),
                props: {},
              };
              return obj;
            }}
          />
          <Column
            title="星期数"
            dataIndex="course_time_day"
            key="course_time_day"
            render={(value, _, row_index) => {
              const obj = {
                children: value.map((item: string, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`course_time_day_${row_index}_${index}`}>
                    {item}
                  </div>
                )),
                props: {},
              };
              return obj;
            }}
          />
          <Column
            title="节数"
            dataIndex="course_time_section"
            key="course_time_section"
            render={(value, _, row_index) => {
              const obj = {
                children: value.map((item: string, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`course_time_section_${row_index}_${index}`}>
                    {item}
                  </div>
                )),
                props: {},
              };
              return obj;
            }}
          />
        </ColumnGroup>
        <Column title="轮询次数" dataIndex="poll_time" key="poll_time" />
        <Column
          title="抢课结果"
          dataIndex="poll_state"
          key="poll_state"
          render={(text) => {
            switch (text) {
              case PollState.NoCourse:
                return '无此课程';
              case PollState.NoMargin:
                return '无课余量';
              case PollState.NoMatch:
                return '不符合限制';
              case PollState.Preparing:
                return '准备抢课';
              case PollState.Success:
                return '抢课成功';
              default:
                return 'none';
            }
          }}
        />
      </Table>
    </div>
  );
}
// 移出课程
export function RemoveCoursePoolButton() {
  return (
    <Button type="primary" shape="round" size="large">
      删除
    </Button>
  );
}

export default { CoursePoolListShow, RemoveCoursePoolButton };
