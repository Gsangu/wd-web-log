/*
 * FileName: baidu.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 3:02:40 pm
 * Last Modified: Tuesday, 17th March 2020 3:02:41 pm
 * Modified By: Gsan
 */
const deferred = {}
deferred.promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve
  deferred.reject = reject
})
const methods = [
  'trackPageview', // 用于发送某个URL的PV统计请求，适用于统计AJAX、异步加载页面，友情链接，下载链接的流量 https://tongji.baidu.com/web/help/article?id=236&type=0
  'trackEvent' // 用于发送页面上按钮等交互元素被触发时的事件统计请求。https://tongji.baidu.com/web/help/article?id=236&type=0
]

const baidu = {
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
    if (window._hmt) {
      window._hmt.push(...args)
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

// baidu apis
methods.forEach((method) => (baidu[method] = baidu._createMethod(method)))

export default baidu
