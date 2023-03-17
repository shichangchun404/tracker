import {
  IDefaultOptons,
  IOptions,
  TrackerConfig,
  mouseEventList,
} from "../types/core"
import { createHistoryEvnent } from "../utils/pv"

export default class Tracker {
  data: IOptions
  constructor(options: IOptions) {
    this.data = Object.assign(this.initDefaultOption(), options)
    this.initTracker()
    this.reportTracker()
  }

  // 对外暴露设置uuid
  public setUuid<T extends IDefaultOptons["uuid"]>(uuid: T) {
    this.data.uuid
  }
  // 对外暴露设置扩展字段
  public setExtra<T extends IDefaultOptons["extra"]>(extra: T) {
    this.data.extra
  }

  // 对外暴露主动上报数据
  public sendTracker<T>(data: T) {
    this.reportTracker(data)
  }

  // 初始化默认参数
  private initDefaultOption(): IDefaultOptons {
    window.history.pushState = createHistoryEvnent("pushState")
    window.history.replaceState = createHistoryEvnent("replaceState")
    return {
      uuid: "",
      requestUrl: "",
      historyTracker: true,
      hashTracker: false,
      domTracker: true,
      sdkVersion: TrackerConfig.version,
      extra: undefined,
      jsError: true,
    }
  }

  private initTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(["pushState", "replaceState"], "history-pv")
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv")
    }
    if (this.data.domTracker) {
      this.registerDomEvent()
    }
  }

  private captureEvents<T>(eventList: string[], targetKey: string, data?: T) {
    eventList.forEach((eventName) => {
      window.addEventListener(eventName, () => {
        console.log(`事件${eventName}触发了`)
        this.reportTracker({
          eventName,
          targetKey,
          data,
        })
      })
    })
  }

  // 数据上报 通过navigator.sendBeacon
  private reportTracker<T>(data?: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    })
    console.log("reportTracker params ", params)
    const headers = {
      type: "application/x-www-form-urlencoded",
    }
    const blob = new Blob([JSON.stringify(params)], headers)
    navigator.sendBeacon(this.data.requestUrl, blob)
  }

  // 注册dom点击事件上报
  private registerDomEvent() {
    mouseEventList.forEach((eventName) => {
      window.addEventListener(eventName, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.getAttribute(TrackerConfig.targetKey)
        if (targetKey) {
          this.reportTracker({
            eventName,
            targetKey,
          })
        }
      })
    })
  }
}
