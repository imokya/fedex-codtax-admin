<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { InstantReply } from '@/types/chat';
import Sortable from 'sortablejs';
import ReplyService from '@/services/chat/reply.service';

interface Props {
  data: InstantReply;
  editable?: boolean;
  sortable?: boolean;
  isPublic?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  sortable: true,
  isPublic: false,
});
const emits = defineEmits<{
  (e: 'add', data: InstantReply): void;
  (e: 'remove', data: InstantReply): void;
  (e: 'edit', data: InstantReply): void;
}>();

const showAction = ref(false);
const expand = ref(false);
const replyFolderRef = ref();
let sortable: Sortable;

const handleExpand = () => {
  expand.value = !expand.value;
};

const reorderReply = () => {
  const reply = replyFolderRef.value.querySelectorAll('.reply-list-item');
  const replyIds: string[] = [];
  reply.forEach((item: any) => {
    const replyId = item.getAttribute('data-id');
    replyIds.push(replyId);
  });
  ReplyService.reorderReply(props.id!, replyIds);
};

onMounted(() => {
  const el = replyFolderRef.value.querySelector('.instant-reply-list');
  if (props.sortable) {
    sortable = Sortable.create(el, {
      onEnd: (event) => {
        reorderReply();
      },
    });
  }
});

onUnmounted(() => {
  if (sortable) {
    sortable.destroy();
  }
});
</script>

<template>
  <div class="instant-reply-folder" :class="{ sortable: props.sortable }" ref="replyFolderRef">
    <div class="instant-reply-folder-card" @mouseenter="showAction = true" @mouseleave="showAction = false"
      @dblclick.stop="handleExpand" :class="{ public: props.isPublic }">
      <div class="instant-reply-folder-card-arrow" @click.stop="handleExpand" :class="{ expand }">
        <svg-icon icon="chat-folder-arrow" />
      </div>
      <div class="instant-reply-folder-card-icon" @click="handleExpand">
        <svg-icon icon="chat-folder" />
      </div>
      <div class="instant-reply-folder-card-text" :class="{ public: props.isPublic }">
        {{ props.data.text }}
      </div>
      <div class="instant-reply-folder-card-action" v-show="showAction && props.editable">
        <div title="删除文件夹">
          <svg-icon icon="chat-remove" @click.stop="emits('remove', props.data)" />
        </div>
        <div title="编辑文件夹">
          <svg-icon icon="chat-edit" @click.stop="emits('edit', props.data)" style="width: 17px; height: 17px" />
        </div>
        <div title="添加快捷回复">
          <svg-icon icon="chat-reply-add" style="width: 14px; height: 14px" @click.stop="emits('add', props.data)" />
        </div>
      </div>
    </div>
    <div class="instant-reply-folder-drag-status" v-if="showAction && !expand && props.sortable">
      <svg-icon icon="chat-movable" style="width: 10px; height: 10px"></svg-icon>
    </div>
    <div class="instant-reply-list" v-show="props.data.children && expand">
      <slot></slot>
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

  &.sortable {
    cursor: move;
  }

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
    padding: 12px 10px;
    overflow: hidden;

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

      &.public {
        color: var(--primary-purple);
      }
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
