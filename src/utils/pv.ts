type Fn = () => any
// 重写history对象上相关方法，当触发类似pushState等方法时，dispatchEvent其事件，
// 同时让window对象可以监听其事件
// history.pushState
// history.replaceState
export const createHistoryEvnent = <T extends keyof History>(
  HistoryEvenType: T
): Fn => {
  const fnc = history[HistoryEvenType]
  return function (this: any) {
    const result = fnc.apply(this, arguments)
    let event = new Event(HistoryEvenType)
    window.dispatchEvent(event)
    return result
  }
}
