/**
 * 序列化对象，包括函数
 * @param {any} obj - 要序列化的对象
 * @param {number} indent - 缩进空格数
 * @returns {string} 序列化后的字符串
 */
export function serializeWithFunctions(obj, indent = 2) {
  function serialize(value, currentIndent = 0) {
    // 处理 null 和 undefined
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'

    // 处理基本类型
    if (typeof value === 'string') {
      return JSON.stringify(value)
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }

    // 处理函数
    if (typeof value === 'function') {
      const funcStr = value.toString()
      // 直接返回函数字符串，不进行额外处理
      // 如果是箭头函数，直接返回原函数字符串
      if (funcStr.includes('=>')) {
        return funcStr
      }
      // 普通函数添加 function 前缀
      return funcStr.replace(/^.*?\(/, 'function(')
    }

    // 处理数组
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]'
      
      const items = value.map(item => 
        ' '.repeat(currentIndent + indent) + serialize(item, currentIndent + indent)
      ).join(',\n')
      
      return `[\n${items}\n${' '.repeat(currentIndent)}]`
    }

    // 处理对象
    if (typeof value === 'object') {
      const keys = Object.keys(value)
      if (keys.length === 0) return '{}'
      
      const items = keys.map(key => {
        const serializedValue = serialize(value[key], currentIndent + indent)
        return ' '.repeat(currentIndent + indent) + JSON.stringify(key) + ': ' + serializedValue
      }).join(',\n')
      
      return `{\n${items}\n${' '.repeat(currentIndent)}}`
    }

    // 其他类型转为字符串
    return JSON.stringify(String(value))
  }

  return serialize(obj, 0)
}