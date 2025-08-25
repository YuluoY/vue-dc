import { 
  StructComponent,
  createStructComponent,
  createPureStructComponent,
  createWrapperStructComponent
} from "./src/core/StructComponent"
import DcCache from "./src/cache"
import useVirtualList from "./src/hooks/useVirtualList"

window.$dc ??= DcCache

StructComponent.install = (app) => {
  app.component('StructComponent', StructComponent)
}

export * from './src/constants'

export { 
  StructComponent, 
  createStructComponent, 
  createPureStructComponent, 
  createWrapperStructComponent,
  useVirtualList
}

export default {
  StructComponent,
  createStructComponent,
  createPureStructComponent,
  createWrapperStructComponent,
  useVirtualList
}