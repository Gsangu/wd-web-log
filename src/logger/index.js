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
const Logger = (logOptions = {}) => {
  const options = Object.assign({}, defaultOptions, logOptions)
  Logger.options = options
  if (!(options.type in logger)) {
    throw new Error('上报平台不存在或者尚未支持')
  }
  Logger.reporter = logger[options.type](options)
  if (options.autoClick) {
    document.addEventListener('click', function (event) {
      const targetElement = event.target
      const text = targetElement.innerText || targetElement.value
      if (text) {
        Logger.send(`auto_${text}`, '', event)
      }
    })
  }
  if (options.autoError) {
    window.onerror = function(event, source, lineno, colno, error) {
      const errorData = {
        event,
        source,
        lineno,
        colno,
        error
      }
      Logger.send('error', errorData)
      Logger.options.onError && Logger.options.onError(errorData, Logger)
    }
  }
  return Logger
}

Logger.send = (value, data , event) => {
  const options = Logger.options
  const reporter = Logger.reporter
  if (!reporter || !options) {
    throw new Error('实例不存在')
  }
  if (options.autoSend) {
    reporter.send(value, data)
  }
  options.onSend && options.onSend(value, data, reporter, event)
}
export default Logger
