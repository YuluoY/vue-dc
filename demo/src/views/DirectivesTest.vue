<template>
  <div class="test-container">
    <h1>Directives指令测试 - 自定义 Struct 配置</h1>
    
    <div class="test-description">
      在这里您可以测试StructComp的指令功能，包括条件渲染、样式绑定、事件修饰符等。
    </div>
    
    <!-- 指令测试 -->
    <div class="directives-tests">
      <h2>指令测试</h2>
      <div class="test-list">
        <div 
          v-for="(config, key) in directivesConfigs" 
          :key="key" 
          class="test-item"
        >
          <n-card :title="config.title">
            <n-collapse :default-expanded-names="['source']">
              <n-collapse-item title="查看配置源码" name="source">
                <n-code 
                  :code="JSON.stringify(config, null, 2)"
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
import * as directivesConfigs from './configs/directives-test.js'

export default {
  name: 'DirectivesTest',
  setup() {
    return {
      directivesConfigs
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

.directives-tests {
  margin-bottom: 40px;
}

.directives-tests h2 {
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
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}
</style>
