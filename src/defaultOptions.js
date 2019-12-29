/*
 * FileName: defaultOptions.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:28:32 am
 * Last Modified: Sunday, 29th December 2019 12:28:32 am
 * Modified By: Gsan
 */

export default {
  // 是否自动收集点击事件
  autoClick: false,
  // 是否开启自动上报 若关闭自行请在在事件中手动上报
  autoSend: true,
  // 开启debug
  debug: false,
  // 上报平台 目前支持 mta
  type: 'mta',
  // 上报平台配置
  config: {},
  // 发送事件
  onSend: (sendData, reporter, event) => {}
}
