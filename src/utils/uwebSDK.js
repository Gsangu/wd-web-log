/*
 * FileName: uwebSDK.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 2:48:38 pm
 * Last Modified: Tuesday, 17th March 2020 2:48:38 pm
 * Modified By: Gsan
 */
const deferred = {}
deferred.promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve
  deferred.reject = reject
})
const methods = [
  'trackPageview', // 用于发送某个URL的PV统计请求，适用于统计AJAX、异步加载页面，友情链接，下载链接的流量 doc: https://tongji.baidu.com/web/help/article?id=236&type=0
  'trackEvent', // 用于发送页面上按钮等交互元素被触发时的事件统计请求。doc: https://tongji.baidu.com/web/help/article?id=236&type=0
  'setCustomVar', // 用于发送为访客打自定义标记的请求，用来统计会员访客、登录访客、不同来源访客的浏览数据。 http://open.cnzz.com/a/api/setcustomvar/
  'setAccount', // 当您的页面上添加了多个CNZZ统计代码时，需要用到本方法绑定需要哪个siteid对应的统计代码来接受API发送的请求。未绑定的siteid将忽略相关请求。 http://open.cnzz.com/a/api/setaccount/
  'setAutoPageview', // 如果您使用trackPageview改写了已有页面的URL，那么建议您在CNZZ的JS统计代码执行前先调用setAutoPageview，将该页面的自动PV统计关闭，防止页面的流量被统计双倍。 http://open.cnzz.com/a/api/setautopageview/
  'deleteCustomVar' // 发送删除自定义访客标签的请求。将访客身上已被标记的自定义访客类型去掉，去掉后不再继续统计。 http://open.cnzz.com/a/api/deletecustomvar/
]

const uweb = {
  /**
  * internal user only
  */
  _cache: [],
  /**
   * internal user only, resolve the promise
   */
  _resolve () {
    deferred.resolve()
  },
  /**
     * internal user only, reject the promise
     */
  _reject () {
    deferred.reject()
  },

    /**
   * push the args into _czc, or _cache if the script is not loaded yet
   */
  _push (...args) {
    this.debug(args)
    if (window._czc) {
      window._czc.push(...args)
    } else {
      this._cache.push(...args)
    }
  },
  /**
   * general method to create baidu analystics apis
   */
  _createMethod (method) {
    return (...args) => {
      this._push([`_${method}`, ...args])
    }
  },

  /**
   * debug
   */
  debug () {},
  /**
   * the plugins is ready when the script is loaded
   */
  ready () {
    return deferred.promise
  },
  /**
     * patch up to create new api
     */
  patch (method) {
    this[method] = this._createMethod(method)
  }
}

// uweb apis
methods.forEach((method) => (uweb[method] = uweb._createMethod(method)))

export default uweb
