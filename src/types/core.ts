/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @sdkVersion sdk版本
 * @extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface IDefaultOptons {
  sdkVersion: string | number
  uuid: string | undefined
  requestUrl: string | undefined
  extra: Record<string, any> | undefined
  historyTracker: boolean
  hashTracker: boolean
  domTracker: boolean
  jsError: boolean
}

export interface IOptions extends Partial<IDefaultOptons> {
  requestUrl: string
}

export enum TrackerConfig {
  version = "1.0.0",
  targetKey = "scctag", // dom事件上报属性key
}

export type reportTrackerData = {
  [key: string]: any
  event: string
  targetKey: string
}

export const mouseEventList: string[] = ["click", "contextmenu"]
