import { defineStore } from 'pinia';
import { StaffStatus } from '@/types/chat';
import * as Storage from '@/utils/storage';
import { STAFF_STATUS } from '@/constants/chat';

export const useStaffStore = defineStore('staffStore', {
  state: () => ({
    status: Storage.getItem(STAFF_STATUS) ?? StaffStatus.OFFLINE,
  }),
  actions: {
    setStatus(status: StaffStatus) {
      this.status = status;
      Storage.setItem(STAFF_STATUS, status);
    },
  },
});
