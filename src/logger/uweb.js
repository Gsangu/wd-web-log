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
const WebLogger = async ({ debug = false, config = {} }) => {
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
  return Object.assign(
    {},
    {
      send(options = {}, data = '') {
        if (!options) {
          return
        }
        if (typeof options === 'string') {
          options = { category: options, action: data || options }
        }
        if (!options.category || !options.action) {
          console.warn('category and action is required')
        }
        const { type = 'trackEvent', category = '', action = '', label = '', value = '', nodeid = '' } = options
        const arg = []
        if (category) arg.push(category)
        if (action) arg.push(action)
        if (label) arg.push(label)
        if (value) arg.push(value)
        if (nodeid) arg.push(nodeid)
        if (!arg.length) {
          console.warn('event undefinded')
        }
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
    },
    uweb
  )
}

export default WebLogger
