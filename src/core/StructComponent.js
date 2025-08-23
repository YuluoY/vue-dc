import { getCurrentInstance, reactive, shallowRef, h, defineComponent, withDirectives, ref, markRaw, onBeforeUnmount, provide, inject, createVNode } from "vue"
import { resolveType } from "../utils/type-resolver"
import { validStruct } from "../utils/validator"
import Props from "./Props"
import useFeatures from "../hooks/useFeatures"
import { processChildren } from "../utils/children-handler"
import { processDirectives } from "../utils/directives-handler"
import { processEvents } from "../utils/events-handler"
import { processHooks } from "../utils/hooks-handler"
import { processMethods } from "../utils/methods-handler"
import DcCache from "../cache"
import { CUSTOM_DIRECTIVES, DEFAULT_COMPONENT_NAME, PATCH_FLAGS, INJECTION_KEYS } from "../constants"
import { processSlots } from "../utils/slots-hanlder"
import { removeExtraFuncEvent } from "../utils/core"

export const StructComponent = (struct) => 
{
  if (struct.directives?.[CUSTOM_DIRECTIVES.IF] === false)
    return h(_ => null)

  if (DcCache.hasVNode(struct))
    return DcCache.getVNode(struct)

  const parentCtx = inject(INJECTION_KEYS.PARENT_CTX, null)

  const wrapper = struct.wrapper ?? true

  const vnode = wrapper ? createWrapperStructComponent(struct, parentCtx) : createPureStructComponent(struct, parentCtx)

  DcCache.addVNode(struct, vnode)
  return vnode
}

export const createPureStructComponent = (struct, parentCtx) =>
{
  const events = processEvents(struct.events || {}, parentCtx)
  const props = { ...struct.props, ...events }
  const slots = processSlots(struct.slots || {}, parentCtx)
  const type = resolveType(struct.type, parentCtx)
  const children = processChildren(struct.children || [], parentCtx)
  const directives = processDirectives(struct.directives || {})

  const flag = struct.props ? PATCH_FLAGS.FULL_PROPS : PATCH_FLAGS.NO_PATCH
  const dcProps = struct.props ? Object.keys(struct.props) : []

  const vnode = createVNode(
    type, 
    props, 
    {
      default: children,
      ...slots
    }, 
    flag, 
    dcProps, 
    true
  )
  return directives?.length ? withDirectives(vnode, directives) : vnode
}

export const createWrapperStructComponent = (struct, parentCtx) =>
{
  const hooks = processHooks(struct)
  const methods = processMethods(struct)

  /**
   * @type {import('vue').ComponentOptions}
   */
  const options =
  {
    name: struct.name || DEFAULT_COMPONENT_NAME,
    inheritAttrs: false,
    props: Props,
    emits: ['change', 'update:modelValue'],
    setup(_, context)
    {
      const instance = getCurrentInstance()
      const proxy = instance?.proxy || {}
      const uid = instance?.uid || DcCache.count + 1
      
      provide(INJECTION_KEYS.PARENT_CTX, context)

      const type = shallowRef(_.type)
      const props = reactive(_.props || {})
      const children = shallowRef(_.children || [])
      const events = processEvents(_.events || {}, proxy)
      const slots = ref(_.slots || {})
      const directives = ref(_.directives || {})
      const features = useFeatures({
        ..._,
        type, 
        directives, 
        props, 
        events, 
        children, 
        slots 
      }, context)

      onBeforeUnmount(() =>
      {
        DcCache.removeVNode(struct)
        DcCache.removeModel(features.path)
        removeExtraFuncEvent(events)
        struct = null
      })

      return {
        ...features,
        parentCtx,
        uid,
        instance,
        type,
        props,
        children,
        events,
        slots,
        directives
      }
    },
  
    render(ctx)
    {
      if (ctx.directives?.[CUSTOM_DIRECTIVES.IF] === false)
        return h(_ => null)

      const type = resolveType(ctx.type, ctx.instance)
      const children = processChildren(ctx.children, ctx)
      const slots = processSlots(ctx.slots, ctx)
      const directives = processDirectives(ctx.directives)

      const props = { ...ctx.props, ...ctx.events }

      if (props.modelValue && !ctx.namespace)
      {
        props.modelValue = ctx.model
        if (!props['onUpdate:modelValue'])
          props['onUpdate:modelValue'] = ctx.setModel
      }

      const vnode = h(type, props, {
        default: children,
        ...slots
      })

      return directives?.length ? withDirectives(vnode, directives) : vnode
    },

    ...hooks,
    methods
  }

  return h(markRaw(defineComponent(options)), struct)
}

/**
 * 创建结构组件
 * @param {object} struct 
 * @returns {import('vue').VNode}
 */
export const createStructComponent = (struct) =>
{
  if (!validStruct(struct))
    throw new Error('DC: Invalid struct')

  return StructComponent(struct)
}