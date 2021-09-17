/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/*
 * FileName: uweb.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 2:48:38 pm
 * Last Modified: Tuesday, 17th March 2020 2:48:38 pm
 * Modified By: Gsan
 */
import dynamicLoadScript from '../utils/dynamicLoadScript'
import log from '../utils/log'
import uweb from '../utils/uwebSDK'
import { loggerConfig, uwebOptions, uwebConfig, logger } from '../types'

declare global {
  interface Window {
    _czc: any
  }
}

const WebLogger: logger = async ({ debug = false, config }: loggerConfig) => {
  if (debug) {
    console.log('init uweb', config)
  }
  let { src = 'https://s11.cnzz.com/z_stat.php', siteId = '', autoPageview } = config as uwebConfig
  await dynamicLoadScript(`${src}?id=${siteId}&web_id=${siteId}`)
  if (!window._czc) {
    log.danger('loading uweb statistics script failed, please check src and siteId')
  }
  if (autoPageview !== false) {
    autoPageview = true
  }
  uweb.setAccount(siteId)
  uweb.setAutoPageview(autoPageview)
  return {
    send (options: uwebOptions | string, data?: string) {
      if (!options) {
        return
      }
      if (typeof options === 'string') {
        options = { category: options, action: data || options }
      }
      const { type = 'trackEvent', category = '', action = '', label = '', value = '', nodeid = '' } = options
      const arg: Array<string> = []
      if (category) arg.push(category)
      if (action) arg.push(action)
      if (label) arg.push(label)
      if (value) arg.push(value)
      if (nodeid) arg.push(nodeid)
      const event = this[type]
      if (!event) {
        log.danger('type undefinded')
        return
      }
      if (!window._czc) {
        log.danger('loading uweb statistics script failed')
      } else {
        event(...arg)
      }
      if (debug) {
        log.primary(`event_type=${type}, category=${category}, action=${action}, label=${label}, value=${value}, nodeid=${nodeid}`)
      }
    },
    ...uweb
  }
}

export default WebLogger
