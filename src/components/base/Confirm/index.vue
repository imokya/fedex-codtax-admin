<script setup lang="ts">
import CommonButton from '@/components/base/CommonButton/index.vue';
import Popup from '@/components/base/Popup/index.vue';

interface Props {
  confirmText?: string;
  cancelText?: string;
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  confirmText: '确认',
  cancelText: '取消',
});

const emits = defineEmits(['confirm', 'cancel', 'close']);

const handleCancel = () => {
  emits('cancel');
};

const handleConfirm = () => {
  emits('confirm');
};
</script>

<template>
  <popup @close="emits('close')" class="min-h-[350px]">
    <div class="confirm-panel text-center">
      <div class="confirm-title">
        {{ props.title }}
      </div>
      <div class="confirm-description" v-html="props.description"></div>
      <div class="confirm-footer">
        <div>
          <common-button
            @click="handleConfirm"
            type="primary"
            inline
            class="button-confirm"
            >{{ props.confirmText }}</common-button
          >
        </div>
        <div>
          <common-button
            type="blue"
            @click="handleCancel"
            link
            inline
            class="button-cancel mt-[10px]"
            >{{ props.cancelText }}</common-button
          >
        </div>
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.confirm-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.confirm {
  &-footer {
    margin-top: 30px;
  }

  &-title {
    font-size: 20px;
    color: var(--text-color);
    margin-top: 30px;
  }

  &-description {
    font-size: 14px;
    color: var(--text-color);
    margin-top: 30px;
    line-height: 2;
  }
}
</style>
