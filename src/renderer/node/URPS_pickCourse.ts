/*
 * @Author: holakk
 * @Date: 2021-02-03 22:14:31
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 21:49:26
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\node\URPS_pickCourse.js
 */
import qs from 'qs';
import { AxiosInstance } from 'axios';
import { message } from 'antd';

import { Course, axiosURPS, urls, CourseWait, PollState } from './baseGen';

enum PoolStatus {
  OK,
  Wait,
  DIE,
}

class CourseInfoGrabbing {
  axios_URPS: AxiosInstance;

  course_pool: CourseWait[];

  user_name: string;

  poll_interval: number;

  fxid: number;

  token: null;

  urls: {
    All_course_index: string;
    free_pick_course_list: string;
    free_pick_course_submit: string;
    login_submit: string;
    login_verify_code: string;
  };

  pool_status: PoolStatus;

  constructor(new_axios: AxiosInstance) {
    this.axios_URPS = new_axios;
    this.course_pool = [];
    this.user_name = '';
    this.poll_interval = 1;
    this.fxid = 0;
    this.token = null;
    this.urls = urls;
    this.pool_status = PoolStatus.Wait; // 轮询状态
  }

  set_user_name() {
    this.axios_URPS
      .get('http://zhjw.scu.edu.cn/index.jsp')
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.indexOf('成绩查询') !== -1
        ) {
          const regexIn = /欢迎您，<\/small>(.+)[\s\S]+<\/span>/gm;
          const regResult = regexIn.exec(response.data);
          if (regResult) {
            [, this.user_name] = regResult;
          } else {
            throw new Error('姓名查询失败');
          }
        }
        return 'right?';
      })
      .catch((error) => {
        message.error('登录失效');
        console.log(`error here ${error}`);
      });
  }

  config(refresh_time: string) {
    this.poll_interval = parseInt(refresh_time, 10);
    this.set_user_name();
  }

  async find_course(course_keyword: string) {
    // 关键词组包
    const courseSearchKeydata = {
      searchtj: course_keyword,
      xq: 0,
      jc: 0,
      kclbdm: '',
    };
    try {
      const indexResponse = await this.axios_URPS.get(
        this.urls.All_course_index
      );
      // 验证健康性
      if (indexResponse.data.indexOf('自由选课') === -1) {
        throw new Error(
          '[无法进入页面]：当前非选课阶段，或者教务处网站挂了，或者你的网络不行'
        );
      }
      // 计算token
      const temp = indexResponse.data.indexOf('id="tokenValue"');
      this.token = indexResponse.data.substring(temp + 23, temp + 55);

      // 寻课
      const courseResponse = await this.axios_URPS.post(
        this.urls.free_pick_course_list,
        qs.stringify(courseSearchKeydata)
      );
      if (courseResponse.status !== 200) {
        throw new Error('无法提交搜索');
      }
      // 计算fxid并返回列表
      if (courseResponse.data) {
        const courseAimsInfolist = JSON.parse(courseResponse.data.rwRxkZlList);
        const addlesFatp = JSON.parse(courseResponse.data.yxkclist);
        this.fxid = addlesFatp[0].programPlanNumber;
        return courseAimsInfolist;
      }
      throw new Error('无法获取搜索结果');
    } catch (error) {
      message.error(`无法找到课程: ${error}`);
      return error;
    }
  }

  course_add_listener(course: Course) {
    const aimCourseDict: CourseWait = {
      course_info: course,
      poll_state: PollState.Preparing,
      poll_time: 0,
    };
    this.course_pool.push(aimCourseDict);
  }

  courses_remove_listener(removeIndex: number[]) {
    removeIndex.forEach((value) => {
      this.course_pool.splice(value, 1);
    });
  }

  update_view_course_pool(
    oldView: CourseWait[],
    setOldView: (x: CourseWait[]) => void
  ) {
    if (oldView !== this.course_pool) {
      setOldView(this.course_pool);
    }
  }

  async get_course(
    courseIndex: number,
    needRemoveIndex: number[]
  ): Promise<number> {
    let postInfo = {};
    await this.find_course(this.course_pool[courseIndex].course_info.course_num)
      .then((results) => {
        if (typeof results !== 'string') {
          this.pool_status = PoolStatus.OK;
          results.forEach(
            (searchResult: {
              kcm: string;
              kch: string;
              kxh: string;
              bkskyl: number;
              zxjxjhh: any;
            }) => {
              if (
                this.course_pool[courseIndex].course_info.course_name ===
                  searchResult.kcm &&
                this.course_pool[courseIndex].course_info.course_num ===
                  searchResult.kch &&
                this.course_pool[courseIndex].course_info.course_sort ===
                  searchResult.kxh
              ) {
                this.course_pool[courseIndex].course_info.course_remain =
                  searchResult.bkskyl;
                // 检查课余量
                if (searchResult.bkskyl > 0) {
                  let zxykName = '';
                  for (let i = 0; i < searchResult.kcm.length; i += 1) {
                    zxykName += `${searchResult.kcm.charCodeAt(i)},`;
                  }
                  postInfo = {
                    dealType: 5,
                    kcIds: `${searchResult.kch}@${searchResult.kxh}@${searchResult.zxjxjhh}`,
                    kcms: zxykName,
                    fajhh: this.fxid,
                    sj: '0_0',
                    searchtj: searchResult.kcm,
                    kclbdm: '',
                    inputCode: '',
                    tokenValue: this.token,
                  };
                } else {
                  this.course_pool[courseIndex].poll_state = PollState.NoMargin;
                }
              } else {
                this.course_pool[courseIndex].poll_state = PollState.NoCourse;
              }
            }
          );
        } else {
          this.pool_status = PoolStatus.DIE;
          throw new Error('查询状态失败');
        }
        return 'no using';
      })
      .catch((error) => {
        throw new Error(error.massage);
      });

    await this.axios_URPS
      .post(this.urls.free_pick_course_submit, qs.stringify(postInfo))
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('网络错误');
        }
        if (response.data.indexOf('ok') !== -1) {
          needRemoveIndex.push(courseIndex);
          this.course_pool[courseIndex].poll_state = PollState.Success;
        } else {
          this.course_pool[courseIndex].poll_state = PollState.NoMatch;
        }
        return 0;
      })
      .catch((error) => {
        this.pool_status = PoolStatus.DIE;
        throw new Error(`抢课异常: ${error}`);
      });
    this.course_pool[courseIndex].poll_time += 1;
    return 0;
  }

  async polling_once() {
    if (this.course_pool === []) {
      this.pool_status = PoolStatus.DIE;
      message.warn('课程池中没有课程');
      throw new Error('课程池中没有课程');
    }
    if (this.course_pool !== []) {
      const needRemoveIndex: number[] = [];
      const allPromise: Promise<number>[] = [];
      this.course_pool.forEach((_, courseIndex: number) => {
        const promiseThis = this.get_course(courseIndex, needRemoveIndex);
        allPromise.push(promiseThis);
      });
      await Promise.all(allPromise);
      this.courses_remove_listener(needRemoveIndex);
    }
  }
}
export const coursePicker = new CourseInfoGrabbing(axiosURPS);

export default { CourseInfoGrabbing };
