<script setup lang="ts">
import CommonButton from '@/components/base/CommonButton/index.vue';
import Popup from '@/components/base/Popup/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

interface Props {
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
});

const emits = defineEmits(['confirm', 'close']);

const handleConfirm = () => {
  emits('confirm');
};

const handleClose = () => {
  emits('close');
};
</script>

<template>
  <popup @close="handleClose">
    <div
      class="alert-panel flex flex-col justify-center items-center text-center"
    >
      <div class="alert-icon">
        <svg-icon
          icon="chat-alert"
          style="width: 32px; height: 32px"
        ></svg-icon>
      </div>
      <div class="alert-title">
        {{ props.title }}
      </div>
      <div class="alert-description" v-html="props.description"></div>
      <div class="alert-footer">
        <common-button
          @click="handleConfirm"
          type="primary"
          class="button-confirm"
        >
          确认</common-button
        >
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.alert {
  &-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }

  &-title {
    font-size: 20px;
    color: var(--text-color);
    margin-top: 20px;
  }

  &-description {
    font-size: 14px;
    color: var(--text-color);
    margin-top: 20px;
  }
}
</style>
