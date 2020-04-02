# wd-web-log
> a simple web log
埋点统计插件，支持腾讯mta，百度，友盟

[![npm](https://img.shields.io/npm/v/wd-web-log.svg)](https://www.npmjs.com/package/wd-web-log)
[![Build Status](https://travis-ci.org/Gsangu/wd-web-log.svg?branch=master)](https://travis-ci.org/Gsangu/wd-web-log)
[![npm](https://img.shields.io/npm/dt/wd-web-log.svg)](https://www.npmjs.com/package/wd-web-log)
[![install size](https://packagephobia.now.sh/badge?p=wd-web-log)](https://packagephobia.now.sh/result?p=wd-web-log)
[![GitHub license](https://img.shields.io/github/license/gsangu/wd-web-log.svg)](https://github.com/gsangu/wd-web-log/blob/master/LICENSE)

## 开发调试
安装相关依赖，执行
```
npm run dev
```
浏览器打开examples文件夹下html即可调试

## 构建
```
npm run build
```

## 配置
#### npm
```
npm i wd-web-log
```
```js
// config
const config = {
  // 是否自动收集点击事件 开启则点击元素如果有值会自动上报
  autoClick: false,
  // 是否开启自动上报 若关闭自行请在在事件中手动上报
  autoSend: true,
  // 是否开启异常上报
  autoError: true,
  // 开启debug
  debug: false,
  // 上报平台 支持 mta，baidu，uweb
  type: 'mta',
  // 上报平台配置
  config: {},
  // 发送事件 reporter带有send方法，用于上报事件，里面包含官方的所有方法 (事件详情，事件数据，上报平台实例，点击元素事件对象)
  onSend: (sendEvent, sendData, reporter, event) => {},
  // 错误捕捉
  onError: (error) => {}
}
```
### 使用
**config--上报平台配置**
#### 腾讯 mta
| 参数 | 必输 | 默认 | 说明 | 备注 |
|-----|------|-----|-----|------|
| sid | 是 | | 统计用的appid| |
| cid | 是 | | 如果开启自定义事件，此项目为必填，否则不填| |
| autoReport | 否 | | 是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)| |
| senseHash | 否 | | hash锚点是否进入url统计| |
| senseQuery | 否 | | url参数是否进入url统计| |
| autoReport | 否 | | 绑定要接受API请求的统计代码siteid| |
| performanceMonitor | 否 | | 是否开启性能监控| |
| ignoreParams | 否 | | 开启url参数上报时，可忽略部分参数拼接上报| |
#### 友盟 uweb
| 参数 | 必输 | 默认 | 说明 | 备注 |
|-----|------|-----|-----|------|
| siteId | 是 | | 绑定要接受API请求的统计代码siteid| |
| autoPageview | 否 | true | 是否开启自动统计PV | |
| src | 否 | 精简代码 http://s11.cnzz.com/z_stat.php?id=SITEID&web_id=SITEID | 指定统计脚本标签的 src 属性 | |
#### 百度 baidu
| 参数 | 必输 | 默认 | 说明 | 备注 |
|-----|------|-----|-----|------|
| siteId | 是 | | 绑定要接受API请求的统计代码siteid| |
| src | 否 | 精简代码 https://hm.baidu.com/hm.js?SITEID | 指定统计脚本标签的 src 属性 | |


```js
// vue
import Logger from 'wd-web-log'
Vue.use(Logger.Vue, config)

// use v-log="'event'" or v-log="{event:'',data:{}}"
this.$stat({
  event: '',
  data: {}
})
// uweb原生方法
this.$wdLog.reporter.setAccount(siteId)

import Logger from 'wd-web-log'
Logger()
// mta example
Logger.send('')
// mta 原生方法
Logger.reporter.pgv()
```
### 浏览器
```html
<script src="https://cdn.jsdelivr.net/npm/wd-web-log/dist/wd-web-log.js"></script>
<script>
    WdWebLog({
      debug: true,
      // autoSend: true,
      autoSend: false,
      // 是否开启异常上报
      autoError: true,
      // 开启debug
      debug: true,
      // 上报平台 支持 mta,baidu,uweb
      type: 'mta',
      // 上报平台配置
      config: {},
      // 发送事件
      onSend: (sendEvent, sendData, reporter, event) => {
        console.log(sendEvent)
        // reporter.send(sendEvent, sendData)
        reporter.send('sendEvent' + sendEvent, sendData)
      },
      // 错误捕捉
      onError: (error) => {
        console.log('异常捕捉:', error)
      }
    }).then(function (logger) {
      document.querySelector('#test').addEventListener('click', function (e) {
        logger.send('test');
        // logger.send({});
      })
    });
</script>
```
