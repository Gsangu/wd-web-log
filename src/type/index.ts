
export type supportTypes = 'uweb' | 'baidu'

export interface uwebConfig {
  src?: string,
  siteId: string,
  autoPageview?: boolean
}

export interface baiduConfig {
  src?: string,
  siteId: string
}

export type supportConfig = uwebConfig | baiduConfig

export interface loggerConfig {
  debug: false,
  config: supportConfig
}

export interface uwebOptions {
  category: string,
  action: string,
  label?: string,
  value?: string,
  nodeid?: string,
  type?: 'trackPageview' | 'trackEvent' | 'setCustomVar' | 'setAccount' | 'setAutoPageview' | 'deleteCustomVar'
}

export interface baiduOptions {
  category: string
  action: string
  // eslint-disable-next-line camelcase
  opt_label?: string
  // eslint-disable-next-line camelcase
  opt_value?: string
  type?: 'trackPageview' | 'trackEvent'
}
export interface baseLogger {
  send(options: supportConfig | string, data: string): void
  [x: string]: any
}
export interface logger {
  (loggerConfig: loggerConfig): Promise<baseLogger>
}

export interface reporterConfig {
  // eslint-disable-next-line no-use-before-define
  (logOptions: config): Promise<reporterConfig>
  Vue: object
  // eslint-disable-next-line no-use-before-define
  options: config
  send(value: any, data?: any, event?: Event): void
  beforeInit?(config: supportConfig): void
  reporter?: baseLogger
}

export interface tonpOptions {
  et: number,
  dt: number
}

export interface config {
  // 是否自动收集点击事件
  autoClick?: boolean,
  // 是否开启自动上报 若关闭自行请在在事件中手动上报
  autoSend?: boolean,
  // 是否开启异常上报
  autoError?: boolean,
  // 异常上报
  autoErrorSend?: boolean,
  // 开启debug
  debug?: boolean,
  // 上报平台 目前支持 baidu,uweb
  type: supportTypes,
  // 上报平台配置
  config: supportConfig,
  beforeInit?(options: supportConfig): void,
  // 发送事件
  onSend?(sendEvent: supportConfig | string, sendData?: any, reporter?: baseLogger, event?: Event): void,
  // 页面跳转上报
  onPageview?(ctx: reporterConfig): void,
  // 页面停留时长统计
  onTonp?(ctx: reporterConfig, time: tonpOptions): void,
  // 错误捕捉
  onError?(error: any, ctx: reporterConfig): void,
}
