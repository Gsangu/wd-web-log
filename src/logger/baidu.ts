/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/*
 * FileName: baidu.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 12:03:06 pm
 * Last Modified: Tuesday, 17th March 2020 12:03:06 pm
 * Modified By: Gsan
 */
import dynamicLoadScript from '../utils/dynamicLoadScript'
import baidu from '../utils/baiduSDK'
import log from '../utils/log'
import { loggerConfig, baiduConfig, baiduOptions, logger } from '../type'

declare global {
  interface Window {
    _hmt: any
  }
}

const WebLogger: logger = async ({ debug = false, config }: loggerConfig) => {
  if (debug) {
    console.log('init baidu', config)
  }
  const { src = 'https://hm.baidu.com/hm.js', siteId = '' } = config as baiduConfig
  await dynamicLoadScript(`${src}?${siteId}`)
  if (!window._hmt) {
    log.danger('loading baidu statistics script failed, please check src and siteId')
  }
  return {
    send (options: baiduOptions | string, data: string) {
      if (!options) {
        return
      }
      if (typeof options === 'string') {
        options = { category: options, action: data || options }
      }
      if (!options.category || !options.action) {
        console.warn('category and action is required')
      }
      const { type = 'trackEvent', category = '', action = '', opt_label = '', opt_value = '' } = options
      const arg: Array<string> = []
      if (category) arg.push(category)
      if (action) arg.push(action)
      if (opt_label) arg.push(opt_label)
      if (opt_value) arg.push(opt_value)
      if (!arg.length) {
        console.warn('event undefinded')
      }
      const event = this[type]
      if (!event) {
        log.danger('type undefinded')
        return
      }
      if (!window._hmt) {
        log.danger('loading baidu statistics script failed')
      } else {
        event(...arg)
      }
      if (debug) {
        log.primary(`event_type=${type}, category=${category}, action=${action}, opt_label=${opt_label}, opt_value=${opt_value}`)
      }
    },
    ...baidu
  }
}

export default WebLogger
