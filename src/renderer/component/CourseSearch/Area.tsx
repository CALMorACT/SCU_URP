/*
 * @Author: holakk
 * @Date: 2021-09-16 10:34:13
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-19 22:19:03
 * @Description: file content
 */
import React, { useEffect } from 'react';
import { Input, message } from 'antd';
import { useRecoilState } from 'recoil';

import { searchResults, isCourseSelectingTime } from '../../node/stateMange';
import { Course } from '../../node/baseGen';
import { coursePicker } from '../../node/URPS_pickCourse';

const { Search } = Input;

function getSearchResult(
  search_key: string,
  setResults: (n: Course[]) => void
): void {
  message.loading({ content: '正在搜索', key: 'search' });
  const courses: Course[] = [];
  coursePicker
    .find_course(search_key)
    .then((results) => {
      if (typeof results !== 'string') {
        results.forEach(
          (unset_course: {
            kch: string; // 课程号
            kxh: string; // 课序号
            kcm: string; // 课程名
            skjs: string; // 上课时间
            bkskyl: number; // 课余量
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sjdd: any[]; // 时间地点
            kkxsjc: string; // 学院
            xkxzsm: string; // 选课限制
          }) => {
            courses.push({
              key: `${unset_course.kch}_${unset_course.kxh}`,
              course_name: unset_course.kcm,
              course_teacher: unset_course.skjs,
              course_num: unset_course.kch,
              course_sort: unset_course.kxh,
              course_remain: unset_course.bkskyl,
              course_time_week: unset_course.sjdd.map(
                (item: { zcsm: string }) => {
                  return item.zcsm === '' ? '无' : item.zcsm;
                }
              ),
              course_time_day: unset_course.sjdd.map(
                (item: { skxq: string }) => {
                  return item.skxq === '' ? '无' : item.skxq;
                }
              ),
              course_time_section: unset_course.sjdd.map(
                (item: { skjc: string; cxjc: string }) => {
                  return item.skjc === ''
                    ? '无'
                    : `${item.skjc}-${
                        parseInt(item.cxjc, 10) + parseInt(item.skjc, 10) - 1
                      }`;
                }
              ),
              course_classroom: unset_course.sjdd.map(
                (item: { xqm: string; jxlm: string; jasm: string }) => {
                  return item.xqm === ''
                    ? '无'
                    : `${item.xqm}-${item.jxlm}-${item.jasm}`;
                }
              ),
              course_college: unset_course.kkxsjc,

              course_limit: unset_course.xkxzsm,
              // TODO: 根据教务系统生成禁选情况
              course_unable: false,
              course_selected: false,
            });
          }
        );
        setResults(courses);
      } else {
        message.error(results, 1);
      }
      return 'fine searching';
    })
    .then(() => {
      setTimeout(() => {
        message.success({ content: '搜索完成', key: 'search', duration: 2 });
      }, 500);
      return 'ok';
    })
    .catch((error) => {
      setTimeout(() => {
        message.error({
          content: '搜索失败，请尝试重启或重新登录',
          key: 'search',
          duration: 2,
        });
      }, 500);
      console.log(`error for finding courses ${error}`);
    });
}

export function CourseSearchArea() {
  const [, setResults] = useRecoilState(searchResults);
  const [, setIsTime] = useRecoilState(isCourseSelectingTime);
  useEffect(() => {
    coursePicker
      .getIsSelectingTime()
      .then(([n]) => {
        setIsTime(n);
        if (!n) {
          message.warn('当前非选课阶段，仅可以查询或加入课程池准备抢', 1);
        }
        return 0;
      })
      .catch((error) => {
        message.error(`进入选课主页错误: ${error}`);
      });
  }, [setIsTime]);

  return (
    <Search
      allowClear
      placeholder="输入课程关键字（类似于官网选课系统）"
      enterButton="查询"
      onSearch={(search_key) => {
        // eslint-disable-next-line react/prop-types
        getSearchResult(search_key, setResults);
      }}
    />
  );
}

export default { CourseSearchArea };
