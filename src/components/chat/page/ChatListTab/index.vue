<script setup lang="ts">
import { ref, ComputedRef } from 'vue';

export interface ChatListTabProps {
  text: string;
  total: ComputedRef;
}

interface Props {
  data: ChatListTabProps[];
}

const props = defineProps<Props>();

const emits = defineEmits(['change']);

const currentIndex = ref(0);

const handleClick = (item: any, index: number) => {
  currentIndex.value = index;
  emits('change', { ...item, index });
};
</script>

<template>
  <div class="chat-tabs">
    <div
      class="chat-tabs-item"
      :class="{ active: index === currentIndex }"
      v-for="(item, index) in props.data"
      :key="index"
      @click="handleClick(item, index)"
    >
      {{ item.text }}<span>{{ item.total }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-tabs {
  display: flex;
  user-select: none;
  &-item {
    height: 56px;
    text-align: center;
    font-size: 14px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    color: #333333;
    gap: 10px;

    & > span {
      min-width: 20px;
      height: 20px;
      font-size: 14px;
      color: #565656;
      border-radius: 2px;
      background-color: #f9f2fb;
      padding: 6px;
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
    }

    &.active {
      font-weight: 600;
      color: var(--primary-purple);
      & > span {
        color: currentColor;
        background-color: #f9f2fb;
      }

      &::after {
        content: '';
        width: 100%;
        height: 4px;
        background-color: currentColor;
        position: absolute;
        display: inline-block;
        bottom: 0;
      }
    }
  }
}
</style>
