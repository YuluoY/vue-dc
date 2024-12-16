import { isString } from 'lodash'
import { Component, resolveComponent } from 'vue'
import { NATIVE_TAG, NativeTag } from './constants'

export function parseType(val: string | Component): string | Component {
  if (isString(val)) {
    if (NATIVE_TAG.includes(val as NativeTag)) {
      return val
    }
    return resolveComponent(val)
  }
  return val
} 