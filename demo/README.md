# Vue3 + JavaScript + Vite 演示项目

这是一个使用 Vue3 Composition API 和 Vite 构建的现代化前端演示项目。

## 项目特性

- 🚀 **Vue3 Composition API** - 使用最新的 Vue3 语法
- ⚡ **Vite** - 快速的构建工具和开发服务器
- 🎨 **现代化UI** - 美观的渐变背景和毛玻璃效果
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🔧 **JavaScript** - 纯 JavaScript 实现，无需 TypeScript

## 演示功能

### 1. 计数器演示
- 展示 Vue3 的响应式数据绑定
- 包含增加、减少、重置功能

### 2. 响应式数据演示
- 双向数据绑定 (`v-model`)
- 计算属性 (`computed`)
- 实时字符计数

### 3. 列表渲染演示
- 待办事项管理
- 添加、删除、标记完成功能
- 动态列表渲染 (`v-for`)

### 4. 条件渲染演示
- 条件显示/隐藏内容 (`v-if`/`v-else`)
- 实时时间显示
- 定时器管理

## 技术栈

- **Vue 3.4+** - 渐进式 JavaScript 框架
- **Vite 5.0+** - 下一代前端构建工具
- **Composition API** - Vue3 的组合式 API
- **CSS3** - 现代化样式，包含渐变、动画、毛玻璃效果

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
demo/
├── index.html          # HTML 入口文件
├── package.json        # 项目配置和依赖
├── vite.config.js      # Vite 配置文件
├── README.md          # 项目说明文档
└── src/
    ├── main.js        # Vue 应用入口
    ├── App.vue        # 主应用组件
    └── style.css      # 全局样式文件
```

## Vue3 Composition API 特性演示

### 响应式数据
```javascript
const count = ref(0)
const message = ref('')
```

### 计算属性
```javascript
const messageLength = computed(() => message.value.length)
```

### 生命周期钩子
```javascript
onMounted(() => {
  // 组件挂载后的逻辑
})

onUnmounted(() => {
  // 组件卸载时的清理逻辑
})
```

### 方法定义
```javascript
const increment = () => {
  count.value++
}
```

## 样式特性

- **渐变背景** - 使用 CSS 渐变创建美观的背景
- **毛玻璃效果** - 使用 `backdrop-filter` 实现现代 UI 效果
- **悬停动画** - 平滑的过渡和变换效果
- **响应式布局** - 使用 CSS Grid 和媒体查询
- **自定义滚动条** - 美化浏览器默认滚动条

## 浏览器支持

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

## 开发建议

1. 使用 Vue DevTools 进行调试
2. 利用 Vite 的热重载功能提高开发效率
3. 参考 Vue3 官方文档了解更多 Composition API 用法

## 许可证

MIT License
