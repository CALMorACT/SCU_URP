/*
 * @Author: holakk
 * @Date: 2021-09-16 10:36:16
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 15:59:25
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
      // 实现选课池增量更新而非全量
      setCoursesPool(
        oldCoursesPool.concat(
          oldSelectedCourses
            .filter(
              (value) =>
                oldCoursesPool.findIndex(
                  (element) => element.key === value.key
                ) === -1
            )
            .map((element) => {
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
