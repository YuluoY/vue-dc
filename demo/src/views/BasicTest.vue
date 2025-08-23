<template>
  <div class="test-container">
    <h1>基础测试 - 自定义 Struct 配置</h1>
    
    <div class="test-description">
      在这里您可以编写自己的 Struct 配置进行测试，或者使用预设的配置项。
    </div>
    
    <!-- 基础组件测试 -->
    <div class="basic-tests">
      <h2>基础组件测试</h2>
      <component style="width: 100%;min-height: 300px;" :is="TestComponent"></component>
      <div class="test-list">
        <div 
          v-for="(config, key, index) in basicConfigs" 
          :key="key" 
          class="test-item"
        >
          <n-card :title="config.title">
            <n-collapse>
              <n-collapse-item title="查看配置源码" :name="index">
                <n-code 
                  :code="serializeWithFunctions(config, 2)"
                  language="json"
                  :show-line-numbers="true"
                  :copyable="true"
                />
              </n-collapse-item>
            </n-collapse>
            <div class="render-result">
              <struct-component v-bind="config" />
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入配置文件
import * as basicConfigs from './configs/basic-test.js'
// 导入序列化函数
import { serializeWithFunctions } from '../utils/index.js'
import { createVNode } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

export default {
  name: 'BasicTest',
  setup() {

    const vnode = createVNode(ElTable, {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]
    }, {
      default: () => [
        createVNode(ElTableColumn, {
          label: 'Name',
          prop: 'name'
        })
      ]
    })

    return {
      TestComponent: vnode,
      basicConfigs,
      serializeWithFunctions  
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.test-description {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.basic-tests {
  margin-bottom: 40px;
}

.basic-tests h2 {
  margin-bottom: 20px;
  color: #333;
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}



.test-item {
  margin-bottom: 20px;
}

.render-result {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}

.custom-editor {
  margin-bottom: 40px;
}

.custom-editor h2 {
  margin-bottom: 20px;
  color: #333;
}

.error-message {
  margin-bottom: 15px;
}

.preview-container {
  min-height: 200px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}

.empty-preview {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>
