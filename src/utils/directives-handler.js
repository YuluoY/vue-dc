import Directives from "../core/Directives"
import { resolveDirective } from 'vue'
import { CUSTOM_DIRECTIVES, SPEC_DIRECTIVES } from "../constants"
import { isPlainObject, omit } from "lodash-es"

/**
 * 处理指令
 * @param {Object} directives - 指令
 * @returns {Array} 处理后的指令
 */
export const processDirectives = (directives) =>
{
  let directiveArr = []
  if (!directives)
    return directiveArr

  directives = omit(directives, [CUSTOM_DIRECTIVES.IF])

  return Object.entries(directives).reduce((result, [key, value]) => {

    const obj = Directives[key] || resolveDirective(key)
    if (!obj)
    {
      console.error(`Invalid directive: ${key}`)
      return result
    }

    if (SPEC_DIRECTIVES.includes(key) && !isPlainObject(value))
    {
      console.error(`Invalid directive: ${key} must be an object`)
      return result
    }

    if (Array.isArray(value))
      result.push(...value.map(item => [obj, item.value, item.arg, item.modifiers]))
    else if (isPlainObject(value))
      result.push([obj, value.value, value.arg, value.modifiers])
    else
      result.push([obj, value])
    return result
  }, [])
}
