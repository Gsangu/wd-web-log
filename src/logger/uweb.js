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

const WebLogger = async ({debug = false, config = {}}) => {
  if (debug) {
    console.log('init uweb', config)
  }
  let { src = 'http://s11.cnzz.com/z_stat.php', siteId = '', autoPageview } = config
  await dynamicLoadScript(`${src}?id=${siteId}&web_id=${siteId}`)
  if (!window._czc) {
    log.danger('loading uweb statistics script failed, please check src and siteId')
  }
  if (autoPageview !== false) {
    autoPageview = true
  }
  uweb.setAccount(siteId)
  uweb.setAutoPageview(autoPageview)
  return Object.assign({}, {
    send (options = {}, data = '') {
      if (!options) {
        return
      }
      if (typeof options === 'string') {
        options = { category: options, action: data }
      }
      const { type = 'trackEvent', category = '', action = '', opt_label = '', opt_value = '' } = options
      const arg = []
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
      }
      if (!window._hmt) {
        log.danger('loading baidu statistics script failed')
      } else {
        event(arg)
      }
      if (debug) {
        log.primary(`event_type=${type}, category=${category}, action=${action}, opt_label=${opt_label}, opt_value=${opt_value}`)
      }
    },
  }, uweb)
}

export default WebLogger
