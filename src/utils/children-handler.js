import { withStruct } from "./core"

/**
 * 处理子组件
 * @param {string | Array | Object | Function} children
 * @returns {Function} 处理后的子组件
 */
export const processChildren = (children, ctx) =>
{
  if (!children)
    return null

  return withStruct(children, ctx)
}