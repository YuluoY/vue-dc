# Vue Dynamic Components (vue-dc)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Vue](https://img.shields.io/badge/vue-%3E=3.2.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-%3E=4.5.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E=16.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

一个用于动态渲染 Vue 组件的高性能解决方案。

## 环境支持

- VS Code >= 1.60
- Chrome >= 87
- Firefox >= 78
- Safari >= 14

## 版本要求

- Vue >= 3.2.0
- TypeScript >= 4.5.0
- Node.js >= 16.0.0

## 特性

- 🚀 高性能动态组件渲染
- 🎯 支持懒加载
- 🔄 双向数据绑定
- 📦 内置多种指令支持
- 🛠 灵活的钩子函数
- 🎨 支持插槽和事件处理
- 💫 平滑的过渡动画

## 安装

```bash
npm install vue-dc
# 或
yarn add vue-dc
```

## 快速开始

```vue
<template>
  <ModelComp
    :type="componentType"
    :props="componentProps"
    :children="componentChildren"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ModelComp } from 'vue-dc'

const componentType = 'div'
const componentProps = {
  class: 'custom-class',
  style: { color: 'red' }
}
const componentChildren = 'Hello Vue DC!'

const handleChange = (val) => {
  console.log('Value changed:', val)
}
</script>
```

## API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | string \| Component | - | 要渲染的组件类型 |
| props | Object | {} | 传递给组件的属性 |
| children | string \| Array \| Object | null | 子节点内容 |
| directives | Array \| Object | null | 指令配置 |
| events | Object | null | 事件处理器 |
| hooks | Object | null | 生命周期钩子 |
| slots | Object | null | 插槽内容 |

### 指令

支持以下内置指令：

- v-dc-lazy：子组件懒加载
- v-if：条件渲染
- v-show：条件显示
- v-model：双向绑定
- 更多...

### 事件

- change：值变更事件
- update:modelValue：模型值更新事件

## 高级用法

### 懒加载

```vue
<template>
  <ModelComp
    type="div"
    :directives="{
      'v-dc-lazy': {
        num: 10,
        step: 5
      }
    }"
    :children="largeList"
  />
</template>
```

### 自定义钩子

```vue
<template>
  <ModelComp
    type="div"
    :hooks="{
      mounted: () => console.log('Component mounted'),
      updated: () => console.log('Component updated')
    }"
  />
</template>
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交改动：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](./LICENSE) 文件了解更多信息。 