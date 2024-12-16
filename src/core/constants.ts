export const LIFECYCLE_HOOKS = {
  BEFORE_CREATE: 'beforeCreate',
  CREATED: 'created',
  BEFORE_MOUNT: 'beforeMount',
  MOUNTED: 'mounted',
  BEFORE_UPDATE: 'beforeUpdate',
  UPDATED: 'updated',
  BEFORE_UNMOUNT: 'beforeUnmount',
  UNMOUNTED: 'unmounted',
  ERROR_CAPTURED: 'errorCaptured',
  ACTIVATED: 'activated',
  DEACTIVATED: 'deactivated'
} as const

export const CUSTOM_DIRECTIVES = {
  V_DC_LAZY: 'v-dc-lazy',    // 子组件懒加载
  V_BIND: 'v-bind',          // 动态绑定属性
  V_ON: 'v-on',              // 事件监听
  V_IF: 'v-if',              // 条件渲染
  V_ELSE: 'v-else',          // 条件渲染的 else 部分
  V_ELSE_IF: 'v-else-if',    // 条件渲染的 else if 部分
  V_FOR: 'v-for',            // 列表渲染
  V_SHOW: 'v-show',          // 根据条件显示或隐藏元素
  V_MODEL: 'v-model',        // 双向数据绑定
  V_SLOT: 'v-slot',          // 具名插槽
  V_PRE: 'v-pre',            // 跳过该节点及其子节点的编译
  V_CLOAK: 'v-cloak',        // 在 Vue 实例激活之前保持元素的显示
  V_ONCE: 'v-once',          // 仅渲染一次的内容
  V_HTML: 'v-html'           // DOM渲染
} as const

export const NATIVE_TAG = [
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
] as const

export const DEFAULT_DIRECTIVES = {
  [CUSTOM_DIRECTIVES.V_IF]: true,
  [CUSTOM_DIRECTIVES.V_SHOW]: true,
  [CUSTOM_DIRECTIVES.V_DC_LAZY]: false
} as const

export const DefaultLazy = {
  num: 8, // 默认加载个数
  step: 3 // 加载步长
} as const

export const DC_LAZY_PROPS = {
  LAZY: 'data-dc-lazy',
  LOADED: 'data-dc-loaded',
  REMAIN: 'data-dc-remain'
} as const

export const DC_NAMESPACE_INJECTION = Symbol('dc-namespace-injection')

// 类型定义
export type LifecycleHooks = typeof LIFECYCLE_HOOKS[keyof typeof LIFECYCLE_HOOKS]
export type CustomDirectives = typeof CUSTOM_DIRECTIVES[keyof typeof CUSTOM_DIRECTIVES]
export type NativeTag = typeof NATIVE_TAG[number] 