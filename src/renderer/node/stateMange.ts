/*
 * @Author: holakk
 * @Date: 2021-09-16 11:52:25
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 12:38:08
 * @Description: file content
 */
import { atom, selector } from 'recoil';
import { Course, CourseWait } from './baseGen';

export const searchKey = atom({
  key: 'searchKey',
  default: '',
});
export const searchResults = atom({
  key: 'searchResults',
  default: [] as Course[],
});

export const selectCourses = selector({
  key: 'selectCourses',
  get: ({ get }) => {
    const aims = get(searchResults);
    return aims.filter((item) => item.course_selected);
  },
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
