import { isString, isPlainObject, isArray, isFunction, omit, capitalize } from "lodash-es"
import { Fragment, h, resolveDirective, withModifiers, isVNode } from "vue"
import { createStructComponent } from "../core/StructComponent"
import Directives from "../core/Directives"
import { ExtraFunc, Keyboard } from "../core/Modifiers"
import { EXTRA_EVENT_MODIFIERS } from "../constants"

const Extra = Object.values(EXTRA_EVENT_MODIFIERS)

/**
 * 处理结构组件
 * @param {string | Object | Array | Function} value 
 * @param {Object} ctx 
 * @returns {Function | null}
 */
export const withStruct = (value, ctx) =>
{
  if (isVNode(value))
    return value
  if (isString(value))
    return h(Fragment, null, [value])
  else if (isPlainObject(value))
    return createStructComponent(value)
  else if (isArray(value))
    return h(Fragment, null, value.map((child, index) => createStructComponent(Object.assign(child, { key: child.name || child.key || index }))))
  else if (isFunction(value))
    return (...args) => [withStruct(value.call(ctx, ...args), ctx)]
  else
  {
    console.error(`Invalid children: ${value}`)
    return null
  }
}

/**
 * 处理事件
 * @param {string} evtKey 事件名称
 * @param {any} value 事件值
 * @param {object=} ctx 上下文
 * @returns {object}
 */
export const withEvent = (evtKey, value, ctx) =>
{
  let eventName = evtKey, modifiers = {}

  if (~evtKey.indexOf('.'))
  {
    const parts = evtKey.split('.')
    eventName = parts[0]
    modifiers = parts.slice(1).reduce((acc, modifier) => ({ ...acc, [modifier]: true }), {})
  }

  if (isFunction(value))
  {
    value = {
      handler: value,
      ...modifiers
    }
  }

  if (isPlainObject(value))
    return createEvent(eventName, { ...value, ...modifiers }, ctx)
  else
    throw new Error(`Invalid event: ${value}`)
}

/**
 * 创建一个h函数能够处理的事件
 * @param {string} eventName 
 * @param {any} value 
 * @param {object=} ctx 
 * @returns {object}
 */
export const createEvent = (eventName, value, ctx) => 
{
  const { handler, error: errorHandler, once: isOnce, ...modifiers } = value

  let fn = null

  // 创建基础事件处理函数
  const baseHandler = async (evt, ...args) =>
  {
    try {
      const bindHandler = async () => await handler.call(ctx, evt, ...args)
      const el = evt.currentTarget || evt.target

      if (el?._DC_EVENTS_ONCE_)
        return

      // .once
      if (isOnce)
      {
        await bindHandler()
        el.removeEventListener(eventName, fn)
        el._DC_EVENTS_ONCE_ = true
        return
      }

      if (eventName.startsWith('key'))
      {
        if (Keyboard(evt, modifiers))
          return await bindHandler()
      }
      else
        return await bindHandler()
    } catch (error) {
      if (isFunction(errorHandler))
        errorHandler.call(ctx, error, evt)
      else
        throw error
    }
  }

  fn = baseHandler

  if (modifiers.debounce || modifiers.throttle)
    fn = ExtraFunc(baseHandler, modifiers)

  const modifiersKeys = Object.keys(omit(modifiers, Extra))

  return {
    [eventName.startsWith('on') ? eventName : `on${capitalize(eventName)}`]: modifiersKeys?.length ? withModifiers(fn, modifiersKeys) : fn
  }
}

/**
 * 移除防抖和节流
 * @param {Object} events 
 */
export const removeExtraFuncEvent = (events) =>
{
  Object.keys(events).forEach(key => events[key]?.cancel?.())
}

/**
 * 将对象形式的指令转换为vue指令数组形式
 * @param {Array} directives 
 * @returns {Array}
 */
export const transDirectives = (directives) =>
{
  const directiveArr = []
  for (let i = 0, len = directives.length; i < len; i++)
  {
    const directive = directives[i]
    if (!directive.name)
      continue
    const directiveObj = Directives[directive.name] || resolveDirective(directive.name)
    if (!directiveObj)
      continue
    directiveArr.push([directiveObj, directive.value, directive.arg, directive.modifiers])
  }
  return directiveArr
}

/**
 * 获取全局组件
 * @param {Object} app - Vue应用实例
 * @returns {Object} 全局组件
 */
export const getGlobalComponentMap = (app) =>
{
  const components = app?._context?.components || app?.$?.appContext?.components || app?.appContext?.components
  if (!components)
    throw new Error('DC: 没有全局组件')
  return components
}
