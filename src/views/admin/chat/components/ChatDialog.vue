<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import type { Message } from '@/types/chat';
import { insertSystemTime } from '@/utils/chat/message';
import ChatRoom from '@/components/chat/page/ChatRoom/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import ChatService from '@/services/chat/chat.service';
import AuditService from '@/services/admin/audit.service';
import { useChatStore } from '@/stores/chat';
import { MessageType } from '@/types/chat';
import { hightLightKeywords, wait } from '@/utils/methods';

interface Props {
  scopeId: string;
  sessionId: string;
  keyword: string;
}

const props = withDefaults(defineProps<Props>(), {
  scopeId: '',
  sessionId: '',
  keyword: '',
});

const emits = defineEmits<{
  (e: 'download', scopeId: string): void;
  (e: 'close'): void;
}>();

const chatStore = useChatStore();
const page = ref(1);
const size = ref(10);
const totalPage = ref(1);
const chatRoomRef = ref();
const messageList = ref<Message[]>([]);
const showLoading = ref(false);

const getMessageList = async () => {
  const { data: result } = await ChatService.getChatHistory({
    //scopeId: props.scopeId,
    //keyWord: props.keyword,
    sessionId: props.sessionId,
    page: page.value,
    size: props.keyword ? 999 : size.value,
    platform: 1,
  });
  // 过滤发送失败的消息
  result.chatMessageDataList = result.chatMessageDataList.filter(
    (item: Message) => item.sendResult === 0
  );
  chatStore.setAvatar(result.userData.avatarUrl);
  totalPage.value = result.pageTotal;
  result.chatMessageDataList = result.chatMessageDataList.map((item: any) => {
    return {
      type: item.sender,
      message: item.content,
      mediaType: item.messageType,
      time: +dayjs(item.sendTime),
    } as Message;
  });
  if (props.keyword.trim() !== '') {
    result.chatMessageDataList = result.chatMessageDataList.map((item: any) => {
      if (item.type === MessageType.SYSTEM) {
        return item;
      }
      return {
        ...item,
        message: hightLightKeywords(item.message, props.keyword),
      };
    });
    chatRoomRef.value.scrollToHightKeyword();
  }
  return result.chatMessageDataList;
};

const initMessageList = async () => {
  const _messageList = await getMessageList();
  const formatMessageList = insertSystemTime(_messageList);
  messageList.value = formatMessageList;
  if (!props.keyword) {
    chatRoomRef.value.scrollIntoView(false);
  }
};

const handleLoadMore = async () => {
  if (page.value >= totalPage.value) return;
  showLoading.value = true;
  await wait();
  page.value += 1;
  const _messageList = await getMessageList();
  const moreData = insertSystemTime(_messageList);
  messageList.value = [...moreData, ...messageList.value];

  showLoading.value = false;
  chatRoomRef.value.scrollTo();
};

const handleDownload = async () => {
  emits('download', props.sessionId);
};
onMounted(() => {
  initMessageList();
});
</script>

<template>
  <div class="chat-dialog">
    <div class="chat-panel w-[80%] xl:w-[50%] relative">
      <div class="chat-panel-header">
        <div class="text-[#262626] text-[18px]">聊天内容</div>
        <common-button
          class="button-action mr-8 !py-1 !px-4"
          type="blue"
          plain
          round
          @click="handleDownload"
        >
          下载
        </common-button>
        <div
          class="absolute top-[20px] right-[20px] cursor-pointer"
          @click="emits('close')"
        >
          <svg-icon icon="chat-close" class="!w-[14px] !h-[14px]" />
        </div>
      </div>
      <div class="chat-panel-content">
        <chat-room
          :data="messageList"
          ref="chatRoomRef"
          @loadmore="handleLoadMore"
          :enable-scroll-bottom="true"
          :enable-load-more="true"
          :loading="showLoading"
          :show-name="true"
          class="chat-room"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-panel {
  min-height: 550px;
  background-color: #fbfbfb;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);

  &-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  }
}
.chat-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.chat-room) {
  height: 480px;
}
</style>
