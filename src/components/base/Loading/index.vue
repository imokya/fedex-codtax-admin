<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  show?: boolean;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  text: '加载中...',
});

const loadingRef = ref();
</script>

<template>
  <div class="loading" ref="loadingRef" v-if="props.show">
    <svg-icon icon="chat-loading"></svg-icon>
    {{ props.text }}
  </div>
</template>

<style lang="scss" scoped>
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #8e8e8e;
  svg {
    width: 20px;
    height: 20px;
    animation: rotate 1s linear infinite;
    animation-fill-mode: both;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
