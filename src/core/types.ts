import { Component, VNode } from 'vue'
import { LifecycleHooks } from './constants'

export interface Model {
  path: string
  value: any
  immediate?: boolean
}

export interface UseModelCacheReturn {
  setModel: (val: any, force?: boolean) => void
  getModel: () => any
  setModels: (path: string, val: any) => void
  getModels: () => any
  getDCModels: () => any
  setModelsEffect: (path: string, val: any) => void
  modelValue: any
}

export interface UseModelCacheOptions {
  basePath: string
  model?: Model
  value?: any
}

export interface LazyOptions {
  num: number
  step: number
}

export interface LazyContext {
  total: VNode[]
  loaded: VNode[]
}

export interface DCHooks {
  beforeCreate?: () => void
  created?: () => void
  beforeMount?: () => void
  mounted?: () => void
  beforeUpdate?: () => void
  updated?: () => void
  beforeUnmount?: () => void
  unmounted?: () => void
  activated?: () => void
  deactivated?: () => void
  errorCaptured?: (err: Error, instance: Component, info: string) => boolean | void
}

export interface DCProps {
  modelValue?: any
  namespace?: string | symbol | object | null
  inject?: string | symbol | null
  provide?: { key: string | symbol, value: any } | null
  type: string | Function | object
  props?: Record<string, any>
  children?: string | any[] | object | null
  directives?: any[] | object | null
  events?: Record<string, Function> | null
  hooks?: DCHooks | null
  slots?: Record<string, any> | null
} 