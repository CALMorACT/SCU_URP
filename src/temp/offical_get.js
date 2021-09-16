/*
 * @Author: holakk
 * @Date: 2021-03-17 13:18:55
 * @LastEditors: holakk
 * @LastEditTime: 2021-03-17 13:33:04
 * @FilePath: \AddUIByMe\electron_study\electron-react\src\temp\offical_get.js
 */
const course_time_section = `${sjdd.zcsm == '' ? '无' : sjdd.zcsm} >> ${
  sjdd.skxq == '' ? '无' : weekZw[parseInt(sjdd.skxq) - 1]
} >> ${
  sjdd.skjc == ''
    ? '无'
    : `${
        sjdd.skjc +
        (sjdd.cxjc == '' || sjdd.cxjc == null || sjdd.cxjc == '1'
          ? ''
          : `~${parseInt(sjdd.cxjc) + parseInt(sjdd.skjc) - 1}`)
      }节`
}`;
if (bkskyl > 0 || rwfalist[i].xkmsdm == '02') {
  fakccont += `<input type='checkbox' \
        id='${rwfalist[i].kch}@${rwfalist[i].kxh}@${rwfalist[i].zxjxjhh}' \
        class='ace ace-checkbox-2' name='kcId' value='${JSON.stringify(
          rwfalist[i]
        ).replace(/'/g, '#@urp001@#')}' \
        onclick='dealkc(this);'/><span class='lbl'></span>`;
}
