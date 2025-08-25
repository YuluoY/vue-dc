import { shallowRef } from "vue"

export default function useVirtualList(list)
{

  const first = shallowRef(list.slice(0, 1))

  const mounted = first.value.mounted || first.value.hooks.mounted

  return first
}