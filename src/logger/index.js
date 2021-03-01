/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:51:41 am
 * Last Modified: Sunday, 29th December 2019 12:51:41 am
 * Modified By: Gsan
 */
import mta from './mta'
import baidu from './baidu'
import person from './person'
import defaultOptions from '../defaultOptions'
const logger = {
  mta,
  baidu,
  person,
}

function getReporter(options) {
  try {
    return logger[options.type](options)
  } catch (error) {
    console.log('实例不存在，请配置onSend，自行实现上报')
    return logger.person(options)
  }
}

const Logger = async function (logOptions = {}) {
  const options = Object.assign({}, defaultOptions, logOptions)
  Logger.options = options
  if (!(options.type in logger)) {
    throw new Error('上报平台不存在或者尚未支持')
  }
  Logger.reporter || (Logger.reporter = await getReporter(options))
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
    window.onerror = function (event, source, lineno, colno, error) {
      const errorData = {
        event,
        source,
        lineno,
        colno,
        error,
      }
      options.autoErrorSend && Logger.send('error', errorData)
      Logger.options.onError && Logger.options.onError(errorData, Logger)
    }
  }
  return Logger
}

Logger.send = async function (value, data, event) {
  const options = Logger.options
  const reporter = Logger.reporter || (await getReporter(options))
  if (options.autoSend) {
    reporter.send(value, data)
  }
  options.onSend && options.onSend(value, data, reporter, event)
}
export default Logger
