import { MAX_PICKUP_TRANSFER_TIME, PickupStatus } from '@/constants/chat';
import * as Storage from '@/utils/storage';
import { defineStore } from 'pinia';
import { TransferRequest } from '@/types/chat';

export const useTransferStore = defineStore('transferStore', {
  state: () => ({
    waitPickupTime: Number(Storage.getItem('waitPickupTime')) || 0,
    pickupStatus: Number(Storage.getItem('pickupStatus')),
    pickupCollapsed: !!Storage.getItem('pickupCollapsed'),
    transferRequestData: Storage.getItem(
      'transferRequestData'
    ) as TransferRequest,
  }),
  actions: {
    initPickup() {
      this.checkPicupTime();
      if (this.pickupStatus === PickupStatus.WAITING) {
        this.collpasePickup(true);
      }
    },

    waitToPickup() {
      this.waitPickupTime = +new Date();
      this.pickupStatus = PickupStatus.WAITING;
      this.pickupCollapsed = false;
      Storage.setItem('pickupStatus', this.pickupStatus);
      Storage.setItem('waitPickupTime', this.waitPickupTime);
      Storage.setItem('pickupCollapsed', this.pickupCollapsed);
    },

    declineToPickup() {
      this.pickupStatus = PickupStatus.DECLINED;
      this.waitPickupTime = 0;
      this.pickupCollapsed = false;
      Storage.setItem('pickupStatus', this.pickupStatus);
      Storage.setItem('waitPickupTime', this.waitPickupTime);
      Storage.setItem('pickupCollapsed', this.pickupCollapsed);
    },

    acceptToPickup() {
      this.pickupStatus = PickupStatus.ACCEPTED;
      this.waitPickupTime = 0;
      this.pickupCollapsed = false;
      Storage.setItem('pickupStatus', this.pickupStatus);
      Storage.setItem('waitPickupTime', this.waitPickupTime);
    },

    setTransferRequestData(payload: TransferRequest) {
      this.transferRequestData = payload;
      Storage.setItem('transferRequestData', payload);
    },

    collpasePickup(payload: boolean) {
      this.pickupCollapsed = payload;
      Storage.setItem('pickupCollapsed', payload);
    },

    checkPicupTime() {
      const now = +new Date();
      // console.log('update', now - this.waitPickupTime);
      if (
        now - this.waitPickupTime > MAX_PICKUP_TRANSFER_TIME * 1000 &&
        this.pickupStatus === PickupStatus.WAITING
      ) {
        this.waitPickupTime = 0;
        this.pickupStatus = PickupStatus.DECLINED;
        Storage.setItem('waitPickupTime', 0);
        Storage.setItem('pickupStatus', this.pickupStatus);
      }
      if (this.pickupStatus === PickupStatus.WAITING) {
        setTimeout(this.checkPicupTime, 1000);
      }
    },
  },
  getters: {
    confirmText(state) {
      return `<div class="transfer-message">收到来自客服 ${state.transferRequestData?.employeeId} 的转接请求，<br />请在1分钟内选择是否接受超时将视为拒绝</div>`;
    },
  },
});
