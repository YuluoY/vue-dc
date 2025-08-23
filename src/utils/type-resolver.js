import { NATIVE_TAGS } from '../constants/index.js'
import { markRaw, resolveDynamicComponent } from 'vue'
import { getGlobalComponentMap } from './core.js'

  /**
   * 解析组件类型
   * @param {string|Object|Function} type - 组件类型
   * @param {Object} app - Vue应用实例
   * @returns {Object} 解析结果
   */
export const resolveType = (type, app) =>
{
  if (typeof type === 'string')
  {
    if (NATIVE_TAGS.has(type))
      return type
    let component = resolveDynamicComponent(type)
    if (typeof component !== 'object')
      component = getGlobalComponentMap(app)?.[type]
    if (typeof component !== 'object')
      throw new Error(`DC: 未找到全局组件 ${type}`)
    return markRaw(component)
  }
  else if (typeof type === 'function' || (typeof type === 'object' && type !== null))
    return markRaw(type)
  return type
}
