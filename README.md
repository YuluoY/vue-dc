# Vue-DC (Vue Dynamic Components)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Vue3 动态结构化组件库 - 支持通过配置动态生成Vue组件

## 🚀 特性

- ✨ **动态组件生成**: 通过JSON配置动态创建Vue组件
- 🎯 **类型安全**: 完整的类型验证和错误提示
- 🔧 **高度可配置**: 支持属性、事件、指令、插槽、生命周期钩子等完整配置
- 📦 **轻量级**: 无额外依赖，纯Vue3实现
- 🎨 **UI框架兼容**: 支持Element Plus、Naive UI等主流UI框架
- ⚡ **高性能**: 虚拟滚动支持，优化大数据渲染
- 🔄 **命名空间**: 支持数据命名空间管理
- 🎛️ **依赖注入**: 支持provide/inject模式
- 🎪 **指令系统**: 内置防抖、节流等实用指令

## 🎨 在线演示

访问在线演示: [Demo](https://yuluoy.github.io/vue-dc/)

## 📦 安装

```bash
npm install @yuluoiii/vue-dc
```

## 🎯 快速开始

### 基础使用

```javascript
import { createApp } from 'vue'
import { StructComponent } from '@yuluoiii/vue-dc'
import App from './App.vue'

const app = createApp(App)
app.use(StructComponent)
app.mount('#app')
```

### 基础组件配置示例

#### 简单按钮
```javascript
const simpleButton = {
  type: "el-button",
  props: {
    type: "primary",
    size: "large"
  },
  events: {
    click: function() {
      console.log('按钮被点击了！')
    }
  },
  children: "点击我"
}
```

#### 输入框
```javascript
const inputField = {
  type: "el-input",
  props: {
    placeholder: "请输入内容",
    clearable: true,
    modelValue: { path: "inputValue", value: "" }
  },
  events: {
    input: function(event) {
      console.log('输入内容：', this.getModel())
    }
  }
}
```

## 📚 详细配置

### 核心属性

#### `type` - 组件类型
```javascript
// 字符串类型 - HTML元素或全局组件
type: 'div'
type: 'el-button'
type: 'ElButton'

// 函数类型 - 动态导入组件
type: () => import('@/components/MyComponent')

// 对象类型 - 内联组件定义
type: { /* 组件配置对象 */ }
```

#### `props` - 组件属性
```javascript
// 基础属性绑定
props: {
  class: 'my-class',
  style: { color: 'red' },
  placeholder: '请输入内容'
}

// 数据绑定
props: {
  modelValue: { 
    path: 'form.name', 
    value: '' 
  }
}

// 数字类型绑定
props: {
  modelValue: { 
    path: 'age', 
    value: 0, 
    number: true 
  }
}
```

#### `children` - 子组件
```javascript
// 字符串类型
children: '这是文本内容'

// 数组类型
children: [
  { type: 'div', children: '子组件1' },
  { type: 'span', children: '子组件2' }
]

// 对象类型
children: { type: 'div', children: '单个子组件' }

// 函数类型 - 动态导入
children: () => import('@/components/ChildComponent')

// 函数结构类型
children: () => ({ type: 'div', children: '动态内容' })
```

#### `events` - 事件处理
```javascript
// 基础事件
events: {
  click: {
    handler: function() {
      console.log('按钮被点击了')
    },
    // 也可以是对象，比如{ delay: 500, maxWait: 1000 }，参考lodash/debounce
    debounce: 500  
  },
  input: function(event) {
    console.log('输入内容：', event.target.value)
  }
}

// 带修饰符的事件
events: {
  'click.stop': function() {
    console.log('阻止冒泡的点击')
  },
  'keyup.enter': function() {
    console.log('按下了回车键')
  }
}
```

#### `directives` - 指令配置
```javascript
// 显示/隐藏指令
directives: {
  dcShow: true  // 显示元素
}

// 防抖指令
directives: {
  dcDebounce: 500  // 500ms防抖
}

// 全局自定义指令
directives: {
  style: {
    value: 'red',
    arg: 'color'
  }
}
```

#### `hooks` - 生命周期钩子
```javascript
hooks: {
  beforeCreate() {
    console.log('实例初始化之前')
  },
  created() {
    console.log('实例创建完成')
  },
  beforeMount() {
    console.log('挂载开始之前')
  },
  mounted() {
    console.log('实例挂载完成')
  },
  beforeUpdate() {
    console.log('数据更新之前')
  },
  updated() {
    console.log('数据更新完成')
  },
  beforeUnmount() {
    console.log('实例销毁之前')
  },
  unmounted() {
    console.log('实例销毁完成')
  },
  errorCaptured(err, instance, info) {
    console.log('捕获到错误:', err, info)
  },
  activated() {
    console.log('keep-alive组件激活')
  },
  deactivated() {
    console.log('keep-alive组件停用')
  }
}
```

#### `slots` - 插槽配置
```javascript
// 默认插槽 - 字符串
slots: '这是插槽内容'

// 默认插槽 - 组件结构
slots: {
  type: 'div',
  children: '插槽组件内容'
}

// 具名插槽
slots: {
  default: '默认插槽内容',
  header: {
    type: 'h2',
    children: '头部插槽'
  }
}
```

### 高级特性

#### `namespace` - 命名空间
```javascript
// 使用命名空间简化数据绑定
{
  namespace: 'form',
  children: [
    {
      type: 'el-input',
      props: {
        modelValue: { path: 'name' }  // 自动绑定到 form.name
      }
    }
  ]
}
```

#### `wrapper` - 包裹控制
```javascript
// 控制是否生成包裹元素
{
  type: 'div',
  wrapper: false,  // 不生成包裹元素
  children: '直接渲染内容'
}
```

## 🎨 演示

### 本地运行演示

```bash
# 克隆项目
git clone https://github.com/YuluoY/vue-dc.git

# 安装依赖
npm install

# 运行演示
npm run dev
```

### 演示功能

项目包含完整的演示页面，展示以下功能：

- **基础测试**: 简单表单、数据表格等基础组件配置
- **属性测试**: 各种属性绑定和数据验证
- **事件测试**: 事件处理和修饰符使用
- **指令测试**: 内置指令和自定义指令
- **插槽测试**: 默认插槽和具名插槽
- **性能测试**: 虚拟滚动和大量数据渲染
- **子组件测试**: 复杂嵌套组件结构

### 在Vue组件中使用

```vue
<template>
  <div>
    <!-- 使用 struct-component 渲染配置 -->
    <struct-component v-bind="config" />
  </div>
</template>

<script>
export default {
  setup() {
    const config = {
      type: "el-button",
      props: { type: "primary" },
      events: {
        click: function() {
          alert('按钮被点击了！')
        }
      },
      children: "点击我"
    }
    
    return { config }
  }
}
</script>
```

## 🚀 部署和使用指南

### 1. 初始化项目
```bash
# 安装依赖
npm install

# 初始化Git仓库
npm run init-git
```

### 2. 自动化提交和版本管理

#### 日常开发提交 (npm run commit)
```bash
npm run commit
```
这个命令适用于日常开发，会：
- 检查Git状态
- 显示更改的文件
- 提示输入提交信息
- 询问是否需要更新版本号（支持补丁/小版本/大版本/自定义）
- 询问是否需要创建Git标签 (可选)
- 自动推送到远程仓库
- **自动更新 CHANGELOG.md**
- **正确处理 package-lock.json**

**适用场景**: 日常开发、功能添加、Bug修复、文档更新等

#### 正式版本发布 (npm run release)
```bash
npm run release
```
这个命令适用于正式版本发布，会：
- 检查Git状态
- 选择版本类型 (补丁/小版本/大版本/预发布)
- 运行测试和代码检查
- 自动更新版本号
- 强制创建Git标签
- 推送到远程仓库

**适用场景**: 新功能发布、重大更新、正式版本发布

### 3. 手动版本管理
```bash
# 更新版本号
npm version patch  # 或 minor, major

# 创建标签
git tag v1.0.0

# 推送代码和标签
git push origin main
git push origin v1.0.0
```

### 4. 构建和部署

#### 构建主库
```bash
# 开发构建
npm run build

# 生产构建
npm run build:prod
```

#### 构建演示项目
```bash
# 构建演示项目
npm run build:demo

# 预览演示项目
npm run preview
```

## 🏷️ 标签管理

### 查看标签
```bash
# 查看所有标签
git tag

# 查看远程标签
git ls-remote --tags origin
```

### 删除标签
```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

## 🔧 配置说明

### package.json 脚本
- `npm run commit`: 自动化提交工具（推荐）
- `npm run release`: 版本发布工具
- `npm run postversion`: 版本更新后自动推送
- `npm run build`: 构建主库
- `npm run build:demo`: 构建演示项目

## 📝 最佳实践

### 提交信息规范
使用语义化的提交信息：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 版本号规范
遵循语义化版本控制 (Semantic Versioning):
- `MAJOR.MINOR.PATCH`
- `MAJOR`: 不兼容的API修改
- `MINOR`: 向下兼容的功能性新增
- `PATCH`: 向下兼容的问题修正

## 🚨 注意事项

1. **版本号管理**: 每次发布新版本时，确保版本号正确递增
2. **标签同步**: 创建标签后记得推送到远程仓库
3. **Release创建**: 在GitHub上为每个标签创建Release
4. **CHANGELOG更新**: 脚本会自动更新CHANGELOG.md记录变更
5. **package-lock.json**: 脚本会自动处理版本更新时的依赖同步

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。


## 📞 联系方式

- 项目主页: [https://github.com/YuluoY/vue-dc](https://github.com/YuluoY/vue-dc)
- 问题反馈: [Issues](https://github.com/YuluoY/vue-dc/issues)
- 邮箱: 568055454@qq.com
