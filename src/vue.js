/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:02:56 am
 * Last Modified: Sunday, 29th December 2019 12:02:57 am
 * Modified By: Gsan
 */
import Logger from './logger/index'
const install = (Vue, options) => {
  Logger(options)
  // 注册一个全局自定义指令 `v-log`
  Vue.directive('log', {
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, binding) {
      // 获取值
      const { value } = binding
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-log="\'click\'"')
      }
      el.addEventListener('click', function (event) {
        Logger.send(value, '', event)
      })
    },
  })
  // v-stat
  Vue.directive('stat', {
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, binding) {
      // 获取值
      const { value } = binding
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-stat="\'view\'"')
      }
      Logger.send(value, '')
    },
  })
  if (Logger.options.autoError) {
    Vue.config.errorHandler = function (err, vm, info) {
      const errorData = {
        err,
        vm,
        info,
      }
      // 上报异常
      Logger.send('error', errorData)
      Logger.options.onError && Logger.options.onError(errorData, Logger)
    }
  }
  Vue.mixin({
    data: () => ({
      PAGE_ENTER_TIME: Date.now(),
    }),
    created() {
    },
    beforeRouteUpdate(to, from, next) {
      // 确保导航升级完成
      this.$watch('$route', () => {
        Logger.options.onPageview && Logger.options.onPageview(Logger)
      })
      next()
    },
    // 页面停留时间
    beforeRouteLeave(to, from, next) {
      Logger.options.onTonp && Logger.options.onTonp(Logger, {
        et: this.PAGE_ENTER_TIME,
        dt: Date.now()
      })
      next()
    }
  })
  if (!Vue.prototype.$stat) {
    Object.defineProperty(Vue.prototype, '$stat', { value: Logger.send })
  }
  if (!Vue.prototype.$wdLog) {
    Object.defineProperty(Vue.prototype, '$wdLog', { value: Logger })
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.WdVueLog = { install }
  // install(window.Vue);
}
export default {
  install,
}
