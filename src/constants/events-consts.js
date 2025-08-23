/**
 * 事件修饰符类型
 * @readonly
 * @enum {boolean}
 */
export const EXTRA_EVENT_MODIFIERS = 
{
   /** 功能修饰符 - 防抖 */
   Debounce: 'debounce',
   /** 功能修饰符 - 节流 */
   Throttle: 'throttle',
   /** 功能修饰符 - 执行一次 */
   Once: 'once',
}

/**
 * withModifiers 修饰符 支持的keys
 */
export const RAW_EVENT_MODIFIERS = 
{
    // 事件行为修饰符
    Stop: 'stop',
    Prevent: 'prevent',
    Self: 'self',
    Exact: 'exact',
    
    // 鼠标按键修饰符
    Left: 'left',
    Right: 'right',
    Middle: 'middle',
    
    // 系统修饰键
    Ctrl: 'ctrl',
    Shift: 'shift',
    Alt: 'alt',
    Meta: 'meta',
    
    // 其他特殊修饰符
    Passive: 'passive',
    Capture: 'capture',

    // 按键修饰符
    Enter: 'enter',
    Tab: 'tab',
    Delete: 'delete',
    Esc: 'esc',
    Space: 'space',
    Up: 'up',
    Down: 'down',
    Pageup: 'pageup',
    Pagedown: 'pagedown',
    Home: 'home',
    End: 'end'
}

/**
 * 事件修饰符 支持的keys
 */
export const EVENTS_MODIFIERS = [...Object.values(EXTRA_EVENT_MODIFIERS), ...Object.values(RAW_EVENT_MODIFIERS)]