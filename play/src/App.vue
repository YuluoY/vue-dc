<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ModelComp from '../../core/index.ts'
import { ElButton, ElCard, ElText, ElTooltip } from 'element-plus'
import { ref, reactive, onMounted, nextTick } from 'vue'

const a = reactive([])

const struct = {
  type: ElCard.name,
  slots: {
    header: 'asdasds',
    footer() {
      return {
        type: 'div',
        children: 'footer'
      }
    }
  },
  children: [
    {
      type: ElButton.name,
      children: '按钮',
      events: {
        click() {
          this.children = 'haha'
          this.onRefresh()
        }
      },
    },
    {
      type: ElButton.name,
      children: '卡片内容',
      events: {
        click() {
          this.type = ElCard.name
          this.children = [
            {
              type: ElText.name,
              props: {
                type:'danger'
              },
              children: 'asdasd'
            },
            {
              type: this.type,
              children: this.children,
            }
          ]
          this.$forceUpdate()
        }
      },
    }
  ]
}

</script>

<template>
  <ModelComp v-bind="struct"></ModelComp>
</template>

<style scoped>

</style>
