<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import ChatMessage from '../ChatMessage/index.vue';
import ChatTypeMessage from '../ChatTypeMessage/index.vue';
import ChatSystemMessage from '../ChatSystemMessage/index.vue';

import { Message, MessageType } from '@/types/chat';
import { useDebounceFn } from '@vueuse/core';
import { ElLoading } from 'element-plus';
import { wait } from '@/utils/methods';

interface Props {
  data: Message[];
  enableLoadMore?: boolean;
  enableScrollBottom?: boolean;
  loading?: boolean;
  showName?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showName: false,
  enableLoadMore: false,
  enableScrollBottom: false,
  loading: false,
});
const emits = defineEmits<{
  (e: 'loadmore'): void;
}>();

const roomRef = ref();
const loadingRef = ref();
const showScrollToBottom = ref(false);

const scrollToBottom = (smooth?: true) => {
  nextTick(() => {
    const roomElem = roomRef.value as HTMLElement;
    const itemElem = roomElem.querySelectorAll('div');
    const lastElem = itemElem[itemElem.length - 1];

    lastElem?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  });
};

const scrollIntoView = (smooth?: true) => {
  if (!showScrollToBottom.value) {
    scrollToBottom(smooth);
  }
};

const scrollToHightKeyword = async () => {
  await nextTick();
  await wait(200);
  const elem = roomRef.value?.querySelector('.text-highlight');
  elem && elem.scrollIntoView({ smooth: true, block: 'center' });
};

const scrollTo = (value: number = 100) => {
  nextTick(() => {
    const roomElem = roomRef.value;
    roomElem.scrollTop = value;
  });
};

const onMouseWheel = (e: any) => {
  const scrollTop = roomRef.value.scrollTop;
  if (scrollTop < 50 && e.deltaY < -50) {
    emits('loadmore');
  }
};

const addLoading = () => {
  ElLoading.service({
    target: loadingRef.value,
    background: 'transparent',
  });
};

const handleScroll = () => {
  const elem = roomRef.value;
  const scrollHeight = elem.scrollHeight;
  const elemHeight = elem.getBoundingClientRect().height;
  const scrollMaxHeight = scrollHeight - elemHeight;
  const deltaY = scrollMaxHeight - elem.scrollTop;
  // scrollMaxHeight * 0.4 && scrollHeight > 1000
  if (deltaY > 300) {
    showScrollToBottom.value = true;
  } else {
    showScrollToBottom.value = false;
  }
};

const mousewheelDebounce = useDebounceFn(onMouseWheel, 300);
const scrollDebounce = useDebounceFn(handleScroll, 100);

onMounted(() => {
  if (props.enableLoadMore) {
    roomRef.value.addEventListener('mousewheel', mousewheelDebounce, {
      passive: false,
    });
    //addLoading();
  }
  if (props.enableScrollBottom) {
    roomRef.value.addEventListener('scroll', scrollDebounce);
    scrollDebounce();
  }
});

onBeforeUnmount(() => {
  if (props.enableLoadMore) {
    roomRef.value.removeEventListener('mousewheel', mousewheelDebounce);
  }
  if (props.enableScrollBottom) {
    roomRef.value.removeEventListener('scroll', scrollDebounce);
  }
});

defineExpose({
  scrollToHightKeyword,
  scrollIntoView,
  scrollTo,
});
</script>

<template>
  <div class="chat-wrap">
    <div class="chat-component" ref="roomRef" :class="$attrs.class">
      <div class="loading" ref="loadingRef" v-show="props.loading">
        <svg-icon icon="chat-loading"></svg-icon>
        消息加载中
      </div>
      <template v-for="(item, index) in props.data" :key="item">
        <chat-message
          :type="item.type"
          :receiver-type="item.receiverType"
          :media-type="item.mediaType"
          :name="item.name"
          :message="item.message"
          :status="item.status"
          :seq="item.seq"
          :show-name="props.showName"
          :time="item.time"
          v-if="
            item.type === MessageType.CHATBOT ||
            item.type === MessageType.USER ||
            item.type === MessageType.TRANSFER ||
            item.type === MessageType.EMPLOYEE ||
            item.type === MessageType.PIPELINE
          "
        />
        <chat-system-message
          v-if="item.type === MessageType.SYSTEM"
          :message="item.message"
        />
        <chat-type-message v-if="item.type === MessageType.TYPE_SELECT" />
      </template>
    </div>
    <div class="back-bottom" v-if="showScrollToBottom" @click="scrollToBottom">
      返回最近聊天
      <svg-icon icon="chat-bottom" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-wrap {
  position: relative;
}

.chat-component {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px 15px 50px 20px;
}

.loading {
  --el-color-primary: var(--primary-purple);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #8e8e8e;
  svg {
    width: 16px;
    height: 16px;
    animation: rotate 1s linear infinite;
    animation-fill-mode: both;
  }
}

:deep(.el-loading-spinner) {
  svg {
    width: 25px;
    height: 25px;
  }
}

.back-bottom {
  width: 157px;
  height: 48px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px 0 15px;
  color: #fff;
  background-color: var(--primary-purple);
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.03);
  border-radius: 28px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
  svg {
    width: 40px;
    height: 40px;
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
