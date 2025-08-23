<template>
  <div id="app">
    <n-config-provider :hljs="hljs">
      <n-layout has-sider style="height: 100vh;">
        <!-- 左侧导航 -->
        <n-layout-sider width="250" style="background-color: #f5f5f5;">
          <div class="sidebar">
            <div class="logo">
              <h2>StructComp 测试</h2>
            </div>
            <n-menu
              :value="$route.path"
              :options="menuOptions"
              @update:value="handleMenuUpdate"
              class="sidebar-menu"
            />
          </div>
        </n-layout-sider>
        
        <!-- 主内容区域 -->
        <n-layout-content>
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-config-provider>
  </div>
</template>

<script>
import { h } from 'vue'
import { useRouter } from 'vue-router'
import hljs from 'highlight.js'

import { 
  DocumentTextOutline,
  FolderOutline,
  SettingsOutline,
  FlashOutline,
  CodeOutline
} from '@vicons/ionicons5'

import { 
  NConfigProvider,
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NMenu 
} from 'naive-ui'

export default {
  name: 'App',
  components: {
    NConfigProvider,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NMenu
  },
  setup() {
    const router = useRouter()

    const menuOptions = [
      {
        label: '基础测试',
        key: '/basic-test',
        icon: () => h(CodeOutline)
      },
      {
        label: 'Props属性测试',
        key: '/props-test',
        icon: () => h(DocumentTextOutline)
      },
      {
        label: 'Children子组件测试',
        key: '/children-test',
        icon: () => h(FolderOutline)
      },
      {
        label: 'Directives指令测试',
        key: '/directives-test',
        icon: () => h(SettingsOutline)
      },
      {
        label: 'Events事件测试',
        key: '/events-test',
        icon: () => h(FlashOutline)
      }
    ]

    const handleMenuUpdate = (key) => {
      console.log(key)
      router.push(key)
    }

    return {
      menuOptions,
      handleMenuUpdate,
      hljs
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.logo h2 {
  color: #409EFF;
  font-size: 18px;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-main {
  padding: 20px;
  background-color: #fff;
}

.test-container {
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.test-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.test-description {
  margin-bottom: 15px;
  color: #666;
  line-height: 1.6;
}

.code-block {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.result-section {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.result-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #409EFF;
}
</style>
