/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:02:56 am
 * Last Modified: Sunday, 29th December 2019 12:02:57 am
 * Modified By: Gsan
 */
import Logger from './logger'
const install = (Vue, options) => {
  const reporter = Logger(options)
  // 注册一个全局自定义指令 `v-log`
  Vue.directive('log', {
    // 当被绑定的元素插入到 DOM 中时
    inserted (el, binding, vNode) {
      // 获取值
      const { value } = binding
      // 添加事件监听
      if (!value) {
        throw new Error(`Like v-log="'click'"`)
      }
      el.addEventListener('click', function (event) {
        Logger.send(value, '', event)
      })
    }
  })
  // v-stat
  Vue.directive('stat', {
    // 当被绑定的元素插入到 DOM 中时
    inserted (el, binding, vNode) {
      // 获取值
      const { value } = binding
      // 添加事件监听
      if (!value) {
        throw new Error(`Like v-stat="'view'"`)
      }
      Logger.send(value, '')
    }
  })
  if (Logger.options.autoError) {
    Vue.config.errorHandler = function (err, vm, info) {
      const { message, stack } = err

      // Processing error
      let resourceUrl, col, line
      let errs = stack.match(/\(.+?\)/)
      if (errs && errs.length) errs = errs[0]
      errs = errs.replace(/\w.+js/g, $1 => {
        resourceUrl = $1; return ''
      })
      errs = errs.split(':')
      if (errs && errs.length > 1) line = parseInt(errs[1] || 0); col = parseInt(errs[2] || 0)

      const errorData = {
        msg: message,
        col: col,
        line: line,
        resourceUrl: resourceUrl
      }
        // 上报异常
      Logger.send('error', errorData)
      Logger.options.onError && Logger.options.onError(errorData)
    }
  }
  if (!Vue.prototype.$stat) {
    Object.defineProperty(Vue.prototype, `$stat`, { value: reporter.send })
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.WdVueLog = { install }
  // install(window.Vue);
}
export default {
  install
}
