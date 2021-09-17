import { baseLogger, config, reporterConfig } from '../type'
import baidu from './baidu'
import uweb from './uweb'
import vue from '../vue'
const logger = {
  baidu,
  uweb
}

async function getReporter (options): Promise<baseLogger> {
  try {
    return logger[options.type](options)
  } catch (error) {
    console.log('实例不存在，请配置onSend，自行实现上报')
    return {
      send: () => {}
    }
  }
}

const Logger: reporterConfig = async function (logOptions: config) {
  const options = { ...logOptions }
  Logger.options = options
  options.beforeInit && options.beforeInit(options.config)
  Logger.reporter = Logger.reporter || (await getReporter(options))
  if (options.autoClick) {
    document.addEventListener('click', function (event: MouseEvent) {
      const targetElement = event.target as HTMLInputElement
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
        error
      }
      options.autoErrorSend && Logger.send('error', errorData)
      options.onError && options.onError(errorData, Logger)
    }
  }
  const et = Date.now()
  options.onPageview && options.onPageview(Logger)
  window.onbeforeunload = () => options.onTonp && options.onTonp(Logger, {
    et,
    dt: Date.now()
  })
  return Logger
}
Logger.options = {
  type: 'baidu',
  config: {
    siteId: ''
  }
}
Logger.send = async function (value, data, event?: MouseEvent) {
  const options = Logger.options
  const reporter = Logger.reporter || (await getReporter(options))
  if (options && options.autoSend) {
    reporter.send(value, data)
  }
  options && options.onSend && options.onSend(value, data, reporter, event)
}

Logger.Vue = vue
export default Logger
