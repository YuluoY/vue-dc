import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router' 
import 'highlight.js/styles/github.css'
// import { StructComponent } from '@yuluoiii/vue-dc'
import { StructComponent } from '../../index'
import App from './App.vue'
import routes from './router'
import naive from 'naive-ui'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(StructComponent)
app.use(naive)
app.use(ElementPlus)
app.mount('#app')
