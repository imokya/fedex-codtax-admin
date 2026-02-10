<script setup lang="ts">
import CommonButton from '@/components/base/CommonButton/index.vue';
import ServiceStatus from '@/components/chat/page/ServiceStatus/index.vue';
import StaffService from '@/services/chat/statff.service';

import { showConfirm } from '@/utils/methods';
import { useUserStore } from '@/stores/admin/user';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import { API_Status } from '@/constants/api';

const userStore = useUserStore();
const chatStore = useChatStore();
const router = useRouter();

const handleLogout = () => {
  if (chatStore.hasUnTagChat || chatStore.hasUndoneChat) {
    showConfirm({
      title: '退出登录',
      description: '有未完成的对话或对话类型，请完成后再退出',
    });
    return;
  }

  showConfirm({
    title: '退出登录',
    description: '请问是否要退出登录？',
    onConfirm: () => {
      userStore.logout();
    },
  });
};

const handleSwitchPlatform = async () => {
  try {
    const { status, message } = await StaffService.switch();
    if (status === API_Status.FAILED) {
      if (message === 'UNFINISHED_SESSION') {
        showConfirm({
          title: '退出登录',
          description: '有未完成的对话或对话类型，请完成后再退出',
        });
        return;
      }
    } else {
      router.push('/platform/login');
    }
  } catch (error) { }
};
</script>

<template>
  <div class="header">
    <div class="header-info">
      <div class="header-info__left">
        <div class="header-info__avatar">
          <svg-icon icon="chat-user"></svg-icon>
        </div>
      </div>
      <div class="header-info__right">
        <div class="header-info__name">{{ userStore.userInfo.name }}</div>
        <div class="header-info__status">
          <service-status></service-status>
        </div>
      </div>
    </div>
    <div class="header-action flex">
      <common-button @click="handleSwitchPlatform" class="switch-button" link type="blue"
        v-if="userStore.showPlatformMenu">
        切换平台
      </common-button>
      <common-button @click="handleLogout" class="exit-button" link type="blue">
        退出
      </common-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';

.exit-button {
  font-size: 14px;
  padding: 5px 12px 5px 0;
  font-weight: 600;
}

.switch-button {
  font-size: 14px;
  padding: 5px 0;
  font-weight: 600;
}

.header {
  display: flex;
  align-items: center;
  padding: 15px 12px;
  box-sizing: border-box;

  &-action {
    margin-left: auto;
  }

  &-info {
    display: flex;
    font-size: 14px;
    color: #333333;

    &__name {
      max-width: 150px;
      @include mixins.ellipsis;
    }

    &__right {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2px 0;
    }

    &__avatar {
      width: 50px;
      height: 50px;

      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
