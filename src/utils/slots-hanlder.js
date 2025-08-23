import { isString } from "lodash-es"
import { withStruct } from "./core"

/**
 * 处理插槽
 * @param {string | Object | Array | Function} slots 
 * @param {Object} ctx 
 * @returns {Object} 处理后的插槽
 */
export const processSlots = (slots, ctx) =>
{
  if (!slots)
    return {}

  if (isString(slots))
  {
    return {
      default: () => slots
    }
  }

  return Object.entries(slots).reduce((result, [key, value]) => (result[key] = withStruct(value, ctx), result), {})
}
