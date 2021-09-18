/*
 * @Author: holakk
 * @Date: 2021-09-16 10:36:16
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-18 22:56:07
 * @Description: file content
 */

import React from 'react';
import { Button, message } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cloneDeep } from 'lodash';

import { coursePool, selectCourses } from '../../node/stateMange';
import { PollState } from '../../node/baseGen';

export function CourseSearchButton() {
  const selectedCourses = useRecoilValue(selectCourses);
  const [coursesPool, setCoursesPool] = useRecoilState(coursePool);
  const setPool = () => {
    if (selectedCourses !== []) {
      const oldCoursesPool = [...coursesPool];
      const oldSelectedCourses = cloneDeep(selectedCourses);
      setCoursesPool(
        oldCoursesPool.concat(
          oldSelectedCourses.map((element) => {
            return Object.assign(element, {
              poll_state: PollState.Preparing,
              poll_time: 0,
            });
          })
        )
      );
      message.success('添加课程成功', 2);
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
