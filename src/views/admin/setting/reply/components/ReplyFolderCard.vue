<script setup lang="ts">
import { ref } from 'vue';
import type { InstantReply } from '@/types/chat';
import { useReplyStore } from '@/stores/admin/reply';

interface Props {
  data: InstantReply;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'remove', data: InstantReply): void;
  (e: 'edit', data: InstantReply): void;
}>();

const replyStore = useReplyStore();

const showAction = ref(false);
</script>

<template>
  <div class="instant-reply-folder">
    <div
      class="instant-reply-folder-card"
      @mouseenter="showAction = true"
      @mouseleave="showAction = false"
      @click="replyStore.setSelectedFolderId(props.data.id)"
      :class="{ active: replyStore.selectedFolderId === props.data.id }"
    >
      <div class="instant-reply-folder-card-arrow"></div>
      <div class="instant-reply-folder-card-icon">
        <svg-icon icon="chat-folder" />
      </div>
      <div class="instant-reply-folder-card-text">{{ props.data.text }}</div>
      <div class="instant-reply-folder-card-action" v-show="showAction">
        <div title="删除文件夹">
          <svg-icon
            icon="chat-remove"
            @click.stop="emits('remove', props.data)"
          />
        </div>
        <div title="编辑文件夹">
          <svg-icon
            icon="chat-edit"
            @click.stop="emits('edit', props.data)"
            style="width: 17px; height: 17px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';

.instant-reply-list {
  display: flex;
  flex-direction: column;
}

.instant-reply-folder {
  position: relative;
  cursor: pointer;

  &-drag-status {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    margin: auto;
    z-index: 1;
    width: 10px;
    height: 10px;
  }
  &-card {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
    position: relative;
    padding: 12px 0;
    overflow: hidden;
    border-bottom: 1px solid #f2f2f2;

    &.active {
      background-color: #fafafa;
      .instant-reply-folder-card-text {
        color: var(--primary-purple);
      }
    }

    &:hover {
      background-color: #fafafa;
    }

    &-action {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      position: absolute;
      right: 0;
      padding: 0 10px;
      color: var(--primary-purple);
      background-color: #fafafa;
      // box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      cursor: pointer;
      svg {
        width: 18px;
        height: 18px;
      }
    }

    &-text {
      font-size: 16px;
      color: #333333;
      max-width: 200px;
      @include mixins.ellipsis;
    }

    &-icon {
      cursor: pointer;
      svg {
        width: 24px;
        height: 24px;
      }
    }

    &-arrow {
      cursor: pointer;
      transition: transform 0.1s ease-out;
      &.expand {
        transform: rotate(90deg);
      }
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
