<script setup lang="ts">
import LoginHeader from '@/components/login/LoginHeader.vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/admin/user';
import UserService from '@/services/admin/user.service';
import { goLogin, showError, showSuccess } from '@/utils/methods';
import { UserInfo } from '@/types/admin';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const code = (route.query.code as string) || '';

const auth = async () => {
  const token = userStore?.token;
  if (token) {
    router.push('/admin');
    return;
  }
  if (code) {
    try {
      const { data: result } = await UserService.auth(code);
      const userInfo = {
        id: result.employeeId,
        name: `${result.employeeId}`,
        channel: result.channel,
        permission: {
          menus: ['surveyManage', 'uploadManage']
        },
      } as UserInfo;
      const token = result?.token || '';
      userStore.setToken(token);
      userStore.setUserInfo(userInfo);
      router.push('/admin')
      showSuccess('登陆成功');
    } catch (error) {
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
  <div class="page auth">
    <login-header />
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
