<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
const chatStore = useChatStore();
</script>

<template>
  <div class="footer">
    <div class="footer-text">渠道内排队人数</div>
    <div class="footer-total">{{ chatStore.numInQueue }}</div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 16px;

  &-text {
    color: #595959;
  }

  &-total {
    color: var(--primary-purple);
    font-weight: 600;
  }
}
</style>
