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
  autoError: true,
  // 开启debug
  debug: false,
  // 上报平台 目前支持 mta
  type: 'mta',
  // 上报平台配置
  config: {},
  // 发送事件
  onSend: (sendEvent, sendData, reporter, event) => {},
  // 错误捕捉
  onError: (error) => {}
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
  mta: WebLogger
};
const Logger = (logOptions = {}) => {
  const options = Object.assign({}, defaultOptions, logOptions);
  Logger.options = options;
  if (!(options.type in logger)) {
    throw new Error('上报平台不存在或者尚未支持')
  }
  Logger.reporter = logger[options.type](options);
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
    window.onerror = function(event, source, lineno, colno, error) {
      const errorData = {
        event,
        source,
        lineno,
        colno,
        error
      };
      Logger.send('error', errorData);
      Logger.options.onError && Logger.options.onError(errorData, Logger);
    };
  }
  return Logger
};

Logger.send = (value, data , event) => {
  const options = Logger.options;
  const reporter = Logger.reporter;
  if (!reporter || !options) {
    throw new Error('实例不存在')
  }
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
    inserted (el, binding) {
      // 获取值
      const { value } = binding;
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-log="\'click\'"')
      }
      el.addEventListener('click', function (event) {
        Logger.send(value, '', event);
      });
    }
  });
  // v-stat
  Vue.directive('stat', {
    // 当被绑定的元素插入到 DOM 中时
    inserted (el, binding) {
      // 获取值
      const { value } = binding;
      // 添加事件监听
      if (!value) {
        throw new Error('Like v-stat="\'view\'"')
      }
      Logger.send(value, '');
    }
  });
  if (Logger.options.autoError) {
    Vue.config.errorHandler = function (err, vm, info) {
      const errorData = {
        err,
        vm,
        info
      };
        // 上报异常
      Logger.send('error', errorData);
      Logger.options.onError && Logger.options.onError(errorData, Logger);
    };
  }
  if (!Vue.prototype.$stat) {
    Object.defineProperty(Vue.prototype, '$stat', { value: Logger.send });
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.WdVueLog = { install };
  // install(window.Vue);
}
var vue = {
  install
};

Logger.Vue = vue;

export default Logger;
