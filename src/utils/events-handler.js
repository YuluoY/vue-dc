import { withEvent } from "./core"

/**
 * 处理事件
 * @param {Object} events 事件
 * @param {Object} ctx 上下文
 * @returns {Object} 处理后的事件
 */
export const processEvents = (events, ctx) =>
{
  const handlerEvents = {}
  if (!events)
    return handlerEvents
  Object.entries(events).forEach(([evtKey, value]) => {
    const evt = withEvent(evtKey, value, ctx)
    if (evt)
      Object.assign(handlerEvents, evt)
  })
  return handlerEvents
}

