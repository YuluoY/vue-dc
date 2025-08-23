import { isRef, ref } from 'vue'
import { isNil, isPlainObject } from 'lodash-es'

export default class Model
{
  constructor()
  {
    this.cache = new Map()
  }

  /**
   * 获取模型
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {import('vue').Ref}
   */
  get(key, defaultValue = null)
  {
    return this.cache.get(key) || defaultValue
  }

  /**
   * 设置模型
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value)
  {
    if (isPlainObject(value))
      return this.cache.set(key, value)

    // 如果不存在"."，则直接设置，这表示是一个默认值对象
   if (!~key.indexOf('.'))
    return this.cache.set(key, ref(value))

    // 如果存在"."，则需要获取默认值
    const keys = key.split('.')
    const lastKey = keys.pop()
    const parentKey = keys.join('.')
    const parent = this.cache.get(parentKey)
    const oldVal = this.cache.get(key)
    const defVal = parent?.[lastKey]

    if (oldVal && isRef(oldVal))
      oldVal.value = value
    else if (defVal && isNil(value))
      this.cache.set(key, ref(defVal))
    else
      this.cache.set(key, ref(value))
  }

  update(key, value)
  {
    const cache = this.cache.get(key)
    if (cache && isRef(cache))
      cache.value = value
  }

  /**
   * 是否存在模型
   * @param {string} key 
   * @returns {boolean}
   */
  has(key)
  {
    return this.cache.has(key)
  }

  /**
   * 删除模型
   * @param {string} key 
   */
  remove(key)
  {
    this.cache.delete(key)
  }

  /**
   * 清空模型
   */
  clear()
  {
    this.cache.clear()
  }

  /**
   * 转换为普通对象
   * @param {string} path
   * @returns {object}
   */
  toRawObject(path)
  {
    const result = {}
    if (path)
    {
      const targetKeys = path.split('.')
      const targetLength = targetKeys.length
      
      for (const [key, value] of this.cache) {
        const keys = key.split('.')
        const keysLength = keys.length
        
        // 优化：提前检查长度，避免不必要的every操作
        if (keysLength >= targetLength) {
          // 优化：使用for循环替代every，可以提前退出
          let isMatch = true
          for (let i = 0; i < targetLength; i++)
          {
            if (keys[i] !== targetKeys[i]) {
              isMatch = false
              break
            }
          }
          
          if (isMatch) 
          {
            const actualValue = isRef(value) ? value.value : value
            
            // 优化：减少slice操作，直接使用剩余部分
            let current = result
            for (let i = targetLength; i < keysLength; i++)
            {
              const k = keys[i]
              if (i === keysLength - 1)
                current[k] = actualValue
              else 
              {
                current[k] = current[k] || {}
                current = current[k]
              }
            }
          }
        }
      }
    }
    else
    {
      for (const [key, value] of this.cache)
      {
        const actualValue = isRef(value) ? value.value : value
        const keys = key.split('.')
        let current = result
        
        // 优化：减少forEach，使用for循环
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i]
          if (i === keys.length - 1)
            current[k] = actualValue
          else 
          {
            current[k] = current[k] || {}
            current = current[k]
          }
        }
      }
    }
    return result
  }
}