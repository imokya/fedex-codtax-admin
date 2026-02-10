<script setup lang="ts">
interface Props {
  content?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: '暂无内容<br>点击右上方+号添加',
});
</script>

<template>
  <div class="empty">
    <div class="empty-wrap text-center">
      <div class="empty-icon ml-2">
        <svg-icon icon="chat-empty" />
      </div>
      <div class="empty-text mt-1" v-html="props.content"></div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  font-size: 14px;
  color: #595959;
  text-align: center;

  &-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  &-icon {
    svg {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
