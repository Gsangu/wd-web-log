/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:51:41 am
 * Last Modified: Sunday, 29th December 2019 12:51:41 am
 * Modified By: Gsan
 */
import mta from './mta'
import defaultOptions from '../defaultOptions'
const logger = {
  mta
}
let reporter = null
let options = null
const Logger = (logOptions = {}) => {
  options = Object.assign({}, defaultOptions, logOptions)
  if (!logger.hasOwnProperty(options.type)) {
    throw new Error('上报平台不存在或者尚未支持')
  }
  reporter = logger[options.type](options)
  if (options.autoClick) {
    document.addEventListener('click', function (event) {
      const targetElement = event.target
      const text = targetElement.innerText || targetElement.value
      if (text) {
        Logger.send(`auto_${text}`, event)
      }
    })
  }
  return reporter
}

Logger.send = (value, event) => {
  if (!reporter || !options) {
    throw new Error('实例不存在')
  }
  if (options.autoSend) {
    reporter.send(value)
  }
  options.onSend && options.onSend(value, reporter, event)
}
export default Logger
