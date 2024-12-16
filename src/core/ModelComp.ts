import { FunctionalComponent, h, useAttrs } from 'vue'
import { DEFAULT_DIRECTIVES } from './constants'
import { parseType } from './utils'
import RenderComp from './RenderComp'
import { assignWith } from 'lodash'
import { DCProps } from './types'

const ModelComp: FunctionalComponent<DCProps> = (props, ctx) => {
  // 确定组件类型
  const type = parseType(props.type as any)

  // 合并默认指令和传入指令
  const directives = assignWith(
    props.directives,
    DEFAULT_DIRECTIVES,
    (objValue, srcValue) => (objValue ? objValue : srcValue)
  )

  // 合并传入的 props 和上下文 attrs
  const binds = {
    ...props,         // 组件本身的 props
    ...useAttrs(),    // 父组件传递的非 props 属性（如事件绑定）
    type,             // 解析后的 type
    directives        // 合并后的指令
  }

  // 渲染子组件 RenderComp 并传递所有绑定属性
  return h(RenderComp, binds)
}

export default ModelComp 