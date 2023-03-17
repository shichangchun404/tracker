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
      sdkVersion: TrackerConfig.version,
      extra: undefined,
      historyTracker: true,
      hashTracker: false,
      domTracker: true,
      jsError: true,
    }
  }

  // 根据配置 监听数据上报场景
  private initTracker() {
    if (this.data.historyTracker) {
      this.registerHistoryEventListener(
        ["pushState", "replaceState"],
        "history-pv"
      )
    }
    if (this.data.hashTracker) {
      this.registerHistoryEventListener(["hashchange"], "hash-pv")
    }
    if (this.data.domTracker) {
      this.registerDomEventListener()
    }
    if (this.data.jsError) {
      this.registerErrorListener()
    }
  }

  // 数据上报 通过navigator.sendBeacon
  private reportTracker<T>(data?: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    })
    const headers = {
      type: "application/x-www-form-urlencoded",
    }
    const blob = new Blob([JSON.stringify(params)], headers)
    navigator.sendBeacon(this.data.requestUrl, blob)
  }

  // 路由事件监听
  private registerHistoryEventListener<T>(
    eventList: string[],
    targetKey: string,
    data?: T
  ) {
    eventList.forEach((eventName) => {
      window.addEventListener(eventName, () => {
        this.reportTracker({
          eventName,
          targetKey,
          data,
        })
      })
    })
  }

  // 注册dom点击事件上报
  private registerDomEventListener() {
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

  // 监听错误事件
  private registerErrorListener() {
    window.addEventListener("error", (e) => {
      this.reportTracker({
        eventName: "error",
        message: e.message,
      })
    })
    window.addEventListener("unhandledrejection", (e) => {
      e.promise.catch((message) => {
        this.reportTracker({
          eventName: "error",
          message,
        })
      })
    })
  }
}
