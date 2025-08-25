  import { 
  validDirective, 
  validEvents, 
  validHooks, 
  validSlots, 
  validChildren, 
  validProps, 
  validType,
  validProvide
} from "../utils/validator"

export default
{
  /**
   * 结构组件名称 - 可选
   * @type {String}
   * @example
   * // 结构组件名称
   * name: 'my-component'
   */
  name: String,

  /**
   * 是否包裹 - 可选
   * @type {Boolean}
   * @default true
   * @example
   * // 是否包裹
   * wrapper: false
   */
  wrapper: {
    type: Boolean,
    default: true
  },

  /**
   * 命名空间 - 可选
   * @type {String | Symbol}
   * @description 命名空间，用于区分不同的组件。
   * @example
   * // 命名空间
   * namespace: 'my-namespace'
   * 
   * // 1. 存在namespace时，你需要给默认值可以直接是一个对象，子组件中path为name会自动赋值为对象的name属性，path为age会自动赋值为对象的age属性。
   * namespace: 'form'
   * props.modelValue = { name: '张三', age: 18 }
   * // 子组件（注意，只有null和undefined时，才会使用默认值）：
   *   props.modelValue = { path: 'name' }
   *   props.modelValue = { path: 'age' }
   * 
   * // 2. 不存在namespace，你可以根据path来给默认值
   * props.modelValue = { path: 'form', value: { name: '张三', age: 18 } }
   * // 子组件（注意，只有null和undefined时，才会使用默认值）：
   *   props.modelValue = { path: 'form.name' }
   *   props.modelValue = { path: 'form.age' }
   * 
   * // 如果需要获取某个命名空间下的数据，你可以使用getRawModel方法
   * this.getRawModel('form')
   * // 返回：{ name: '张三', age: 18 }
   */
  namespace: [String, Symbol],
  
  /**
   * 注入 - 可选
   * @type {string}
   */
  inject: String,

  /**
   * 提供 - 可选
   * @type {object}
   * @example
   * // 提供
   * provide: {
   *   key: 'value',
   *   value: 'value'
   * }
   */
  provide: {
    type: Object,
    validator: (value) => validProvide(value)
  },

  /**
   * 组件类型
   * @type {String | Function | Object}
   * @description 组件类型，可以是字符串、函数或对象
   * @example
   * // 字符串类型
   * type: 'div'
   * // 函数类型
   * type: () => import('@/components/MyComponent')
   * // 对象类型
   * type: { // 同Props导出对象 }
   * // 全局组件
   * type: 'el-button' / 'ElButton' / ElButton
   */
  type: {
    type: [String, Function, Object],
    required: true,
    validator: (value) => validType(value)
  },

  /**
   * 组件属性
   * @type {Object} 
   * @description 组件属性，可以是对象
   * @example
   * // 默认双重绑定（modelValue）
   * props: {
   *   modelValue: { path: 'name', value: '', number: true, precision: 2, min: 0, max: 100 }
   * }
   * 
   * // 自定义双重绑定 - name默认是value（待扩展）
   * props: {
   *  modelValue: { name: 'data', value: '', number: true, precision: 2 }
   * }
   * 
   * // 多重绑定（待扩展）
   * props: {
   *  modelValue: [{ path: 'name', value: '' }, { name: 'data', value: '' }]
   * }
   */
  props: {
    type: Object,
    default: () => ({}),
    validator: (value) => validProps(value)
  },

  /**
   * 子组件
   * @type {string | Array | Object | Function}
   * @description 子组件，可以是字符串、数组、对象或函数
   * @example
   * // 字符串类型
   * children: 'div'
   * // 数组类型
   * children: [ // 同Props导出对象 ]
   * // 对象类型
   * children: { // 同Props导出对象 }
   * // 导入函数类型
   * children: () => import('@/components/MyComponent')
   * // 函数结构类型
   * children: () => ({ // 同Props导出对象 })
   */
  children: {
    type: [String, Array, Object, Function],
    validator: (value) => validChildren(value)
  },

  /**
   * 指令
   * @type {object}
   * @description 指令，可以是对象或数组
   * @example
   * 
   * // 对象形式
   * directives: {
   *   dcShow: true,
   *   dcThrottle: 300
   * }
   * 
   * // 使用全局自定义的指令 同：v-style:color="red"
   * directives: {
   *   style: {
   *     value: 'red',
   *     arg: 'color'
   *   },
   * }
   * 
   * // 进阶用法
   * directives: {
   *  dcDebounce: {
   *    value: () => console.log('防抖触发'),
   *    arg: 500,
   *    modifiers: { leading: true, trailing: true, maxWait: 1000 }
   *  },
   *  dcStyle: [
   *    { value: 'red', arg: 'color' },
   *    { value: '100px', arg: 'width' },
   *    { value: '100px', arg: 'height' }
   *  ]
   * }
   */
  directives: {
    type: [Object],
    validator: (value) => validDirective(value)
  },

  /**
   * 事件
   * @type {Object}
   * @description 事件，可以是对象
   * @example
   * // 单个事件处理器
   * events: {
   *   'click.stop': (event) => {
   *     console.log('点击事件', event)
   *   },
   *   input: (event) => {
   *     console.log('输入事件', event.target.value)
   *   }
   * }
   * 
   * // 带修饰符的事件处理器
   * events: {
   *   click: {
   *     handler: (event) => { console.log('点击事件', event) },
   *     debounce: 500
   *   }
   * }
   * 
   * // 带参数的事件处理器
   * events: {
   *   custom: (event, data) => {
   *     console.log('自定义事件', data)
   *   }
   * }
   */
  events: {
    type: Object,
    validator: (value) => validEvents(value)
  },

  /**
   * 生命周期钩子
   * @type {Object}
   * @description 组件生命周期钩子函数，在结构对象中hooks属性对象下，可以配置多个生命周期钩子。
   * PS：因为钩子函数命名是唯一的，所以你也可以在结构对象下直接写钩子函数，也能达到同样的效果。
   * @example
   * // 完整生命周期
   * hooks: {
   *   beforeCreate() {
   *     console.log('实例初始化之前')
   *   },
   *   created() {
   *     console.log('实例创建完成')
   *   },
   *   beforeMount() {
   *     console.log('挂载开始之前')
   *   },
   *   mounted() {
   *     console.log('实例挂载完成')
   *   },
   *   beforeUpdate() {
   *     console.log('数据更新之前')
   *   },
   *   updated() {
   *     console.log('数据更新完成')
   *   },
   *   beforeUnmount() {
   *     console.log('实例销毁之前')
   *   },
   *   unmounted() {
   *     console.log('实例销毁完成')
   *   },
   *   errorCaptured(err, instance, info) {
   *     console.log('捕获到错误:', err, info)
   *   },
   *   activated() {
   *     console.log('keep-alive组件激活')
   *   },
   *   deactivated() {
   *     console.log('keep-alive组件停用')
   *   }
   * }
   */
  hooks: {
    type: Object,
    validator: (value) => validHooks(value)
  },

  /**
   * 插槽配置
   * @type {Object | Function | String | Array}
   * @description 组件插槽内容配置
   * @example
   * // 默认插槽 - 字符串
   * slots: '这是默认插槽内容'
   * 
   * // 默认插槽 - 函数
   * slots: () => '动态插槽内容'
   * 
   * // 默认插槽 - 组件结构
   * slots: {
   *   type: 'div',
   *   props: { class: 'slot-content' },
   *   children: '插槽组件内容'
   * }
   * 
   * // 具名插槽
   * slots: {
   *   default: '默认插槽内容',
   *   header: {
   *     type: 'h2',
   *     children: '头部插槽'
   *   },
   *   body: [
   *     {
   *       type: 'div',
   *       children: '数组结构-1',
   *     },
   *     {
   *       type: 'div',
   *       children: '数组结构-2',
   *     }
   *   ],
   *   footer: () => '函数结构'
   * }
   */
  slots: {
    type: [Object, Function, String],
    validator: (value) => validSlots(value)
  }
}