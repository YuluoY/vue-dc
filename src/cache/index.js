import Struct from "./Struct"
import Model from "./Model"

class DcCache
{
  /**
   * 缓存最大个数
   */
  static maxCount = 1000

  constructor()
  {
    this.struct = new Struct({ capacity: DcCache.maxCount })
    this.model = new Model()
  }

  /**
   * 添加模型
   * @param {string} key 
   * @param {any} value 
   */
  setModel(key, value)
  {
    this.model.set(key, value)
  }

  updateModel(key, value)
  {
    this.model.update(key, value)
  }

  /**
   * 获取模型
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {import('vue').Ref}
   */
  getModel(key, defaultValue = null)
  {
    return this.model.get(key, defaultValue)
  }

  /**
   * 是否存在模型
   * @param {string} key 
   * @returns {boolean}
   */
  hasModel(key)
  {
    return this.model.has(key)
  }

  /**
   * 删除模型
   * @param {string} key 
   */
  removeModel(key)
  {
    this.model.remove(key)
  }

  /**
   * 清空模型
   */
  clearModel()
  {
    this.model.clear()
  }

  /**
   * 转换成普通对象
   * @param {string} path 
   * @returns {object}
   */
  getRawModel(path)
  {
    return this.model.toRawObject(path)
  }

  /**
   * 添加组件
   * @param {object} struct 
   * @param {import('vue').VNode} vnode 
   */
  addVNode(struct, vnode)
  {
    this.struct.set(struct, vnode)
  }

  /**
   * 获取组件
   * @param {object} struct 
   * @returns {import('vue').VNode}
   */
  getVNode(struct)
  {
    return this.struct.get(struct)
  }

  /**
   * 删除组件
   * @param {object} struct 
   */
  removeVNode(struct)
  {
    this.struct.remove(struct)
  }

  /**
   * 是否存在组件
   * @param {object} struct 
   * @returns {boolean}
   */
  hasVNode(struct)
  {
    return this.struct.has(struct)
  }

  /**
   * 清空组件
   */
  clearVNodes()
  {
    this.struct.clear()
  }

  /**
   * 清空缓存
   */
  clear()
  {
    this.clearVNodes()
    this.clearModel()
  }

  get count()
  {
    return this.struct.size
  }
}

export default new DcCache()