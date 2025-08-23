/**
 * 生命周期钩子名称常量
 * @readonly
 */
export const LIFECYCLE_HOOKS =
{
  /** 实例初始化之前 */
  BEFORE_CREATE: 'beforeCreate',
  /** 实例创建完成后 */
  CREATED: 'created',
  /** 挂载开始之前 */
  BEFORE_MOUNT: 'beforeMount',
  /** 实例挂载完成后 */
  MOUNTED: 'mounted',
  /** 数据更新之前 */
  BEFORE_UPDATE: 'beforeUpdate',
  /** 数据更新完成后 */
  UPDATED: 'updated',
  /** 实例销毁之前 */
  BEFORE_UNMOUNT: 'beforeUnmount',
  /** 实例销毁完成后 */
  UNMOUNTED: 'unmounted',
  /** 错误捕获时 */
  ERROR_CAPTURED: 'errorCaptured',
  /** keep-alive 组件激活时 */
  ACTIVATED: 'activated',
  /** keep-alive 组件停用时 */
  DEACTIVATED: 'deactivated'
}

/**
 * 生命周期钩子名称常量
 * @readonly
 */
export const LIFECYCLE_KEYS = Object.values(LIFECYCLE_HOOKS)
