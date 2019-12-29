# wd-web-log

> a simple web log

## 开发调试
安装相关依赖，执行
```
npm run start
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
  // 开启debug
  debug: false,
  // 上报平台 目前支持 mta
  type: 'mta',
  // 上报平台配置
  config: {},
  // 发送事件 reporter带有send方法，用于上报事件，里面包含官方的所有方法
  onSend: (sendData, reporter, event) => {}
}

// vue
import { VueLogger } from 'wd-web-log'
Vue.use(VueLogger, config)

// use v-log="'event'" or v-log="{event:''}"
this.$stat({
  event: ''
})

import Logger from 'wd-web-log'
Logger.send({
  event: ''
})
Logger.pgv()
```
### 浏览器
```html
<script src="https://cdn.jsdelivr.net/npm/wd-web-log/dist/wd-web-log.js"></script>
<script>
  var logger = WdWebLog.default(config);
  logger.pgv();
  document.querySelector('#test').addEventListener('click', function (e) {
    logger.send('test');
    // logger.send({});
  })
</script>
```
