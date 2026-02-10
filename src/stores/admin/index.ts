import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    sidebarOpened: true,
  }),
  actions: {
    toggleSidebarOpen() {
      this.sidebarOpened = !this.sidebarOpened;
    },
  },
});
