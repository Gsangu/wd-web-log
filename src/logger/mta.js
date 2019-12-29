/*
 * FileName: mta.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:47:11 am
 * Last Modified: Sunday, 29th December 2019 12:47:11 am
 * Modified By: Gsan
 */

import MtaH5 from 'mta-h5-analysis'
const WebLogger = function ({debug = false, config = {}}) {
  if (debug) {
    console.log('init mta', config)
  }
  const { sid = '', cid = '', autoReport = 1, senseHash = 1, senseQuery = 0, performanceMonitor = 0, ignoreParams = 0 } = config
  MtaH5.init({
    sid: sid, // 必填，统计用的appid
    cid: cid, // 如果开启自定义事件，此项目为必填，否则不填
    autoReport: autoReport, // 是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
    senseHash: senseHash, // hash锚点是否进入url统计
    senseQuery: senseQuery, // url参数是否进入url统计
    performanceMonitor: performanceMonitor, // 是否开启性能监控
    ignoreParams: ignoreParams // 开启url参数上报时，可忽略部分参数拼接上报
  })
  return {
    send (options = {}) {
      if (!options) {
        return
      }
      if (typeof options === 'string') {
        options = { event: options }
      }
      const defaultOption = {type: 'click', event: '', data: {}}
      options = Object.assign({}, defaultOption, options)
      MtaH5.clickStat(options.event, options.data || {})
      if (debug) {
        console.log(`event_type=${options.type}, event_id=${options.event}, data=`, { data: options.data })
      }
    },
    ...MtaH5
  }
  // MtaH5.pgv()
}

export default WebLogger
