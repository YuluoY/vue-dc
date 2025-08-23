/**
 * 自定义指令集合
 */

import { CUSTOM_DIRECTIVES } from '../constants/directives-consts'
import { throttle, debounce } from 'lodash-es'

/**
 * 显示/隐藏指令 - 控制元素的显示状态
 * 
 * @description
 * 该指令用于控制元素的显示和隐藏状态，通过修改元素的display样式属性实现。
 * 当值为true时显示元素，为false时隐藏元素。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-show="isVisible">内容</div>
 * 
 * @example
 * // 条件显示
 * <button v-dc-show="user.isAdmin">管理员按钮</button>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcShow',
 *   value: true,
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcShow = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {boolean} binding.value - 是否显示元素
   */
  mounted(el, binding) {
    el.style.display = binding.value ? '' : 'none'
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {boolean} binding.value - 是否显示元素
   */
  updated(el, binding) {
    el.style.display = binding.value ? '' : 'none'
  }
}

/**
 * HTML内容指令 - 设置元素的HTML内容
 * 
 * @description
 * 该指令用于设置元素的innerHTML，允许渲染HTML标签。
 * 注意：使用此指令时要小心XSS攻击，确保内容是可信的。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-html="htmlContent"></div>
 * 
 * @example
 * // 渲染HTML标签
 * <div v-dc-html="'<strong>粗体文本</strong>'"></div>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcHtml',
 *   value: '<span>HTML内容</span>',
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcHtml = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - HTML内容字符串
   */
  mounted(el, binding) {
    el.innerHTML = binding.value || ''
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - HTML内容字符串
   */
  updated(el, binding) {
    el.innerHTML = binding.value || ''
  }
}

/**
 * 文本内容指令 - 设置元素的文本内容
 * 
 * @description
 * 该指令用于设置元素的textContent，只渲染纯文本内容，不会解析HTML标签。
 * 相比v-html更安全，避免了XSS攻击的风险。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-text="textContent"></div>
 * 
 * @example
 * // 显示用户输入
 * <span v-dc-text="userInput"></span>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcText',
 *   value: '纯文本内容',
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcText = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - 文本内容
   */
  mounted(el, binding) {
    el.textContent = binding.value || ''
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - 文本内容
   */
  updated(el, binding) {
    el.textContent = binding.value || ''
  }
}

/**
 * 一次性渲染指令 - 元素只渲染一次
 * 
 * @description
 * 该指令用于标记元素只渲染一次，后续的数据变化不会触发重新渲染。
 * 适用于静态内容或只需要初始渲染的场景。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-once>这个内容只会渲染一次</div>
 * 
 * @example
 * // 静态内容
 * <h1 v-dc-once>{{ staticTitle }}</h1>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcOnce',
 *   value: undefined,
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcOnce = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} vnode - 虚拟节点
   */
  mounted(el, binding, vnode) {
    // 标记为只渲染一次
    el._vOnce = true
  },
  
  /**
   * 指令更新前调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} vnode - 虚拟节点
   * @returns {boolean} 是否阻止更新
   */
  beforeUpdate(el, binding, vnode) {
    // 如果已经渲染过，阻止更新
    if (el._vOnce) {
      return false
    }
  }
}

/**
 * 跳过编译指令 - 跳过Vue编译过程
 * 
 * @description
 * 该指令用于跳过Vue的编译过程，元素内的内容会按原样输出，不会被Vue解析。
 * 适用于显示Vue模板代码或不需要Vue处理的静态内容。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-pre>{{ 这里的内容不会被Vue解析 }}</div>
 * 
 * @example
 * // 显示模板代码
 * <pre v-dc-pre>
 *   &lt;div&gt;{{ message }}&lt;/div&gt;
 * </pre>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcPre',
 *   value: undefined,
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcPre = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} vnode - 虚拟节点
   */
  mounted(el, binding, vnode) {
    // 标记为跳过编译
    el._vPre = true
    // 移除所有指令属性
    const attrs = el.attributes
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i]
      if (attr.name.startsWith('v-') || attr.name.startsWith('dc-')) {
        el.removeAttribute(attr.name)
      }
    }
  }
}

/**
 * 隐藏指令 - 防止未编译内容闪烁
 * 
 * @description
 * 该指令用于防止Vue未编译完成时显示原始模板内容，避免页面闪烁。
 * 通常配合CSS样式使用，在Vue编译完成后移除该属性。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-cloak>{{ message }}</div>
 * 
 * @example
 * // 配合CSS使用
 * <style>
 *   [v-dc-cloak] { display: none; }
 * </style>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcCloak',
 *   value: undefined,
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcCloak = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} vnode - 虚拟节点
   */
  mounted(el, binding, vnode) {
    // 移除 v-cloak 属性，显示元素
    el.removeAttribute('v-cloak')
    el.removeAttribute('dc-cloak')
  }
}

/**
 * 焦点控制指令 - 控制元素的焦点状态
 * 
 * @description
 * 该指令用于控制元素的焦点状态，可以自动聚焦或失焦元素。
 * 当值为true时聚焦元素，为false时失焦元素。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <input v-dc-focus="true" placeholder="自动聚焦" />
 * 
 * @example
 * // 条件聚焦
 * <input v-dc-focus="shouldFocus" placeholder="条件聚焦" />
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcFocus',
 *   value: true,
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcFocus = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {boolean} binding.value - 是否聚焦元素
   */
  mounted(el, binding) {
    if (binding.value !== false) {
      el.focus()
    }
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {boolean} binding.value - 是否聚焦元素
   */
  updated(el, binding) {
    if (binding.value) {
      el.focus()
    } else {
      el.blur()
    }
  }
}

/**
 * 点击外部指令 - 监听元素外部的点击事件
 * 
 * @description
 * 该指令用于监听元素外部的点击事件，常用于下拉菜单、模态框等组件的关闭功能。
 * 当用户点击元素外部时，会触发回调函数。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法
 * <div v-dc-click-outside="closeDropdown">下拉菜单内容</div>
 * 
 * @example
 * // 模态框关闭
 * <div v-dc-click-outside="closeModal" class="modal">
 *   <div class="modal-content">模态框内容</div>
 * </div>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcClickOutside',
 *   value: (event) => console.log('点击外部'),
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcClickOutside = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function} binding.value - 点击外部时的回调函数
   */
  mounted(el, binding) {
    el._dcClickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._dcClickOutside)
  },
  
  /**
   * 指令卸载前调用，清理事件监听器
   * @param {HTMLElement} el - 绑定的DOM元素
   */
  beforeUnmount(el) {
    document.removeEventListener('click', el._dcClickOutside)
  }
}

/**
 * 防抖指令 - 防止事件在短时间内重复触发
 * 
 * @description
 * 该指令使用lodash的debounce函数实现，支持更丰富的配置选项。
 * 当用户触发事件时，会延迟执行回调函数，如果在延迟期间再次触发，会重置延迟时间。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 使用默认300ms延迟
 * <button v-dc-debounce="handleClick">点击按钮</button>
 * 
 * @example
 * // 自定义延迟时间 - 500ms
 * <button v-dc-debounce:500="handleClick">点击按钮</button>
 * 
 * @example
 * // 使用修饰符配置选项
 * <button v-dc-debounce.leading.trailing:1000="handleClick">点击按钮</button>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcDebounce',
 *   value: () => console.log('防抖触发'),
 *   arg: 500,
 *   modifiers: { leading: true, trailing: true, maxWait: 1000 }
 * }
 */
export const dcDebounce = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function} binding.value - 要执行的回调函数，接收事件对象作为参数
   * @param {string|number} [binding.arg=300] - 防抖延迟时间（毫秒），默认为300ms
   * @param {Object} binding.modifiers - 修饰符对象，支持以下选项：
   * @param {boolean=} binding.modifiers.leading - 是否在延迟开始前调用函数
   * @param {boolean=} binding.modifiers.trailing - 是否在延迟结束后调用函数
   * @param {number=} binding.modifiers.maxWait - 最大等待时间（毫秒）
   */
  mounted(el, binding) {
    const { value, arg = 300, modifiers = {} } = binding
    
    // 构建debounce配置选项
    const options = {}
    if (typeof modifiers.leading === 'boolean')
      options.leading = modifiers.leading
    if (typeof modifiers.trailing === 'boolean')
      options.trailing = modifiers.trailing
    if (typeof modifiers.maxWait === 'number')
      options.maxWait = modifiers.maxWait
    
    // 创建防抖函数
    el._dcDebounce = debounce(value, Number(arg), options)
    
    // 添加事件监听器
    el.addEventListener('click', el._dcDebounce)
  },
  
  /**
   * 指令卸载前调用，清理事件监听器
   * @param {HTMLElement} el - 绑定的DOM元素
   */
  beforeUnmount(el) {
    if (el._dcDebounce) {
      el.removeEventListener('click', el._dcDebounce)
      // 取消未执行的调用
      el._dcDebounce.cancel()
    }
  }
}

/**
 * 节流指令 - 限制事件触发频率
 * 
 * @description
 * 该指令使用lodash的throttle函数实现，支持更丰富的配置选项。
 * 当用户触发事件时，会按照指定的时间间隔执行回调函数，确保事件不会过于频繁地触发。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 使用默认300ms间隔
 * <button v-dc-throttle="handleClick">点击按钮</button>
 * 
 * @example
 * // 自定义间隔时间 - 500ms
 * <button v-dc-throttle:500="handleClick">点击按钮</button>
 * 
 * @example
 * // 使用修饰符配置选项
 * <button v-dc-throttle.leading.trailing:1000="handleClick">点击按钮</button>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcThrottle',
 *   value: () => console.log('节流触发'),
 *   arg: 500,
 *   modifiers: { leading: true, trailing: true }
 * }
 */
export const dcThrottle = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function} binding.value - 要执行的回调函数，接收事件对象作为参数
   * @param {string|number} [binding.arg=300] - 节流间隔时间（毫秒），默认为300ms
   * @param {Object} binding.modifiers - 修饰符对象，支持以下选项：
   * @param {boolean=} binding.modifiers.leading - 是否在延迟开始前调用函数
   * @param {boolean=} binding.modifiers.trailing - 是否在延迟结束后调用函数
   */
  mounted(el, binding) {
    const { value, arg = 300, modifiers = {} } = binding
    
    // 构建throttle配置选项
    const options = {}
    if (typeof modifiers.leading === 'boolean')
      options.leading = modifiers.leading
    if (typeof modifiers.trailing === 'boolean')
      options.trailing = modifiers.trailing
    
    // 创建节流函数
    el._dcThrottle = throttle(value, Number(arg), options)
    
    // 添加事件监听器
    el.addEventListener('click', el._dcThrottle)
  },
  
  /**
   * 指令卸载前调用，清理事件监听器
   * @param {HTMLElement} el - 绑定的DOM元素
   */
  beforeUnmount(el) {
    if (el._dcThrottle) {
      el.removeEventListener('click', el._dcThrottle)
      // 取消未执行的调用
      el._dcThrottle.cancel()
    }
  }
}

/**
 * 权限控制指令 - 根据权限控制元素显示
 * 
 * @description
 * 该指令用于根据用户权限控制元素的显示和隐藏，支持多种权限检查方式。
 * 当用户没有相应权限时，元素会被隐藏。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 传入权限检查函数
 * <button v-dc-permission="checkUserPermission">管理员按钮</button>
 * 
 * @example
 * // 使用全局权限检查函数
 * <div v-dc-permission:checkAdminPermission="'admin'">管理员内容</div>
 * 
 * @example
 * // 使用组件实例方法
 * <span v-dc-permission="'edit'">编辑按钮</span>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcPermission',
 *   value: 'admin',
 *   arg: 'checkPermission',
 *   modifiers: {}
 * }
 */
export const dcPermission = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function|string} binding.value - 权限检查函数或权限标识
   * @param {string} [binding.arg] - 全局权限检查函数名
   * @param {Object} vnode - 虚拟节点
   */
  mounted(el, binding, vnode) {
    const { value, arg } = binding
    
    // 获取权限检查函数，支持多种方式：
    // 1. 通过 arg 参数指定全局权限检查函数名
    // 2. 通过 value 传入权限检查函数
    // 3. 通过 vnode.context 获取组件实例上的权限检查方法
    
    let checkPermissionFn = null
    
    if (typeof value === 'function') {
      // 直接传入权限检查函数
      checkPermissionFn = value
    } else if (arg && typeof window[arg] === 'function') {
      // 通过 arg 指定全局函数名
      checkPermissionFn = window[arg]
    } else if (vnode.context && typeof vnode.context.checkPermission === 'function') {
      // 从组件实例获取权限检查方法
      checkPermissionFn = vnode.context.checkPermission
    } else if (vnode.context && typeof vnode.context.$checkPermission === 'function') {
      // 从组件实例获取权限检查方法（Vue 2 风格）
      checkPermissionFn = vnode.context.$checkPermission
    } else {
      // 默认权限检查函数
      checkPermissionFn = defaultPermissionChecker
    }
    
    // 执行权限检查
    const hasPermission = checkPermissionFn(value, arg, vnode)
    
    if (!hasPermission) {
      // 没有权限时隐藏元素
      el.style.display = 'none'
      // 标记为无权限
      el._dcPermission = false
    } else {
      el._dcPermission = true
    }
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function|string} binding.value - 权限检查函数或权限标识
   * @param {string} [binding.arg] - 全局权限检查函数名
   * @param {Object} vnode - 虚拟节点
   */
  updated(el, binding, vnode) {
    const { value, arg } = binding
    
    // 重新检查权限
    let checkPermissionFn = null
    
    if (typeof value === 'function') {
      checkPermissionFn = value
    } else if (arg && typeof window[arg] === 'function') {
      checkPermissionFn = window[arg]
    } else if (vnode.context && typeof vnode.context.checkPermission === 'function') {
      checkPermissionFn = vnode.context.checkPermission
    } else if (vnode.context && typeof vnode.context.$checkPermission === 'function') {
      checkPermissionFn = vnode.context.$checkPermission
    } else {
      checkPermissionFn = () => true
    }
    
    const hasPermission = checkPermissionFn(value, arg, vnode)
    
    if (!hasPermission) {
      el.style.display = 'none'
      el._dcPermission = false
    } else {
      el.style.display = ''
      el._dcPermission = true
    }
  }
}

/**
 * 长按指令 - 监听长按事件
 * 
 * @description
 * 该指令用于监听长按事件，当用户长按元素达到指定时间时触发回调函数。
 * 支持鼠标和触摸事件，适用于移动端和桌面端。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 使用默认500ms延迟
 * <button v-dc-longpress="handleLongPress">长按我</button>
 * 
 * @example
 * // 自定义延迟时间 - 1000ms
 * <div v-dc-longpress:1000="handleLongPress">长按1秒触发</div>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcLongpress',
 *   value: (event) => console.log('长按触发'),
 *   arg: 500,
 *   modifiers: {}
 * }
 */
export const dcLongpress = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function} binding.value - 长按触发时的回调函数
   * @param {string|number} [binding.arg=500] - 长按延迟时间（毫秒），默认为500ms
   */
  mounted(el, binding) {
    const { value, arg = 500 } = binding
    let timer = null
    let startTime = 0
    
    const start = (event) => {
      startTime = Date.now()
      timer = setTimeout(() => {
        value(event)
      }, Number(arg))
    }
    
    const cancel = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    
    el._dcLongpress = { start, cancel }
    
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('mouseleave', cancel)
  },
  
  /**
   * 指令卸载前调用，清理事件监听器
   * @param {HTMLElement} el - 绑定的DOM元素
   */
  beforeUnmount(el) {
    if (el._dcLongpress) {
      el.removeEventListener('mousedown', el._dcLongpress.start)
      el.removeEventListener('touchstart', el._dcLongpress.start)
      el.removeEventListener('mouseup', el._dcLongpress.cancel)
      el.removeEventListener('touchend', el._dcLongpress.cancel)
      el.removeEventListener('mouseleave', el._dcLongpress.cancel)
    }
  }
}

/**
 * 复制指令 - 一键复制内容到剪贴板
 * 
 * @description
 * 该指令用于实现一键复制功能，点击元素时将指定内容复制到剪贴板。
 * 支持现代浏览器的Clipboard API，并提供降级方案兼容旧浏览器。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 复制固定文本
 * <button v-dc-copy="'要复制的文本'">复制文本</button>
 * 
 * @example
 * // 复制动态内容
 * <button v-dc-copy="() => user.email">复制邮箱</button>
 * 
 * @example
 * // 复制输入框内容
 * <input v-dc-copy="() => this.$refs.input.value" ref="input" />
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcCopy',
 *   value: '要复制的文本',
 *   arg: undefined,
 *   modifiers: {}
 * }
 */
export const dcCopy = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string|Function} binding.value - 要复制的文本或返回文本的函数
   */
  mounted(el, binding) {
    const { value } = binding
    
    el._dcCopy = async () => {
      try {
        const textToCopy = typeof value === 'function' ? value() : value
        await navigator.clipboard.writeText(textToCopy)
        console.log('复制成功:', textToCopy)
      } catch (err) {
        console.error('复制失败:', err)
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = typeof value === 'function' ? value() : value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
    }
    
    el.addEventListener('click', el._dcCopy)
  },
  
  /**
   * 指令卸载前调用，清理事件监听器
   * @param {HTMLElement} el - 绑定的DOM元素
   */
  beforeUnmount(el) {
    el.removeEventListener('click', el._dcCopy)
  }
}

/**
 * 样式指令 - 动态设置元素样式
 * 
 * @description
 * 该指令用于动态设置元素的CSS样式属性，通过arg参数指定要设置的样式属性名。
 * 提供了一种简洁的方式来动态修改元素的样式。
 * 
 * @type {import('vue').Directive}
 * 
 * @example
 * // 基础用法 - 设置背景色
 * <div v-dc-style:backgroundColor="'red'">红色背景</div>
 * 
 * @example
 * // 设置字体大小
 * <span v-dc-style:fontSize="'16px'">大字体文本</span>
 * 
 * @example
 * // 设置宽度
 * <div v-dc-style:width="dynamicWidth + 'px'">动态宽度</div>
 * 
 * @example
 * // 指令绑定对象结构
 * {
 *   name: 'dcStyle',
 *   value: 'red',
 *   arg: 'backgroundColor',
 *   modifiers: {}
 * }
 */
export const dcStyle = {
  /**
   * 指令挂载时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - 样式属性值
   * @param {string} binding.arg - CSS样式属性名
   */
  mounted(el, binding) {
    const { value, arg } = binding
    if (arg) {
      el.style[arg] = value
    }
  },
  
  /**
   * 指令更新时调用
   * @param {HTMLElement} el - 绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.value - 样式属性值
   * @param {string} binding.arg - CSS样式属性名
   */
  updated(el, binding) {
    const { value, arg } = binding
    if (arg) {
      el.style[arg] = value
    }
  }
}

/**
 * 导出所有指令
 */
export default 
{
  [CUSTOM_DIRECTIVES.SHOW]: dcShow,
  [CUSTOM_DIRECTIVES.HTML]: dcHtml,
  [CUSTOM_DIRECTIVES.TEXT]: dcText,
  [CUSTOM_DIRECTIVES.ONCE]: dcOnce,
  [CUSTOM_DIRECTIVES.PRE]: dcPre,
  [CUSTOM_DIRECTIVES.CLOAK]: dcCloak,
  [CUSTOM_DIRECTIVES.FOCUS]: dcFocus,
  [CUSTOM_DIRECTIVES.CLICK_OUTSIDE]: dcClickOutside,
  [CUSTOM_DIRECTIVES.DEBOUNCE]: dcDebounce,
  [CUSTOM_DIRECTIVES.THROTTLE]: dcThrottle,
  [CUSTOM_DIRECTIVES.PERMISSION]: dcPermission,
  [CUSTOM_DIRECTIVES.LONGPRESS]: dcLongpress,
  [CUSTOM_DIRECTIVES.COPY]: dcCopy,
  [CUSTOM_DIRECTIVES.STYLE]: dcStyle
}