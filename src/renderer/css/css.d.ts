/*
 * @Author: holakk
 * @Date: 2021-09-15 21:04:13
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 10:34:41
 * @Description: file content
 */
declare module '*.css' {
  const content: any;
  export default content;
}
declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}
