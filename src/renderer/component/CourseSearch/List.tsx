/*
 * @Author: holakk
 * @Date: 2021-09-16 10:35:08
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-18 21:09:50
 * @Description: file content
 */
import React, { useState } from 'react';
import { Table } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';

import { searchResults, selectCourses } from '../../node/stateMange';
import { Course } from '../../node/baseGen';

const { Column, ColumnGroup } = Table;

export function CourseSearchList() {
  const results = useRecoilValue(searchResults);
  const [aims, setAims] = useRecoilState(selectCourses);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const selectRow = (record: Course) => {
    const selectedCourses = [...aims];
    const mayIndex = selectedCourses.findIndex(
      (element) => element.key === record.key
    );
    if (mayIndex >= 0) {
      selectedCourses.splice(mayIndex, 1);
    } else {
      selectedCourses.push(record);
    }
    setAims(selectedCourses);
    setSelectedRowKeys(selectedCourses.map((value) => value.key));
  };
  return (
    <Table
      dataSource={results}
      rowSelection={{
        selectedRowKeys,
        onChange: (selectedRowKeys_) => {
          setSelectedRowKeys(selectedRowKeys_);
        },
        // getCheckboxProps: (record) => ({
        //   // TODO:添加课程禁选的条件
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
      }}
      onRow={(record) => ({
        onClick: () => {
          selectRow(record);
        },
      })}
      pagination={{ defaultPageSize: 5 }}
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
      <ColumnGroup title="课程时间/地点">
        <Column
          title="周数"
          dataIndex="course_time_week"
          key="course_time_week"
          render={(value, _, row_index) => {
            const obj = {
              children: value.map((item: string, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`course_time_week_${row_index}_${index}`}>{item}</div>
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
                <div key={`course_time_day_${row_index}_${index}`}>{item}</div>
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
        <Column
          title="教室"
          dataIndex="course_classroom"
          key="course_classroom"
          render={(value, _, row_index) => {
            const obj = {
              children: value.map((item: string, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`course_classroom_${row_index}_${index}`}>{item}</div>
              )),
              props: {},
            };
            return obj;
          }}
        />
      </ColumnGroup>
      <Column title="学院" dataIndex="course_college" key="course_college" />
      <Column
        title="限制"
        dataIndex="course_limit"
        key="course_limit"
        width="20%"
      />
    </Table>
  );
}

export default { CourseSearchList };
