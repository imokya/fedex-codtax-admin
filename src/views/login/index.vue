<script setup lang="ts">
import { ref } from 'vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import LoginHeader from '@/components/login/LoginHeader.vue';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/admin/user';
import UserService from '@/services/admin/user.service';
import { showError, clearLoginInfo } from '@/utils/methods';

const router = useRouter();
const userStore = useUserStore();
const showLoading = ref(false);
const employeeId = ref('');

const handleLogin = async () => {
  showLoading.value = true;
  try {
    const { data: result } = await UserService.login(employeeId.value);
    router.replace(`/platform/login?code=${result.code}`);
    // userStore.setToken(token);
    // userStore.setUserInfo(userInfo);
    // showSuccess('登录成功');
    // await wait();
    // router.push('/');
  } catch (error) {
    showError('登录失败');
  } finally {
    showLoading.value = false;
  }
};

clearLoginInfo();
</script>

<template>
  <div class="page login">
    <login-header />
    <div class="login-auth">
      <div class="login-auth-title">到付税金管理平台</div>
      <div class="login-auth-info">
        <div class="login-auth-info-label">
          <svg-icon icon="login-user" />通过FedEx登录
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <el-input placeholder="请输入客服ID" v-model="employeeId" style="height: 40px" maxlength="15" />
          </div>
          <div class="login-auth-info-button">
            <common-button type="primary" class="button-auth" @click="handleLogin"
              :loading="showLoading">授权登录</common-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-auth {
  font-weight: 600;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-auth {
    margin-top: 15vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-info {
      width: 520px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fafafa;
      padding: 40px 30px;
      margin-top: 30px;

      &-button {
        display: flex;
        align-items: center;
      }

      &-label {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 20px;

        svg {
          width: 28px;
          height: 28px;
        }
      }
    }

    &-title {
      font-size: 28px;
      font-weight: 300;
      color: var(--text-color);
    }
  }
}
</style>
