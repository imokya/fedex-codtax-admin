import { defineStore } from 'pinia';
import * as Storage from '@/utils/storage';
import { TOKEN, USERINFO } from '@/constants';
import { resetRouter } from '@/routers';
import { wait, clearLoginInfo } from '@/utils/methods';
import { showSuccess } from '@/utils/methods';
import { showLoading, hideLoading, goLogin } from '@/utils/methods';

import { UserInfo } from '@/types/admin';
import StaffService from '@/services/chat/statff.service';
import SocketClient from '@/socket';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: Storage.getItem(TOKEN) || '',
    userInfo: Storage.getItem(USERINFO) as UserInfo,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      Storage.setItem(TOKEN, token);
    },

    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
      Storage.setItem(USERINFO, userInfo);
    },
    async logout() {
      const loading = showLoading('退出登录中...');
      try {
        await StaffService.logout();
        //await StaffService.changeStatus('LOGOUT');
      } catch {}
      console.log('logout');
      SocketClient.destroy();
      clearLoginInfo();
      await wait();
      hideLoading(loading);
      showSuccess('退出登录成功');
      goLogin();
    },
  },
  getters: {
    hasUserInfo(state) {
      return state.userInfo !== null;
    },
    showPlatformMenu(state) {
      const permissionMenu = state?.userInfo?.permission?.menus;
      if (permissionMenu) {
        return permissionMenu.includes('chat') && permissionMenu.length > 1;
      }
      return false;
    },
  },
});
