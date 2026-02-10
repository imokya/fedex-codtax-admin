<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { StaffStatus } from '@/types/chat';
import { showConfirm, showAlert } from '@/utils/methods';
import StaffService from '@/services/chat/statff.service';
import { useStaffStore } from '@/stores/chat/staff';
import { useChatStore } from '@/stores/chat';

declare const document: any;

const data = ref([
  {
    text: '在线',
    icon: 'status-free',
    status: StaffStatus.ONLINE,
    confirm: {
      title: '切换至在线状态',
      description: '在线模式下，将接入客户<br/>确认要切换成在线状态吗？',
    },
  },
  {
    text: '忙碌',
    icon: 'status-busy',
    status: StaffStatus.BUSY,
    confirm: {
      title: '切换至忙碌状态',
      description: '忙碌模式下，将停止接入客户<br/>确认要切换成忙碌状态吗？',
    },
  },
  {
    text: '离线',
    icon: 'status-offline',
    status: StaffStatus.OFFLINE,
    confirm: {
      title: '切换至离线状态',
      description: '离线模式下，将停止接入客户<br/>确认要切换成离线状态吗？',
    },
  },
]);

const chatStore = useChatStore();
const showList = ref(false);
const listRef = ref(null);
const staffStore = useStaffStore();
const currentStatus = computed(() => {
  return staffStore.status === StaffStatus.LOGOUT
    ? StaffStatus.OFFLINE
    : staffStore.status;
});

const activeData = computed(() => {
  return data.value.find((item) => item.status === currentStatus.value);
});

const handleShowList = () => {
  showList.value = !showList.value;
};

const handleSelect = (item: any) => {
  if (item.status === staffStore.status) return;
  showList.value = false;
  if (item.status === StaffStatus.OFFLINE) {
    if (chatStore.hasUndoneChat) {
      showConfirm({
        title: '切换为离线',
        description: '有未完成的对话，请完成后再离线',
      });
      return;
    }
  }
  staffStore.setStatus(item.status);
  changeStatus();
};

const onPointerDown = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (target === document) {
    showList.value = false;
  }
};

const changeStatus = async () => {
  StaffService.changeStatus(StaffStatus[currentStatus.value]);
};

onMounted(() => {
  document.addEventListener('click', onPointerDown);
  // changeStatus();
});

onUnmounted(() => {
  document.removeEventListener('click', onPointerDown);
});
</script>

<template>
  <div class="status" ref="listRef" @click.stop="handleShowList">
    <div class="status-info">
      <div class="status-info__icon">
        <svg-icon :icon="activeData?.icon"></svg-icon>
      </div>
      <div class="status-info__text">{{ activeData?.text }}</div>
    </div>
    <div class="status__arrow">
      <svg-icon icon="status-arrow"></svg-icon>
    </div>
    <div class="status-list" v-if="showList">
      <div
        class="status-list-item"
        :class="{ active: item.status === staffStore.status }"
        v-for="item in data"
        :key="item.status"
        @click.stop="handleSelect(item)"
      >
        <div class="status-list-item__icon">
          <svg-icon :icon="item.icon"></svg-icon>
        </div>
        <div class="status-list-item__text">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-list {
  width: 115px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.05);

  position: absolute;
  z-index: 2;
  top: 30px;
  user-select: none;

  &-item {
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;

    gap: 5px;
    font-size: 12px;
    color: #595959;
    padding: 0 20px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;

    &.active {
      font-weight: 600;
      color: #333333;
    }

    &__icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:hover {
      background-color: #f2f2f2;
      border-top: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
    }
    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.status {
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
  user-select: none;

  &__arrow {
    transform: rotate(90deg);
    svg {
      width: 11px;
      height: 11px;
    }
  }

  &-info {
    display: flex;
    font-size: 12px;
    color: #595959;
    align-items: center;
    box-sizing: border-box;
    gap: 5px;
    &__icon {
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
