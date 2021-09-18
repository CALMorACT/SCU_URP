/*
 * @Author: holakk
 * @Date: 2021-02-10 17:23:58
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 23:49:11
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\courseList.js
 */
import React from 'react';
import { CourseSearchArea } from './CourseSearch/Area';
import { CourseSearchList } from './CourseSearch/List';
import { CourseSearchButton } from './CourseSearch/Button';

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
