import { 
  StructComponent,
  createStructComponent,
  createPureStructComponent,
  createWrapperStructComponent
} from "./src/core/StructComponent"
import DcCache from "./src/cache"

window.$dc = DcCache

StructComponent.install = (app) => {
  app.component('StructComponent', StructComponent)
}

export { 
  StructComponent, 
  createStructComponent, 
  createPureStructComponent, 
  createWrapperStructComponent 
}

export default {
  StructComponent,
  createStructComponent,
  createPureStructComponent,
  createWrapperStructComponent
}