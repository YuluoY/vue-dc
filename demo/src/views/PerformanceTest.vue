<template>
  <div class="test-container">
    <h1>性能压力测试 - StructComp 性能分析</h1>
    
    <div class="test-description">
      这里提供了多种性能测试场景，用于评估 StructComp 在不同情况下的性能表现。
      包括大量组件渲染、频繁数据更新、复杂嵌套、内存泄漏检测等测试。
    </div>
    
    <!-- 性能测试 -->
    <div class="performance-tests">
      <h2>性能测试</h2>
      <div class="test-list">
        <div 
          v-for="(config, key) in performanceConfigs" 
          :key="key" 
          class="test-item"
        >
          <n-card :title="config.title">
            <n-collapse :default-expanded-names="['source']">
              <n-collapse-item title="查看配置源码" name="source">
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

    <!-- 性能监控面板 -->
    <div class="performance-monitor">
      <h2>实时性能监控</h2>
      <n-card>
        <div class="monitor-grid">
          <div class="monitor-item">
            <h3>内存使用</h3>
            <div class="monitor-value" id="memory-usage">加载中...</div>
          </div>
          <div class="monitor-item">
            <h3>FPS</h3>
            <div class="monitor-value" id="fps-counter">--</div>
          </div>
          <div class="monitor-item">
            <h3>组件数量</h3>
            <div class="monitor-value" id="component-count">0</div>
          </div>
          <div class="monitor-item">
            <h3>缓存大小</h3>
            <div class="monitor-value" id="cache-size">0</div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 性能建议 -->
    <div class="performance-tips">
      <h2>性能优化建议</h2>
      <n-card>
        <div class="tips-content">
          <div class="tip-item">
            <h4>🎯 组件优化</h4>
            <ul>
              <li>避免在渲染函数中进行复杂计算</li>
              <li>合理使用 v-memo 和 v-once 指令</li>
              <li>及时销毁不需要的组件</li>
            </ul>
          </div>
          <div class="tip-item">
            <h4>💾 内存管理</h4>
            <ul>
              <li>定期清理缓存中的无用数据</li>
              <li>避免循环引用导致的内存泄漏</li>
              <li>使用 WeakMap 存储临时数据</li>
            </ul>
          </div>
          <div class="tip-item">
            <h4>⚡ 渲染优化</h4>
            <ul>
              <li>使用虚拟滚动处理大量数据</li>
              <li>合理使用懒加载和代码分割</li>
              <li>避免频繁的 DOM 操作</li>
            </ul>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script>
// 导入配置文件
import * as performanceConfigs from './configs/performance-test.js'
// 导入序列化函数
import { serializeWithFunctions } from '../utils/index.js'

export default {
  name: 'PerformanceTest',
  setup() {
    return {
      performanceConfigs,
      serializeWithFunctions
    }
  },
  mounted() {
    this.startPerformanceMonitoring()
  },
  beforeUnmount() {
    this.stopPerformanceMonitoring()
  },
  methods: {
    startPerformanceMonitoring() {
      this.monitoringInterval = setInterval(() => {
        this.updatePerformanceMetrics()
      }, 1000)
    },
    stopPerformanceMonitoring() {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval)
        this.monitoringInterval = null
      }
    },
    updatePerformanceMetrics() {
      // 更新内存使用
      if (performance.memory) {
        const memory = performance.memory
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
        document.getElementById('memory-usage').textContent = `${usedMB}MB / ${totalMB}MB`
      }

      // 更新FPS
      this.updateFPS()

      // 更新组件数量
      const componentCount = window._cache?.count || 0
      document.getElementById('component-count').textContent = componentCount

      // 更新缓存大小
      const cacheSize = window._cache?.model?.size || 0
      document.getElementById('cache-size').textContent = cacheSize
    },
    updateFPS() {
      if (!this.lastTime) {
        this.lastTime = performance.now()
        this.frameCount = 0
        return
      }

      this.frameCount++
      const currentTime = performance.now()
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
        document.getElementById('fps-counter').textContent = fps
        this.lastTime = currentTime
        this.frameCount = 0
      }
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

.performance-tests {
  margin-bottom: 40px;
}

.performance-tests h2 {
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

.performance-monitor {
  margin-bottom: 40px;
}

.performance-monitor h2 {
  margin-bottom: 20px;
  color: #333;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.monitor-item {
  text-align: center;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.monitor-item h3 {
  margin: 0 0 10px 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.monitor-value {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  font-family: 'Courier New', monospace;
}

.performance-tips {
  margin-bottom: 40px;
}

.performance-tips h2 {
  margin-bottom: 20px;
  color: #333;
}

.tips-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tip-item {
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.tip-item h4 {
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 16px;
}

.tip-item ul {
  margin: 0;
  padding-left: 20px;
  color: #64748b;
}

.tip-item li {
  margin-bottom: 5px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .monitor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tips-content {
    grid-template-columns: 1fr;
  }
}
</style>
