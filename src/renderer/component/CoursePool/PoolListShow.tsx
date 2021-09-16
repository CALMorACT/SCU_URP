/*
 * @Author: holakk
 * @Date: 2021-03-18 22:08:44
 * @LastEditors: holakk
 * @LastEditTime: 2021-06-07 20:11:40
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\CoursePool\PoolListShow.js
 */
import React, { useState } from 'react';
import { message, Table, Button } from 'antd';

const { Column, ColumnGroup } = Table;

// 显示抢课池中课程
export function CoursePoolListShow(props) {
  const [course_pool, setCoursePool] = useState(
    Object.keys(props.aims_courses).map((it) => props.aims_courses[it])
  );
  const [selectCourse, setSelectCourse] = useState([]);
  const selectRow = (record) => {
    const selectedRowKeys = [...selectCourse];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.spice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    setSelectCourse(selectedRowKeys);
    props.set_course_remove_keys(selectedRowKeys);
  };
  return (
    <div>
      <Table
        title={() => (
          <div>
            抢课列表
            <Button
              type="text"
              onClick={() => {
                const temp = Object.keys(props.aims_courses).map(
                  (it) => props.aims_courses[it]
                );
                if (course_pool !== temp) {
                  setCoursePool(temp);
                }
              }}
            >
              刷新
            </Button>
          </div>
        )}
        dataSource={course_pool}
        rowSelection={{
          type: selectCourse,
          onChange: (selectedRowKeys) => {
            setSelectCourse(selectedRowKeys);
            props.set_course_remove_keys(selectedRowKeys);
          },
        }}
        onRow={(record) => ({
          onClick: () => {
            this.selectRow(record);
          },
        })}
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
            render={(value, row, row_index) => {
              const obj = {
                children: value.map((item, index) => (
                  <div key={`course_time_week${row_index}${index}`}>{item}</div>
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
            render={(value, row, row_index) => {
              const obj = {
                children: value.map((item, index) => (
                  <div key={`course_time_day${row_index}${index}`}>{item}</div>
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
            render={(value, row, row_index) => {
              const obj = {
                children: value.map((item, index) => (
                  <div key={`course_time_section${row_index}${index}`}>
                    {item}
                  </div>
                )),
                props: {},
              };
              return obj;
            }}
          />
        </ColumnGroup>
        <Column title="轮询次数" dataIndex="poll_count" key="poll_count" />
        <Column
          title="抢课结果"
          dataIndex="poll_result"
          key="poll_result"
          render={(text, row, index) => {
            switch (text) {
              case 4:
                return '抢课失败';
              case 3:
                return '无此课程';
              case 2:
                return '无课余量';
              case 1:
                return '准备抢课';
              case 0:
                return '抢课成功';
            }
          }}
        />
      </Table>
    </div>
  );
}
// 移出课程
export function RemoveCoursePoolButton(props) {
  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={props.removePool}
      disabled={props.disabled}
    >
      删除
    </Button>
  );
}
