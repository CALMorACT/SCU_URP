/*
 * @Author: holakk
 * @Date: 2021-09-16 10:35:08
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 18:41:02
 * @Description: file content
 */
import React from 'react';
import { Table } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cloneDeep } from 'lodash';

import {
  searchResults,
  selectCourses,
  coursePool,
} from '../../node/stateMange';
import { Course } from '../../node/baseGen';

const { Column, ColumnGroup } = Table;

export function CourseSearchList() {
  const [results, setResults] = useRecoilState(searchResults);
  const aims = useRecoilValue(selectCourses);
  const pool = useRecoilValue(coursePool);

  const selectRow = (record: Course) => {
    if (
      record.course_unable === true ||
      pool.filter((element) => element.key === record.key).length !== 0
    ) {
      return;
    }
    // TODO: 需要实现点击影响其他属性的功能，通过控制其他课程（Results里）的 course_unable 实现，目前需要等待学习教务系统实现方式
    const newRecord = cloneDeep(record);
    newRecord.course_selected = !record.course_selected;
    const newResults = cloneDeep(results);
    // 必然可寻
    const mayIndex = newResults.findIndex(
      (element) => element.key === newRecord.key
    );
    newResults[mayIndex] = newRecord;
    setResults(newResults);
  };
  return (
    <Table
      dataSource={results}
      rowSelection={{
        selectedRowKeys: aims.map((value) => value.key),
        onSelect: (record) => {
          selectRow(record);
        },
        getCheckboxProps: (record) => ({
          disabled:
            record.course_unable === true ||
            pool.filter((element) => element.key === record.key).length !== 0,
        }),
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
