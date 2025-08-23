import { omit } from "lodash-es"
import Props from "../core/Props"
import { LIFECYCLE_KEYS } from "../constants"

const propsKeys = Object.keys(Props)

/**
 * 处理方法
 * @param {Object} struct - 结构
 * @returns {Object} 处理后的方法
 */
export const processMethods = (struct) =>
{
  const methods = omit(struct, [...propsKeys, ...LIFECYCLE_KEYS])
  const methodKeys = Object.keys(methods)

  for (let i = 0, len = methodKeys.length; i < len; i++)
  {
    const method = methods[methodKeys[i]]
    if (typeof method !== 'function')
      delete methods[methodKeys[i]]
  }

  return methods
}