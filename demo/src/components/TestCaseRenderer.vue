<template>
  <div class="test-container">
    <h1>{{ title }}</h1>
    
    <div 
      v-for="testCase in testCases" 
      :key="testCase.id" 
      class="test-section"
    >
      <div class="test-title">{{ testCase.title }}</div>
      <div class="test-description">{{ testCase.description }}</div>
      
      <!-- 源码查看器 -->
      <n-collapse>
        <n-collapse-item title="查看配置源码" name="source">
          <n-code 
            :code="JSON.stringify(testCase.config, null, 2)"
            language="json"
            :show-line-numbers="true"
            :copyable="true"
          />
        </n-collapse-item>
      </n-collapse>
      
      <!-- 渲染结果 -->
      <div class="result-section">
        <div class="result-title">渲染结果：</div>
        <div v-if="testCase.layout === 'row'">
          <n-grid :cols="2" :x-gap="20">
            <n-grid-item 
              v-for="(item, index) in testCase.items" 
              :key="index"
            >
              <n-card :title="item.title">
                <n-collapse>
                  <n-collapse-item title="查看配置源码" name="source">
                    <n-code 
                      :code="JSON.stringify(item.config, null, 2)"
                      language="json"
                      :show-line-numbers="true"
                      :copyable="true"
                    />
                  </n-collapse-item>
                </n-collapse>
                <struct-component v-bind="item.config" />
                <p v-if="item.value" class="value-display">当前值: {{ item.value }}</p>
              </n-card>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else>
          <struct-component v-bind="testCase.config" />
          <div v-if="testCase.extraContent" v-html="testCase.extraContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  NCollapse, 
  NCollapseItem, 
  NCode, 
  NGrid, 
  NGridItem, 
  NCard 
} from 'naive-ui'

export default {
  name: 'TestCaseRenderer',
  components: {
    NCollapse,
    NCollapseItem,
    NCode,
    NGrid,
    NGridItem,
    NCard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    testCases: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 20px;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.test-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.test-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
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
  white-space: pre-wrap;
  word-break: break-all;
}

.result-section {
  margin-top: 20px;
}

.result-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

h4 {
  margin: 10px 0;
  color: #555;
}
</style>
