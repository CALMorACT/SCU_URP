/*
 * @Author: holakk
 * @Date: 2021-02-10 17:23:58
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 23:39:08
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\courseList.js
 */
import React from 'react';
import { CourseSearchArea } from './CourseSearch/Area';
import { CourseSearchList } from './CourseSearch/List';
import { CourseSearchButton } from './CourseSearch/Button';

/*
    course:{
      key: '1',
      course_name: 'John Brown',
      course_teacher
      course_num: 32,
      course_sort
      course_remain: 'New York No. 1 Lake Park',
      course_time_week
      course_time_day
      course_time_section
      course_college
      course_classroom
      course_limit
    }
   */

export function CourseList() {
  return (
    <div>
      <CourseSearchArea />
      <CourseSearchList />
      <CourseSearchButton />
    </div>
  );
}
export default {
  CourseList,
};
