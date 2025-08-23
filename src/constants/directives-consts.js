/**
 * 自定义指令名称常量
 * @readonly
 * @enum {string}
 */
export const CUSTOM_DIRECTIVES = {
  /** 条件渲染 */
  IF: 'dcIf',
  /** 根据条件显示或隐藏元素 */
  SHOW: 'dcShow',
  /** 跳过编译 */
  PRE: 'dcPre',
  /** 防止闪烁 */
  CLOAK: 'dcCloak',
  /** 只渲染一次 */
  ONCE: 'dcOnce',
  /** HTML 内容渲染 */
  HTML: 'dcHtml',
  /** 文本内容渲染 */
  TEXT: 'dcText',
  /** 聚焦 */
  FOCUS: 'dcFocus',
  /** 点击外部 */
  CLICK_OUTSIDE: 'dcClickOutside',
  /** 防抖 */
  DEBOUNCE: 'dcDebounce',
  /** 节流 */
  THROTTLE: 'dcThrottle',
  /** 权限控制 */
  PERMISSION: 'dcPermission',
  /** 长按 */
  LONGPRESS: 'dcLongpress',
  /** 复制 */
  COPY: 'dcCopy',
  /** 样式 */
  STYLE: 'dcStyle'
} 

/**
 * 必须以对象形式的指令
 */
export const SPEC_DIRECTIVES = [
  CUSTOM_DIRECTIVES.DEBOUNCE,
  CUSTOM_DIRECTIVES.THROTTLE,
  CUSTOM_DIRECTIVES.PERMISSION
]

/**
 * 自定义指令名称常量
 * @readonly
 * @enum {string}
 */
export const CUSTOM_DIRECTIVES_KEYS = Object.values(CUSTOM_DIRECTIVES)