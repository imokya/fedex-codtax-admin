<script setup lang="ts">
import { ref, onUnmounted, onMounted, onActivated } from 'vue';
import { getEmitter } from '@/utils/chat/methods';
import { EVENT_CHAT_TYPE, EVENT_REFESH_LIST } from '@/constants/chat/event';
import { showSuccess } from '@/utils/methods';
import { CHAT_NEXT_INTERVAL } from '@/constants/chat';
import ChatService from '@/services/chat/chat.service';
import GlobalService from '@/services/admin/global.service';
import { useChatStore } from '@/stores/chat';

const data = ref<any[]>([]);

const chatStore = useChatStore();
const currentIndex = ref(-1);
const emitter = getEmitter();
let id: any;

const saveChatType = async (data: any) => {
  try {
    await ChatService.setChatType(data.text);
    showSuccess('会话类型保存成功');
    id = setTimeout(() => {
      emitter.emit(EVENT_REFESH_LIST);
      chatStore.selectNextUser();
    }, CHAT_NEXT_INTERVAL * 1000);
  } catch {
    currentIndex.value = -1;
  }
};

const handleClick = (item: any, index: number) => {
  if (currentIndex.value === -1) {
    currentIndex.value = index;
    saveChatType(item);
  }
};

const getTypes = async () => {
  const { data: result } = await GlobalService.getConfig({
    configKey: 'GLOBAL',
    configKey3: 'ADVICE.TYPE',
  });

  const keys = result?.configItems[0]?.configValue;
  data.value = keys.map((item: any) => {
    return {
      text: item,
    };
  });
};

getTypes();

onUnmounted(() => {
  //clearTimeout(id);
});
</script>

<template>
  <div class="chat-type-message">
    <div class="chat-type-message-text">
      <div>请选择会话类型</div>
      <div class="mt-4" v-if="false">
        您已退出当前会话，感谢您使用联邦快递微信在线客服，期待下次为您服务！后续您也可以通过点击一下链接轻松提交货件派送、取件、物料等相关需求。感谢您对联邦快递的支持。
        <a href="https://forms.office.com" target="_blank">https://forms.office.com</a>
      </div>
    </div>
    <div class="chat-type-list">
      <div class="chat-type-list-item" :class="{ active: currentIndex === index }" v-for="(item, index) in data"
        :key="item" @click="handleClick(item, index)">
        {{ item.text }}
      </div>
    </div>
    <div class="chat-over-text" :class="{ active: currentIndex !== -1 }">
      已选择会话类型：{{ data[currentIndex]?.text }}，会话将在{{
        CHAT_NEXT_INTERVAL
      }}
      秒内关闭
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-over-text {
  font-size: 12px;
  text-align: center;
  color: #8e8e8e;
  margin: 20px 0;
  opacity: 0;

  &.active {
    opacity: 1;
  }
}

.chat-type-list {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  user-select: none;

  &-item {
    font-size: 14px;
    font-weight: 600;
    padding: 5px 15px;
    color: var(--primary-blue);
    cursor: pointer;

    &:hover {
      color: var(--secondary-purple);
    }

    &.active {
      color: var(--secondary-purple);
    }
  }
}

.chat-type-message {
  margin-top: 20px;

  &-text {
    width: 45%;
    margin: 0 auto;
    font-size: 12px;
    text-align: center;
    color: #8c8c8c;

    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
