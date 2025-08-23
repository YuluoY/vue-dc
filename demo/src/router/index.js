import PropsTest from '../views/PropsTest.vue'
import ChildrenTest from '../views/ChildrenTest.vue'
import DirectivesTest from '../views/DirectivesTest.vue'
import EventsTest from '../views/EventsTest.vue'
import BasicTest from '../views/BasicTest.vue'

const routes = [
  {
    path: '/',
    redirect: '/basic-test'
  },
  {
    path: '/props-test',
    name: 'PropsTest',
    component: PropsTest,
    meta: { title: 'Props属性测试' }
  },
  {
    path: '/children-test',
    name: 'ChildrenTest',
    component: ChildrenTest,
    meta: { title: 'Children子组件测试' }
  },
  {
    path: '/directives-test',
    name: 'DirectivesTest',
    component: DirectivesTest,
    meta: { title: 'Directives指令测试' }
  },
  {
    path: '/events-test',
    name: 'EventsTest',
    component: EventsTest,
    meta: { title: 'Events事件测试' }
  },
  {
    path: '/basic-test',
    name: 'BasicTest',
    component: BasicTest,
    meta: { title: '基础测试' }
  }
]

export default routes
