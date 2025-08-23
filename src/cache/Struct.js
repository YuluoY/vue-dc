export default class Struct
{
  constructor(opts = {})
  {
    this.capacity = opts.capacity || 1000
    this.cache = new Map()
  }

  get(key, defaultValue = null)
  {
    const value = this.cache.get(key)
    if (value)
    {
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return defaultValue
  }

  set(key, value)
  {
    if (this.cache.has(key))
      this.cache.delete(key)
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value)
    this.cache.set(key, value)
  }

  has(key)
  {
    return this.cache.has(key)
  }

  remove(key)
  {
    this.cache.delete(key)
  }

  clear()
  {
    this.cache.clear()
  }

  get size()
  {
    return this.cache.size
  }

  get keys()
  {
    return this.cache.keys()
  }

  get values()
  {
    return this.cache.values()
  }

  get entries()
  {
    return this.cache.entries()
  }
}