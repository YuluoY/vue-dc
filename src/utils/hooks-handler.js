import { isEmpty, pick } from 'lodash-es'
import { LIFECYCLE_KEYS } from '../constants'

/**
 * 处理hooks
 * @param {object} struct 
 * @returns {Object} 返回值
 */
export const processHooks = (struct) =>
{
  const validHooks = pick(struct, LIFECYCLE_KEYS)

  if (!struct?.hooks && isEmpty(validHooks))
    return {}
  
  if (struct?.hooks)
    Object.assign(validHooks, struct.hooks)

  const keys = Object.keys(validHooks)
  
  for (let i = 0, len = keys.length; i < len; i++)
  {
    if (typeof validHooks[keys[i]] !== 'function' || !LIFECYCLE_KEYS.includes(keys[i]))
      delete validHooks[keys[i]]
  }
  
  return validHooks
}