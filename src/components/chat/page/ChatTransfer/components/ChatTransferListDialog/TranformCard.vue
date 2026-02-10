<script setup lang="ts">
import { StaffStatus } from '@/types/chat';
interface Props {
  data: {
    employeeId: string;
    status?: StaffStatus;
  };
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
});
</script>

<template>
  <div class="transform-card" :class="{ active: props.active }">
    <div class="transform-card-icon">
      <!-- <svg-icon icon="chat-service" /> -->
    </div>
    <div class="transform-card-name">工号{{ props.data.employeeId }}</div>
    <div class="transform-card-right">
      <div class="transform-card-right-icon">
        <svg-icon
          icon="status-busy"
          v-if="props.data.status === StaffStatus.BUSY"
        />
        <svg-icon
          icon="status-free"
          v-if="props.data.status === StaffStatus.ONLINE"
        />
      </div>
      <div class="transform-card-right-label">
        <span v-if="props.data.status === StaffStatus.BUSY">忙碌</span>
        <span v-if="props.data.status === StaffStatus.ONLINE">在线</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';

.transform-card {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: -20px;

  padding: 5px 15px;
  cursor: pointer;

  &.active {
    .transform-card-icon {
      &::after {
        display: block;
      }
    }
  }

  &-right {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    &-label {
      font-size: 12px;
    }
    &-icon {
      width: 20px;
    }
    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-name {
    font-size: 16px;
    color: var(--text-color);
    flex: 1;
    max-width: 300px;
    @include mixins.ellipsis;
  }

  &-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      position: absolute;
      border-radius: 50%;
      border: 2px solid var(--primary-blue);
    }
    &::after {
      content: '';
      width: 12px;
      height: 12px;
      position: absolute;
      border-radius: 50%;
      background-color: var(--primary-blue);
      display: none;
    }
    svg {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
