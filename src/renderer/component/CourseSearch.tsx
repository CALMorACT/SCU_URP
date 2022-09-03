/*
 * @Author: holakk
 * @Date: 2021-02-10 17:23:58
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 21:19:07
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\component\courseList.js
 */
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
