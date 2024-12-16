import { get, has, isEqual, isPlainObject, set, unset } from 'lodash'
import { Ref, isRef, onBeforeUnmount, ref } from 'vue'
import { UseModelCacheOptions, UseModelCacheReturn } from './types'

interface Models {
  [key: string]: any
}

interface ModelsEffect {
  [key: string]: Ref<any>
}

const models: Models = {}
const modelsEffect: ModelsEffect = {}
;(window as any).$dc = (window as any).$dc ? (window as any).$dc : { models, modelsEffect }

export default function useModelCache({
  basePath,
  model,
  value
}: UseModelCacheOptions): UseModelCacheReturn {
  if (isPlainObject(value)) {
    set(models, basePath, value)
  }
  
  const modelPath = model?.path && `${basePath}.${model.path}`
  const modelValue: Ref<any> | null = model?.path ? ref(get(models, modelPath) || model?.value) : null
  
  if (isRef(modelValue) && modelPath) {
    set(modelsEffect, modelPath, modelValue)
  }

  function setModel(newVal: any, force = false): void {
    if ((!modelValue || isEqual(modelValue?.value, newVal)) && !force) {
      return
    }
    if (modelValue) {
      modelValue.value = newVal
    }
    setModels(model?.path || '', newVal)
    console.table([{
      path: `${basePath}.${model?.path}`,
      value: newVal,
      type: Object.prototype.toString.call(newVal)
    }])
  }

  function getModel(): any {
    return modelValue?.value
  }

  function setModels(path: string, val: any): void {
    set(models, `${basePath}.${path}`, val)
  }

  function setModelsEffect(path: string, val: any): void {
    set(modelsEffect, `${basePath}.${path}.value`, val)
    setModels(path, val)
  }

  function getModels(): any {
    return get(models, basePath)
  }

  function getDCModels(): Models {
    return models
  }

  onBeforeUnmount(() => {
    if (has(models, basePath)) {
      unset(models, basePath)
    }
  })

  return {
    setModel,
    getModel,
    setModels,
    getModels,
    getDCModels,
    setModelsEffect,
    modelValue
  }
} 