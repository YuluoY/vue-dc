/* eslint-disable vue/no-dupe-keys */
import { assign, bind, capitalize, has, isArray, isEmpty, isFunction, isPlainObject, isString, isSymbol } from 'lodash'
import { useAttrs, Fragment, defineComponent, getCurrentInstance, h, mergeProps, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onMounted, onUnmounted, onUpdated, nextTick, reactive, shallowRef, provide, inject, ref, Component, VNode, PropType } from 'vue'
import ModelComp from './ModelComp'
import { CUSTOM_DIRECTIVES, DC_LAZY_PROPS, DC_NAMESPACE_INJECTION, DefaultLazy, CustomDirectives } from './constants'
import useModelCache from './cache'
import { DCProps, DCHooks, LazyContext, LazyOptions } from './types'

interface DirectiveOptions {
  [CUSTOM_DIRECTIVES.V_DC_LAZY]?: boolean | Record<string, any>
  [CUSTOM_DIRECTIVES.V_IF]?: boolean
  [CUSTOM_DIRECTIVES.V_SHOW]?: boolean
  [key: string]: boolean | Record<string, any> | Function | undefined
}

const RenderComp = defineComponent({
  name: 'RenderComp',
  props: {
    modelValue: {
      type: [Object, null] as PropType<DCProps['modelValue']>,
      default: null
    },
    namespace: {
      type: [String, Symbol, Object, null] as PropType<DCProps['namespace']>,
      default: null,
      validator: (val: DCProps['namespace']) => isString(val) || isSymbol(val) || isPlainObject(val) || val === null
    },
    inject: {
      type: [String, Symbol, null] as PropType<DCProps['inject']>,
      default: null,
      validator: (val: DCProps['inject']) => isString(val) || isSymbol(val) || val === null
    },
    provide: {
      type: [Object, null] as PropType<DCProps['provide']>,
      default: null,
      validator: (val: DCProps['provide']) => (isPlainObject(val) && ['key', 'value'].every(key => has(val, key))) || val === null
    },
    type: {
      type: [String, Function, Object] as PropType<DCProps['type']>,
      default: '',
      validator: (val: DCProps['type']) => isString(val) || isFunction(val) || isPlainObject(val)
    },
    props: {
      type: Object as PropType<DCProps['props']>,
      default: () => ({}),
      validator: (val: DCProps['props']) => isPlainObject(val)
    },
    children: {
      type: [String, Array, Object, null] as PropType<DCProps['children']>,
      default: null,
      validator: (val: DCProps['children']) => isString(val) || isArray(val) || isPlainObject(val) || val === null
    },
    directives: {
      type: [Array, Object, null] as PropType<DCProps['directives']>,
      default: null,
      validator: (val: DCProps['directives']) => isArray(val) || isPlainObject(val) || val === null
    },
    events: {
      type: [Array, Object, null] as PropType<DCProps['events']>,
      default: null,
      validator: (val: DCProps['events']) => isArray(val) || isPlainObject(val) || val === null
    },
    hooks: {
      type: [Object, null] as PropType<DCProps['hooks']>,
      default: null,
      validator: (val: DCProps['hooks']) => isPlainObject(val) || val === null
    },
    slots: {
      type: [Object, null] as PropType<DCProps['slots']>,
      default: null,
      validator: (val: DCProps['slots']) => isPlainObject(val) || val === null
    }
  },
  emits: ['change', 'update:modelValue'],
  setup(props: DCProps, ctx) {
    const isImmediated = ref(false)
    const instance = getCurrentInstance()
    const uid = String(instance?.uid || Math.random().toString(36).substr(2, 9))
    const proxy = instance?.proxy || null
    let injectData = inject(props.inject || '', null)
    
    let basePath = ''
    let path = inject(DC_NAMESPACE_INJECTION, '') as string

    if (path) {
      basePath = props.namespace ? 
        `${String(path)}.${String(props.namespace)}` : 
        path
    } else {
      basePath = props.namespace ? String(props.namespace) : uid
    }

    if (props.namespace || props.modelValue) {
      provide(DC_NAMESPACE_INJECTION, basePath)
    }

    props.provide && provide(props.provide.key, props.provide.value)
    
    const type = shallowRef<DCProps['type']>(props.type)
    const innerProps = reactive<Record<string, any>>({ ...props.props })
    const children = shallowRef<DCProps['children']>(props.children)
    const directives = reactive<DirectiveOptions>({ ...props.directives as DirectiveOptions })
    const events = handleEvents(props.events)
    const slots = handleSlots(props.slots)

    const {
      lazyContext,
      lazyOptions
    } = handleLazy({
      uid,
      innerProps,
      directive: directives[CUSTOM_DIRECTIVES.V_DC_LAZY],
      children
    })

    const {
      modelValue,
      setModel,
      getModel,
      setModels,
      getModels,
      getDCModels,
      setModelsEffect
    } = useModelCache({
      basePath,
      model: props.props?.modelValue,
      value: props.modelValue
    })

    function updateModel(val: unknown): void {
      setModel(val)
      ctx.emit('update:modelValue', getModels())
      ctx.emit('change', val)
    }

    function onChange(...args: unknown[]): void {
      ctx.emit('change', ...args)
    }

    handleHooks(props.hooks || null)

    return {
      uid,
      basePath,
      namespace: props.namespace,
      type,
      props: innerProps,
      children,
      directives,
      events,
      slots,
      model: modelValue,
      lazyOptions,
      lazyContext,
      injectData,
      isImmediated,

      setModel,
      getModel,
      setModels,
      getModels,
      getDCModels,
      setModelsEffect,
      updateModel,
      onChange
    }
  },

  render() {
    const props = mergeProps({}, this.props || {}, {
      'data-uid': this.uid,
      ...this.events,
      ...useAttrs()
    })

    if (!this.directives?.[CUSTOM_DIRECTIVES.V_SHOW]) {
      props.style = { display: 'none' }
    }

    if (this.props && !isEmpty(this.props.modelValue) && this.isImmediated) {
      props.modelValue = this.model
      props['onUpdate:modelValue'] = (val: unknown) => this.updateModel(val)
      this.props.modelValue?.immediate && this.setModel(this.props.modelValue?.value, true)
    }

    const children = handleChildren(this.children, this.onChange)
    
    const vnode = h(this.type, props, {
      default: () => children,
      ...this.slots
    })

    const newVnode = handleDirectives(vnode, this.directives)
    return newVnode
  },

  methods: {
    onRefresh(val?: boolean, time?: number): void {
      val = val ?? !this.directives[CUSTOM_DIRECTIVES.V_IF]
      this.directives[CUSTOM_DIRECTIVES.V_IF] = val
      nextTick(() => time ? setTimeout(() => (this.directives[CUSTOM_DIRECTIVES.V_IF] = !val), time) : (this.directives[CUSTOM_DIRECTIVES.V_IF] = !val))
    },

    onVisible(val?: boolean): void {
      val = val ?? !this.directives[CUSTOM_DIRECTIVES.V_SHOW]
      this.directives[CUSTOM_DIRECTIVES.V_SHOW] = val
    }
  }
})

function handleLazy({
  uid,
  innerProps,
  directive,
  children
}: {
  uid: string
  innerProps: Record<string, any>
  directive: DirectiveOptions[typeof CUSTOM_DIRECTIVES.V_DC_LAZY]
  children: any
}): { lazyOptions?: LazyOptions; lazyContext?: LazyContext } {
  if (!directive || !isArray(children.value)) {
    return {}
  }
  
  const lazyOptions = isPlainObject(directive) ? assign({}, DefaultLazy, directive) : DefaultLazy
  const lazyContext: LazyContext = {
    total: [...children?.value],
    loaded: [...children?.value?.slice(0, lazyOptions.num)]
  }

  if (children.value.length > lazyOptions.num) {
    innerProps[DC_LAZY_PROPS.LAZY] = true
    innerProps[DC_LAZY_PROPS.LOADED] = lazyContext.loaded.length
    innerProps[DC_LAZY_PROPS.REMAIN] = lazyContext.total.length

    let handleScroll: (() => void) | null = null
    onMounted(() => {
      const el = document.querySelector(`[data-uid="${uid}"]`) as HTMLElement

      if (!el) return
      
      handleScroll = () => {
        if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) {
          return
        }
        lazyContext.loaded.push(...lazyContext.total.slice(lazyContext.loaded.length, lazyContext.loaded.length + lazyOptions.step))
        innerProps[DC_LAZY_PROPS.LOADED] = lazyContext.loaded.length
        innerProps[DC_LAZY_PROPS.REMAIN] = lazyContext.total.length
        children.value = lazyContext.loaded
      }
      el.addEventListener('scroll', handleScroll, { passive: true })
    })
    
    onBeforeUnmount(() => {
      const el = document.querySelector(`[data-uid="${uid}"]`) as HTMLElement
      handleScroll && el?.removeEventListener('scroll', handleScroll)
    })
  }

  children.value = lazyContext.loaded

  return {
    lazyOptions,
    lazyContext
  }
}

function handleEvents(events: DCProps['events']): Record<string, Function> {
  const newEvents: Record<string, Function> = {}
  !isEmpty(events) && Object.keys(events || {}).forEach(key => {
    const event = events?.[key]
    const newKey = `on${capitalize(key)}`
    isFunction(event) && (newEvents[newKey] = event)
  })
  return newEvents
}

function handleDirectives(vnode: VNode | null, directives: DirectiveOptions): VNode | null {
  !isEmpty(directives) && Object.keys(directives).forEach(key => {
    const directive = directives[key as CustomDirectives]
    if (isFunction(directive)) {
      directives[key] = directive()
    }
  })

  if (!directives?.[CUSTOM_DIRECTIVES.V_IF]) {
    vnode = null
  }
  return vnode
}

function handleChildren(children: DCProps['children'], onChange: (...args: unknown[]) => void): VNode[] | null {
  if (isString(children)) {
    return [h(Fragment, null, [children])]
  } else if (isArray(children)) {
    return [h(Fragment, null, children.map((child, index) => {
      const childProps = isPlainObject(child) ? child : {}
      return h(ModelComp, { key: index, type: childProps.type || '', ...childProps, onChange })
    }))]
  } else if (isPlainObject(children)) {
    const childProps = children as Partial<DCProps>
    return [h(ModelComp, { type: childProps.type || '', ...childProps, onChange })]
  }
  return null
}

function handleHooks(hooks: DCHooks | null): void {
  if (!hooks) return

  const bindHooks = (hook: Function, fn?: Function) => fn && isFunction(fn) && hook(fn)

  hooks.beforeCreate?.()
  hooks.created?.()

  bindHooks(onBeforeMount, hooks.beforeMount)
  bindHooks(onMounted, hooks.mounted)
  bindHooks(onBeforeUnmount, hooks.beforeUnmount)
  bindHooks(onUnmounted, hooks.unmounted)
  bindHooks(onBeforeUpdate, hooks.beforeUpdate)
  bindHooks(onUpdated, hooks.updated)
  bindHooks(onActivated, hooks.activated)
  bindHooks(onDeactivated, hooks.deactivated)
}

function handleSlots(slots: DCProps['slots']): Record<string, Function> | null {
  const newSlots: Record<string, Function> = {}
  if (isEmpty(slots)) {
    return null
  }
  
  for (const key in slots) {
    if (!has(slots, key)) continue
    
    const slot = slots[key]
    if (isString(slot)) {
      newSlots[key] = () => slot
    } else if (isFunction(slot)) {
      newSlots[key] = (...args: unknown[]) => h(ModelComp, { ...slot(...args) })
    } else if (isPlainObject(slot)) {
      newSlots[key] = () => h(ModelComp, slot)
    } else {
      newSlots[key] = () => null
    }
  }
  return newSlots
}

export default RenderComp
