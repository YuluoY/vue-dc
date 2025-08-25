import { isPlainObject, isString, isFunction, omit } from "lodash-es"
import { CUSTOM_DIRECTIVES_KEYS, LIFECYCLE_HOOKS, EVENTS_MODIFIERS } from '../constants'
import { isRef } from "vue"

/**
 * 校验modelValue对象
 * @param {Object | Array} value
 * @param {Array} required
 * @returns {boolean}
 */
export const validModelValue = (value, required = ['path', 'value']) => {
  return true
  // let bool = isPlainObject(value) && required.every(prop => prop in value) && isString(value.path)
  // if (Array.isArray(value))
  //   bool = value.every(item => isPlainObject(item) && required.every(prop => prop in item) && isString(item.path))
  // return bool
}

/**
 * 校验type
 * @param {Object | String | Function} value
 * @returns {boolean}
 */
export const validType = (value) => {
  return isString(value) || isFunction(value) || validStruct(value)
}

/**
 * 校验props
 * @param {Object} value
 * @returns {boolean}
 */
export const validProps = (value) => {
  if (!value) {
    return true // props是可选的
  }

  // props必须是对象
  if (!isPlainObject(value)) {
    return false
  }

  if (value.modelValue)
    return validModelValue(value.modelValue)

  return true
}

/**
 * 校验子组件 
 * @param {Object | Array | String | Function} value
 * @returns {boolean}
 */
export const validChildren = (value) => {

  if (isRef(value))
    return true
  
  if (!value)
    return true

  if (isString(value) || isFunction(value))
    return true
  else if (isPlainObject(value))
    return validStruct(value)
  else if (Array.isArray(value))
    return value.every(v => validStruct(v))
  return false
}

/**
 * 校验指令
 * @param {Object | Array} value
 * @returns {boolean}
 */
export const validDirective = (value) => {
  if (isPlainObject(value)) {
  
    const valid = (directive) => {
      let bool = !!directive?.value
      if (isPlainObject(directive.modifiers))
        bool = Object.keys(directive.modifiers).every(k => CUSTOM_DIRECTIVES_KEYS.includes(k))
      return bool
    }

   return Object.keys(value).every(key => {
     const directive = value[key]
     
     if (Array.isArray(directive))
       return directive.every(item => valid(item))
     else if (isPlainObject(directive))
      return valid(directive)
     return true
   })
 }
 return false
}

/**
 * 校验事件对象 - 可选 
 * @param {Object} value
 * @returns {boolean}
 */
export const validEvents = (value) => {
  if (!value) 
    return true

  return Object.keys(value).every(key => {
    const eventHandler = value[key]
    
    // 单个函数处理器
    if (isFunction(eventHandler)) 
      return true
    else if (isPlainObject(eventHandler))
    {
      const bool = isFunction(eventHandler.handler)
      const modifiers = omit(eventHandler, ['handler'])
      return bool && Object.keys(modifiers).every(k => EVENTS_MODIFIERS.includes(k))
    }
    
    return false
  })
}

/**
 * 校验生命周期钩子 - 可选
 * @param {Object} hooks - 钩子对象
 * @returns {boolean} 是否有效
 */
export const validHooks = (hooks) => {
  if (!hooks) {
    return true // 钩子是可选的
  }

  // 验证所有钩子名称是否在LIFECYCLE_HOOKS中
  const validHookNames = Object.values(LIFECYCLE_HOOKS)
  
  return Object.keys(hooks).every(hookName => {
    // 检查钩子名称是否有效
    if (!validHookNames.includes(hookName)) {
      return false
    }
    
    const hookHandler = hooks[hookName]
    
    // 钩子处理器必须是函数
    if (!isFunction(hookHandler)) {
      return false
    }
    
    return true
  })
}

/**
 * 校验插槽配置 - 可选
 * @param {Object | Function | String} slots - 插槽配置
 * @returns {boolean} 是否有效
 */
export const validSlots = (slots) => {
  if (!slots) {
    return true // 插槽是可选的
  }

  // 如果是函数，表示动态生成插槽内容
  if (isFunction(slots)) {
    return true
  }

  // 如果是字符串，表示简单的文本插槽
  if (isString(slots)) {
    return true
  }

  // 如果是对象，检查具名插槽
  if (isPlainObject(slots)) {
    return Object.keys(slots).every(slotName => {
      const slotContent = slots[slotName]
      
      // 插槽内容可以是函数、字符串或者组件结构
      return (
        isFunction(slotContent) ||
        isString(slotContent) ||
        validStruct(slotContent)
      )
    })
  }

  return false
}

/**
 * 校验提供
 * @param {Object} value
 * @returns {boolean}
 */
export const validProvide = (value) => 'key' in value && 'value' in value

/**
 * 校验是否是一个dc-struct
 * @param {Object} value
 * @returns {boolean}
 */
export const validStruct = (value) => {
  if (!value)
    return false

  if (isString(value))
    return true

  let bool = true
  if (value.type)
    bool = validType(value.type)
  else if (value.props)
    bool = validProps(value.props)
  else if (value.children)
    bool = validChildren(value.children)
  else if (value.hooks)
    bool = validHooks(value.hooks)
  else if (value.slots)
    bool = validSlots(value.slots)
  else if (value.directives)
    bool = validDirective(value.directives)
  else if (value.events)
    bool = validEvents(value.events)
  else if (value.provide)
    bool = validProvide(value.provide)

  return bool
}
 