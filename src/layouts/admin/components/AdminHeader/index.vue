<script lang="ts" setup>
import { useUserStore } from '@/stores/admin/user';
import { showConfirm } from '@/utils/methods';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  showConfirm({
    title: '退出登录',
    description: '请问确定要退出登录吗？',
    onConfirm: () => {
      userStore.logout();
    },
  });
};

const handleSwitchPlatform = () => {
  router.push('/platform/login');
};
</script>

<template>
  <div class="admin-header">
    <div class="admin-header-wrap">
      <div class="admin-header-logo">
        <svg-icon icon="login-logo" />
      </div>
      <div class="admin-header-user">
        {{ userStore.userInfo.id }} <svg-icon icon="admin-header-user" />
        <div class="admin-header-user-active">
          {{ userStore.userInfo.id }}
          <svg-icon icon="admin-header-user-active" />

          <div class="admin-header-user-dropdown">
            <div
              class="admin-header-user-dropdown-item"
              @click="handleSwitchPlatform"
              v-if="userStore.showPlatformMenu"
            >
              切换平台
            </div>
            <div class="admin-header-user-dropdown-item" @click="handleLogout">
              退出登录
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-header {
  position: fixed;
  width: 100%;
  height: var(--admin-header-height);
  background-color: var(--primary-purple);
  z-index: 10;

  &-user {
    width: 170px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
    gap: 10px;
    cursor: pointer;
    position: relative;

    &-dropdown {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 100%;

      &-item {
        background-color: #fff;
        color: var(--primary-blue);
        font-size: 14px;
        font-weight: 600;
        padding: 20px 15px;
        padding-left: 35px;
        &:hover {
          color: var(--primary-blue-hover);
          background-color: #f2f2f2;
        }
      }
    }

    &:hover {
      .admin-header-user-active {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
    }

    &-active {
      width: 100%;
      height: 100%;
      background-color: #fff;
      position: absolute;
      color: var(--primary-purple);
      top: 0;
      left: 0;
      display: none;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &-wrap {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 150px;
  }

  &-logo {
    width: var(--sidebar-width);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    svg {
      width: 82px;
      height: 23px;
    }
  }
}
</style>
