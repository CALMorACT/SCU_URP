/*
 * @Author: holakk
 * @Date: 2021-09-16 11:52:25
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-18 14:08:41
 * @Description: file content
 */
import { atom } from 'recoil';
import { Course, CourseWait } from './baseGen';

export const searchResults = atom({
  key: 'searchResults',
  default: [] as Course[],
});

export const selectCourses = atom({
  key: 'selectCourses',
  default: [] as Course[],
});
export const searchKey = atom({
  key: 'searchKey',
  default: '',
});

export const coursePool = atom({
  key: 'coursePool',
  default: [] as CourseWait[],
});

export const isPolling = atom({
  key: 'isPolling',
  default: false,
});

export const isSelectingTime = atom({
  key: 'isSelectingTime',
  default: false,
});

export default { searchResults, selectCourses, searchKey };
