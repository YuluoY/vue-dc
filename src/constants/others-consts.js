import { version } from '../../package.json'
/**
 * 动态组件系统版本号
 * @type {string}
 */
export const DC_VERSION = version

/**
 * 是否是开发环境
 * @type {boolean}
 */
export const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * 注入键常量
 * @readonly
 */
export const INJECTION_KEYS = 
{
  /**
   * 命名空间注入
   * @type {Symbol}
   */
  NAMESPACE: Symbol('dc-namespace'),

  /**
   * 父组件上下文
   * @type {Symbol}
   */
  PARENT_CTX: Symbol('dc-parent-context')
}

/**
 * 补丁标志
 */
export const PATCH_FLAGS = 
{
  // 基础标志
  TEXT: 1,           // 1 << 0
  CLASS: 2,          // 1 << 1  
  STYLE: 4,          // 1 << 2
  PROPS: 8,          // 1 << 3
  
  // 组合标志（常用）
  TEXT_CLASS: 3,     // TEXT | CLASS
  TEXT_STYLE: 5,     // TEXT | STYLE
  CLASS_STYLE: 6,    // CLASS | STYLE
  TEXT_PROPS: 9,     // TEXT | PROPS
  CLASS_PROPS: 10,   // CLASS | PROPS
  STYLE_PROPS: 12,   // STYLE | PROPS
  CLASS_STYLE_PROPS: 14, // CLASS | STYLE | PROPS
  
  // 特殊标志
  FULL_PROPS: -1,    // 所有props动态
  HYDRATE_EVENTS: 16, // 1 << 4
  STABLE_FRAGMENT: 64, // 1 << 6
  KEYED_FRAGMENT: 128, // 1 << 7
  UNKEYED_FRAGMENT: 256, // 1 << 8
  NEED_PATCH: 512,   // 1 << 9
  DYNAMIC_SLOTS: 1024, // 1 << 10
  DEV_ROOT_FRAGMENT: 2048, // 1 << 11
  BAIL: -2,          // 退出优化模式
  
  // 辅助方法
  isText: (flag) => (flag & 1) > 0,
  isClass: (flag) => (flag & 2) > 0,
  isStyle: (flag) => (flag & 4) > 0,
  isProps: (flag) => (flag & 8) > 0,
  isStable: (flag) => flag === 0
}

/**
 * HTML 原生标签集合
 * @type {Set<string>}
 */
export const NATIVE_TAGS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
  'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
  'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details',
  'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
  'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label',
  'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture',
  'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
  'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary',
  'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
])
