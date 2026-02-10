<script setup lang="ts">
import { ref } from 'vue';
import LoginHeader from '@/components/login/LoginHeader.vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/admin/user';
import UserService from '@/services/admin/user.service';
import { goLogin, showError, showSuccess } from '@/utils/methods';
import { PERMISSION_MENU } from '@/constants';
import { UserInfo } from '@/types/admin';

const route = useRoute();
const router = useRouter();
const showMenu = ref(true);
const userStore = useUserStore();

const code = (route.query.code as string) || '';

const checkPermissions = (permissions: string[]) => {
  if (permissions.includes('chat') && permissions.length > 1) {
    showMenu.value = true;
  } else if (permissions.includes('chat')) {
    router.push('/chat');
  } else {
    router.push('/admin');
  }
};

const sortPermissionList = (menu: string[]) => {
  const sortedMenu: string[] = [];
  PERMISSION_MENU.forEach((menuItem: any) => {
    if (menu.indexOf(menuItem.name) !== -1) {
      sortedMenu.push(menuItem.name);
    }
  });
  return sortedMenu;
};

const auth = async () => {
  const token = userStore?.token;

  if (token) {
    checkPermissions(userStore?.userInfo?.permission?.menus);
    return;
  }
  if (code) {
    const { data: result } = await UserService.auth(code);
    const permissionList = result?.permissionList;
    const permissions: string[] = permissionList || [];
    const token = result?.token || '';

    if (permissions.length > 0) {
      const userInfo = {
        id: result.employeeId,
        name: `${result.employeeId}`,
        channel: result.channel,
        permission: {
          menus: sortPermissionList(permissions),
        },
      } as UserInfo;
      userStore.setToken(token);
      userStore.setUserInfo(userInfo);
      checkPermissions(permissions);
      showSuccess('登陆成功');
    } else {
      showError('无访问权限');
      goLogin();
    }
  } else {
    showError('无访问权限');
    goLogin();
  }
};

auth();
</script>

<template>
  <div class="page auth" v-if="showMenu">
    <login-header />
    <div class="portal">
      <div class="portal-header">
        <svg-icon icon="login-select" />选择登陆平台
      </div>
      <div class="portal-list">
        <div class="portal-list-item" @click="
          () => {
            router.push('/chat');
          }
        ">
          <div class="portal-list-item-label">客服聊天平台</div>
          <div class="portal-list-item-icon">
            <svg-icon icon="login-select" />
          </div>
        </div>
        <div class="portal-list-item" @click="
          () => {
            router.push('/admin');
          }
        ">
          <div class="portal-list-item-label">管理后台</div>
          <div class="portal-list-item-icon">
            <svg-icon icon="login-select" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.portal {
  width: 500px;
  height: 200px;
  margin-top: 22vh;

  &-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;

    &-item {
      background-color: #fafafa;
      font-size: 20px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      &:hover {
        background-color: #faf7fb;
      }

      svg {
        width: 24px;
        height: 24px;
        transform: rotate(180deg);
      }
    }
  }

  &-header {
    font-size: 28px;
    display: flex;
    align-items: center;
    gap: 2px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
