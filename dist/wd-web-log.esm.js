import MtaH5 from 'mta-h5-analysis';

/*
 * FileName: mta.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:47:11 am
 * Last Modified: Sunday, 29th December 2019 12:47:11 am
 * Modified By: Gsan
 */
const WebLogger = function ({debug = false, config = {}}) {
  if (debug) {
    console.log('init mta', config);
  }
  const { sid = '', cid = '', autoReport = 1, senseHash = 1, senseQuery = 0, performanceMonitor = 0, ignoreParams = 0 } = config;
  MtaH5.init({
    sid: sid, // 必填，统计用的appid
    cid: cid, // 如果开启自定义事件，此项目为必填，否则不填
    autoReport: autoReport, // 是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
    senseHash: senseHash, // hash锚点是否进入url统计
    senseQuery: senseQuery, // url参数是否进入url统计
    performanceMonitor: performanceMonitor, // 是否开启性能监控
    ignoreParams: ignoreParams // 开启url参数上报时，可忽略部分参数拼接上报
  });
  return Object.assign({}, {
    send (options = {}, data = '') {
      if (!options) {
        return
      }
      if (typeof options === 'string') {
        options = { event: options, data };
      }
      const defaultOption = {type: 'click', event: '', data: {}};
      options = Object.assign({}, defaultOption, options);
      MtaH5.clickStat(options.event, options.data || {});
      if (debug) {
        console.log(`event_type=${options.type}, event_id=${options.event}, data=`, { data: options.data });
      }
    },
  }, MtaH5)
  // MtaH5.pgv()
};

let callbacks = [];

const dynamicLoadScript = (src, isLoad) => {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(src);
    const cb = function () {
      resolve();
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src; // src url for the third-party library being loaded.
      script.id = src;
      document.body.appendChild(script);
      callbacks.push(cb);
      const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd;
      onEnd(script);
    }

    if (existingScript && cb) {
      if (isLoad && isLoad()) {
        cb();
      } else {
        callbacks.push(cb);
      }
    }

    function stdOnEnd(script) {
      script.onload = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null;
        for (const cb of callbacks) {
          cb(null, script);
        }
        callbacks = null;
      };
      script.onerror = function () {
        this.onerror = this.onload = null;
        reject(new Error('Failed to load ' + src), script);
      };
    }

    function ieOnEnd(script) {
      script.onreadystatechange = function () {
        if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
        this.onreadystatechange = null;
        for (const cb of callbacks) {
          cb(null, script); // there is no way to catch loading errors in IE8
        }
        callbacks = null;
      };
    }
  })
};

/*
 * FileName: baidu.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 3:02:40 pm
 * Last Modified: Tuesday, 17th March 2020 3:02:41 pm
 * Modified By: Gsan
 */
const deferred = {};
deferred.promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve;
  deferred.reject = reject;
});
const methods = [
  'trackPageview', // 用于发送某个URL的PV统计请求，适用于统计AJAX、异步加载页面，友情链接，下载链接的流量 https://tongji.baidu.com/web/help/article?id=236&type=0
  'trackEvent', // 用于发送页面上按钮等交互元素被触发时的事件统计请求。https://tongji.baidu.com/web/help/article?id=236&type=0
];

const baidu = {
  /**
   * internal user only
   */
  _cache: [],
  /**
   * internal user only, resolve the promise
   */
  _resolve() {
    deferred.resolve();
  },
  /**
   * internal user only, reject the promise
   */
  _reject() {
    deferred.reject();
  },

  /**
   * push the args into _czc, or _cache if the script is not loaded yet
   */
  _push(...args) {
    this.debug(args);
    if (window._hmt) {
      window._hmt.push(...args);
    } else {
      this._cache.push(...args);
    }
  },
  /**
   * general method to create baidu analystics apis
   */
  _createMethod(method) {
    return (...args) => {
      this._push([`_${method}`, ...args]);
    }
  },

  /**
   * debug
   */
  debug() {},
  /**
   * the plugins is ready when the script is loaded
   */
  ready() {
    return deferred.promise
  },
  /**
   * patch up to create new api
   */
  patch(method) {
    this[method] = this._createMethod(method);
  },
};

// baidu apis
methods.forEach((method) => (baidu[method] = baidu._createMethod(method)));

/*
 * FileName: log.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 5:20:14 pm
 * Last Modified: Tuesday, 17th March 2020 5:20:14 pm
 * Modified By: Gsan
 */
const log = {};

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
function typeColor (type = 'default') {
  let color = '';
  switch (type) {
    case 'default': color = '#35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
  }
  return color
}

/**
 * @description 打印一个 [ title | text ] 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
log.capsule = function (title, info, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  );
};

/**
 * @description 打印彩色文字
 */
log.colorful = function (textArr) {
  console.log(
    `%c${textArr.map(t => t.text || '').join('%c')}`,
    ...textArr.map(t => `color: ${typeColor(t.type)};`)
  );
};

/**
 * @description 打印 default 样式的文字
 */
log.default = function (text) {
  log.colorful([{ text }]);
};

/**
 * @description 打印 primary 样式的文字
 */
log.primary = function (text) {
  log.colorful([{ text, type: 'primary' }]);
};

/**
 * @description 打印 success 样式的文字
 */
log.success = function (text) {
  log.colorful([{ text, type: 'success' }]);
};

/**
 * @description 打印 warning 样式的文字
 */
log.warning = function (text) {
  log.colorful([{ text, type: 'warning' }]);
};

/**
 * @description 打印 danger 样式的文字
 */
log.danger = function (text) {
  log.colorful([{ text, type: 'danger' }]);
};

/*
 * FileName: baidu.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 12:03:06 pm
 * Last Modified: Tuesday, 17th March 2020 12:03:06 pm
 * Modified By: Gsan
 */

const WebLogger$1 = async ({ debug = false, config = {} }) => {
  if (debug) {
    console.log('init baidu', config);
  }
  const { src = 'https://hm.baidu.com/hm.js', siteId = '' } = config;
  await dynamicLoadScript(`${src}?${siteId}`);
  if (!window._hmt) {
    log.danger('loading baidu statistics script failed, please check src and siteId');
  }
  return Object.assign(
    {},
    {
      send(options = {}, data = '') {
        if (!options) {
          return
        }
        if (typeof options === 'string') {
          options = { category: options, action: data || options };
        }
        if (!options.category || !options.action) {
          console.warn('category and action is required');
        }
        const { type = 'trackEvent', category = '', action = '', opt_label = '', opt_value = '' } = options;
        const arg = [];
        if (category) arg.push(category);
        if (action) arg.push(action);
        if (opt_label) arg.push(opt_label);
        if (opt_value) arg.push(opt_value);
        if (!arg.length) {
          console.warn('event undefinded');
        }
        const event = this[type];
        if (!event) {
          log.danger('type undefinded');
          return
        }
        if (!window._hmt) {
          log.danger('loading baidu statistics script failed');
        } else {
          event(...arg);
        }
        if (debug) {
          log.primary(`event_type=${type}, category=${category}, action=${action}, opt_label=${opt_label}, opt_value=${opt_value}`);
        }
      },
    },
    baidu
  )
};

/*
 * FileName: person.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Monday, 1st March 2021 4:45:10 pm
 * Last Modified: Monday, 1st March 2021 4:45:11 pm
 * Modified By: Gsan
 */
const WebLogger$2 = async ({ debug = false, config = {} }) => {
  if (debug) {
    console.log('init person', config);
  }
  return {
    send() {
      return
    },
  }
};

/*
 * FileName: uwebSDK.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 2:48:38 pm
 * Last Modified: Tuesday, 17th March 2020 2:48:38 pm
 * Modified By: Gsan
 */
const deferred$1 = {};
deferred$1.promise = new Promise((resolve, reject) => {
  deferred$1.resolve = resolve;
  deferred$1.reject = reject;
});
const methods$1 = [
  'trackPageview', // 用于发送某个URL的PV统计请求，适用于统计AJAX、异步加载页面，友情链接，下载链接的流量 doc: http://open.cnzz.com/a/api/trackpageview/
  'trackEvent', // 用于发送页面上按钮等交互元素被触发时的事件统计请求。doc: http://open.cnzz.com/a/api/trackevent/
  'setCustomVar', // 用于发送为访客打自定义标记的请求，用来统计会员访客、登录访客、不同来源访客的浏览数据。 http://open.cnzz.com/a/api/setcustomvar/
  'setAccount', // 当您的页面上添加了多个CNZZ统计代码时，需要用到本方法绑定需要哪个siteid对应的统计代码来接受API发送的请求。未绑定的siteid将忽略相关请求。 http://open.cnzz.com/a/api/setaccount/
  'setAutoPageview', // 如果您使用trackPageview改写了已有页面的URL，那么建议您在CNZZ的JS统计代码执行前先调用setAutoPageview，将该页面的自动PV统计关闭，防止页面的流量被统计双倍。 http://open.cnzz.com/a/api/setautopageview/
  'deleteCustomVar', // 发送删除自定义访客标签的请求。将访客身上已被标记的自定义访客类型去掉，去掉后不再继续统计。 http://open.cnzz.com/a/api/deletecustomvar/
];

const uweb = {
  /**
   * internal user only
   */
  _cache: [],
  /**
   * internal user only, resolve the promise
   */
  _resolve() {
    deferred$1.resolve();
  },
  /**
   * internal user only, reject the promise
   */
  _reject() {
    deferred$1.reject();
  },

  /**
   * push the args into _czc, or _cache if the script is not loaded yet
   */
  _push(...args) {
    this.debug(args);
    if (window._czc) {
      window._czc.push(...args);
    } else {
      this._cache.push(...args);
    }
  },
  /**
   * general method to create baidu analystics apis
   */
  _createMethod(method) {
    return (...args) => {
      this._push([`_${method}`, ...args]);
    }
  },

  /**
   * debug
   */
  debug() {},
  /**
   * the plugins is ready when the script is loaded
   */
  ready() {
    return deferred$1.promise
  },
  /**
   * patch up to create new api
   */
  patch(method) {
    this[method] = this._createMethod(method);
  },
};

// uweb apis
methods$1.forEach((method) => (uweb[method] = uweb._createMethod(method)));

/*
 * FileName: uweb.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Tuesday, 17th March 2020 2:48:38 pm
 * Last Modified: Tuesday, 17th March 2020 2:48:38 pm
 * Modified By: Gsan
 */
const WebLogger$3 = async ({ debug = false, config = {} }) => {
  if (debug) {
    console.log('init uweb', config);
  }
  let { src = 'http://s11.cnzz.com/z_stat.php', siteId = '', autoPageview } = config;
  await dynamicLoadScript(`${src}?id=${siteId}&web_id=${siteId}`);
  if (!window._czc) {
    log.danger('loading uweb statistics script failed, please check src and siteId');
  }
  if (autoPageview !== false) {
    autoPageview = true;
  }
  uweb.setAccount(siteId);
  uweb.setAutoPageview(autoPageview);
  return Object.assign(
    {},
    {
      send(options = {}, data = '') {
        if (!options) {
          return
        }
        if (typeof options === 'string') {
          options = { category: options, action: data || options };
        }
        if (!options.category || !options.action) {
          console.warn('category and action is required');
        }
        const { type = 'trackEvent', category = '', action = '', label = '', value = '', nodeid = '' } = options;
        const arg = [];
        if (category) arg.push(category);
        if (action) arg.push(action);
        if (label) arg.push(label);
        if (value) arg.push(value);
        if (nodeid) arg.push(nodeid);
        if (!arg.length) {
          console.warn('event undefinded');
        }
        const event = this[type];
        if (!event) {
          log.danger('type undefinded');
          return
        }
        if (!window._czc) {
          log.danger('loading uweb statistics script failed');
        } else {
          event(...arg);
        }
        if (debug) {
          log.primary(`event_type=${type}, category=${category}, action=${action}, label=${label}, value=${value}, nodeid=${nodeid}`);
        }
      },
    },
    uweb
  )
};

/* eslint-disable */
/*
 * FileName: defaultOptions.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:28:32 am
 * Last Modified: Sunday, 29th December 2019 12:28:32 am
 * Modified By: Gsan
 */

var defaultOptions = {
  // 当前版本
  version: SDK_VERSION,
  // 是否自动收集点击事件
  autoClick: false,
  // 是否开启自动上报 若关闭自行请在在事件中手动上报
  autoSend: true,
  // 是否开启异常上报
  autoError: false,
  // 异常上报
  autoErrorSend: false,
  // 开启debug
  debug: false,
  // 上报平台 目前支持 mta,baidu,uweb
  type: 'mta',
  // 上报平台配置
  config: {},
  // 发送事件
  onSend: (sendEvent, sendData, reporter, event) => {},
  // 错误捕捉
  onError: (error) => {},
};

/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:51:41 am
 * Last Modified: Sunday, 29th December 2019 12:51:41 am
 * Modified By: Gsan
 */
const logger = {
  mta: WebLogger,
  baidu: WebLogger$1,
  uweb: WebLogger$3,
  person: WebLogger$2,
};

function getReporter(options) {
  try {
    return logger[options.type](options)
  } catch (error) {
    console.log('实例不存在，请配置onSend，自行实现上报');
    return logger.person(options)
  }
}

const Logger = async function (logOptions = {}) {
  const options = Object.assign({}, defaultOptions, logOptions);
  Logger.options = options;
  options.beforeInit && options.beforeInit(options.config);
  Logger.reporter = Logger.reporter || (await getReporter(options));
  if (options.autoClick) {
    document.addEventListener('click', function (event) {
      const targetElement = event.target;
      const text = targetElement.innerText || targetElement.value;
      if (text) {
        Logger.send(`auto_${text}`, '', event);
      }
    });
  }
  if (options.autoError) {
    window.onerror = function (event, source, lineno, colno, error) {
      const errorData = {
        event,
        source,
        lineno,
        colno,
        error,
      };
      options.autoErrorSend && Logger.send('error', errorData);
      Logger.options.onError && Logger.options.onError(errorData, Logger);
    };
  }
  return Logger
};

Logger.send = async function (value, data, event) {
  const options = Logger.options;
  const reporter = Logger.reporter || (await getReporter(options));
  if (options.autoSend) {
    reporter.send(value, data);
  }
  options.onSend && options.onSend(value, data, reporter, event);
};

/*
 * FileName: index.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Sunday, 29th December 2019 12:02:56 am
 * Last Modified: Sunday, 29th December 2019 12:02:57 am
 * Modified By: Gsan
 */
const install = (Vue, options) => {
  Logger(options);
  // 注册一个全局自定义指令 `v-log`
  Vue.directive('log', {
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, binding) {
      // 获取值
      const { value } = binding;
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-log="\'click\'"')
      }
      el.addEventListener('click', function (event) {
        Logger.send(value, '', event);
      });
    },
  });
  // v-stat
  Vue.directive('stat', {
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, binding) {
      // 获取值
      const { value } = binding;
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-stat="\'view\'"')
      }
      Logger.send(value, '');
    },
  });
  if (Logger.options.autoError) {
    Vue.config.errorHandler = function (err, vm, info) {
      const errorData = {
        err,
        vm,
        info,
      };
      // 上报异常
      Logger.send('error', errorData);
      Logger.options.onError && Logger.options.onError(errorData, Logger);
    };
  }
  if (!Vue.prototype.$stat) {
    Object.defineProperty(Vue.prototype, '$stat', { value: Logger.send });
  }
  if (!Vue.prototype.$wdLog) {
    Object.defineProperty(Vue.prototype, '$wdLog', { value: Logger });
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.WdVueLog = { install };
  // install(window.Vue);
}
var vue = {
  install,
};

Logger.Vue = vue;

// export default async function (){
//   return 'test'
// }

export default Logger;
