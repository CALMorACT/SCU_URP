/*
 * @Author: holakk
 * @Date: 2021-09-16 10:36:16
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 23:39:59
 * @Description: file content
 */

import React from 'react';
import { Button } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';

import { coursePool, selectCourses } from '../../node/stateMange';
import { PollState } from '../../node/baseGen';

export function CourseSearchButton() {
  const selectedCourses = useRecoilValue(selectCourses);
  const [coursesPool, setCoursesPool] = useRecoilState(coursePool);
  const setPool = () => {
    if (selectedCourses !== []) {
      const oldCoursesPool = [...coursesPool];
      setCoursesPool(
        oldCoursesPool.concat(
          selectedCourses.map((element) => {
            return {
              course_info: element,
              poll_state: PollState.Preparing,
              poll_time: 0,
            };
          })
        )
      );
    }
  };
  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={setPool}
      disabled={selectedCourses === []}
    >
      确定
    </Button>
  );
}

export default { CourseSearchButton };
