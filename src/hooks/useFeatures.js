import { inject, isRef, nextTick, provide } from "vue"
import { CUSTOM_DIRECTIVES, INJECTION_KEYS } from "../constants"
import DcCache from "../cache"

export default function useFeatures(struct, ctx)
{
  let basePath = null
  let injectData = null
  let model = null
  let path = null

  // 注入父级结构命名空间
  const pNs = inject(INJECTION_KEYS.NAMESPACE, null)

  if (pNs)
    basePath = struct.namespace ? `${pNs}.${struct.namespace}` : pNs
  else
    basePath = struct.namespace

  // 如果当前存在命名空间，则向下传递
  if (struct.namespace)
    provide(INJECTION_KEYS.NAMESPACE, basePath)

  // 处理注入数据
  struct.inject && (injectData = inject(struct.inject, null))
  // 处理提供数据
  struct.provide && struct.provide.key && provide(struct.provide.key, struct.provide.value)

  // 处理modelValue
  if (struct.namespace && struct?.props?.modelValue)
  {
    DcCache.setModel(struct.namespace, struct.props.modelValue)
    model = DcCache.getModel(struct.namespace)
  }
  else if (struct.props?.modelValue?.path)
  {
    const { path: modelPath, value } = struct.props.modelValue
    path = basePath ? `${basePath}.${modelPath}` : modelPath

    if (!DcCache.hasModel(path))
      DcCache.setModel(path, value)
    model = DcCache.getModel(path)
  }

  /**
   * 更新模型
   * @param {any} val 
   */
  function setModel(val)
  {
    if (!struct.props?.modelValue?.path)
      return
    const { 
      number,
      min,
      max,
      precision
    } = struct.props.modelValue
  
    number && (val *= 1)

    if (isNaN(val) && number)
      return

    min && val < min && (val = min)
    max && val > max && (val = max)
    number && precision && (val = parseFloat(val.toFixed(precision)))

    DcCache.updateModel(path, val)
    struct.props.modelValue.value = val
  }

  /**
   * 获取模型值
   * @param {string=} _path 
   * @returns {any}
   */
  function getModel(_path)
  {
    _path ??= path
    const val = DcCache.getModel(_path)
    return isRef(val) ? val.value : val
  }

  /**
   * 刷新组件状态
   * @param {boolean} state  新状态值
   * @param {number}  delay  延迟时间，单位毫秒
   */
  function onDcRefresh(state, delay)
  {
    state ??= !struct.directives.value[CUSTOM_DIRECTIVES.IF]
    struct.directives.value[CUSTOM_DIRECTIVES.IF] = state
    nextTick(() => 
    {
      if (delay)
        setTimeout(() => (struct.directives.value[CUSTOM_DIRECTIVES.IF] = !state), delay)
      else
        struct.directives.value[CUSTOM_DIRECTIVES.IF] = !state
    })
  }

  /**
   * 控制组件显示/隐藏状态
   * @param {boolean} state 新状态值
   */
  function onDcShow(state)
  {
    state ??= !struct.directives.value[CUSTOM_DIRECTIVES.SHOW]
    struct.directives.value[CUSTOM_DIRECTIVES.SHOW] = state
  }

  return {
    model,
    path,
    basePath,
    injectData,
    setModel,
    getModel,
    getRawModel: (...args) => DcCache.getRawModel(...args),
    onDcRefresh,
    onDcShow
  }
} 

