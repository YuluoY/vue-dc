<template>
  <div class="test-container">
    <h1>Events事件测试 - 自定义 Struct 配置</h1>
    
    <div class="test-description">
      在这里您可以测试StructComp的事件处理功能，包括点击事件、输入事件、自定义事件等。
    </div>
    
    <!-- 事件测试 -->
    <div class="events-tests">
      <h2>事件测试</h2>
      <div class="test-list">
        <div 
          v-for="(config, key) in eventsConfigs" 
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
import * as eventsConfigs from './configs/events-test.js'

export default {
  name: 'EventsTest',
  setup() {
    return {
      eventsConfigs
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

.events-tests {
  margin-bottom: 40px;
}

.events-tests h2 {
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
