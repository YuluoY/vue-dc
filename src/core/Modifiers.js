import { debounce, omit, throttle } from "lodash-es"

export const Keyboard = (evt, modifiers) =>
{
  if (modifiers.enter && (evt.key === 'Enter' || evt.keyCode === 13))
    return true
  if (modifiers.tab && (evt.key === 'Tab' || evt.keyCode === 9))
    return true
  if (modifiers.delete && (evt.key === 'Delete' || evt.keyCode === 46))
    return true
  if (modifiers.esc && (evt.key === 'Escape' || evt.keyCode === 27))
    return true
  if (modifiers.space && (evt.key === 'Space' || evt.keyCode === 32))
    return true
  if (modifiers.up && (evt.key === 'ArrowUp' || evt.keyCode === 38))
    return true
  if (modifiers.down && (evt.key === 'ArrowDown' || evt.keyCode === 40))
    return true
  if (modifiers.left && (evt.key === 'ArrowLeft' || evt.keyCode === 37))
    return true
  if (modifiers.right && (evt.key === 'ArrowRight' || evt.keyCode === 39))
    return true
  if (modifiers.middle && (evt.key === 'Middle' || evt.keyCode === 3))
    return true
  if (modifiers.ctrl && (evt.key === 'Control' || evt.keyCode === 17))
    return true
  if (modifiers.alt && (evt.key === 'Alt' || evt.keyCode === 18))
    return true
  if (modifiers.shift && (evt.key === 'Shift' || evt.keyCode === 16))
    return true
  if (modifiers.meta && (evt.key === 'Meta' || evt.keyCode === 91))
    return true
  return false
}

export const ExtraFunc = (fn, modifiers) =>
{
  if (modifiers.debounce)
  {
    const delay = typeof modifiers.debounce === 'number' ? modifiers.debounce : 
      modifiers.debounce?.delay ? modifiers.debounce.delay : 300
    
    return debounce(fn, delay, omit(modifiers.debounce, ['delay']))
  }
  else if (modifiers.throttle)
  {
    const delay = typeof modifiers.throttle === 'number' ? modifiers.throttle : 
      modifiers.throttle?.delay ? modifiers.throttle.delay : 300
    
    return throttle(fn, delay, omit(modifiers.throttle, ['delay']))
  }
  return fn
}