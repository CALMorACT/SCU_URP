/*
 * @Author: holakk
 * @Date: 2021-05-30 20:40:09
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 21:45:59
 * @Description: file content
 */
import axios from 'axios';
import Store from 'electron-store';

export const storeUser = new Store();

export const axiosURPS = axios.create({
  baseURL: 'http://zhjw.scu.edu.cn',
  headers: {
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  },
});

export interface Course {
  key: string;
  course_name: string;
  course_teacher: string;
  course_num: string;
  course_sort: string;
  course_remain: number;
  course_time_week: string[];
  course_time_day: string[];
  course_time_section: string[];
  course_classroom: string[];
  course_college: string;
  course_limit: string;
}

export enum PollState {
  Preparing, // 在课程池中，准备抢课
  NoMargin, // 无课余量
  NoCourse, // 没有此课程
  NoMatch, // 不符合限制条件
  Success, // 抢课成功
}

export interface CourseWait {
  course_info: Course;
  poll_state: PollState;
  poll_time: number;
  // poll_spend: number;
}

export const urls = {
  All_course_index:
    'http://zhjw.scu.edu.cn/student/courseSelect/courseSelect/index',
  free_pick_course_list:
    'http://zhjw.scu.edu.cn/student/courseSelect/freeCourse/courseList',
  free_pick_course_submit:
    'http://zhjw.scu.edu.cn/student/courseSelect/selectCourse/checkInputCodeAndSubmit',
  login_submit: 'http://zhjw.scu.edu.cn/j_spring_security_check',
  login_verify_code: 'http://zhjw.scu.edu.cn/img/captcha.jpg',
};

export default { storeUser, axiosURPS, urls };
