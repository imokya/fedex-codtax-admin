<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Popup from '@/components/base/Popup/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import { MAX_REPLY_FOLDER_LENGTH } from '@/constants/chat';

interface Props {
  mode?: 'edit' | 'add';
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  modelValue: '',
});

const emits = defineEmits<{
  (e: 'save', message: string): void;
  (e: 'close'): void;
  (e: 'update:modelValue'): void;
}>();

const message = ref('');
const handleConfirm = () => {
  if (message.value.trim() !== '') {
    emits('save', message.value);
    emits('close');
  }
};

const canSend = computed(() => {
  return message.value.trim() !== '';
});

watch(
  () => props.modelValue,
  () => {
    message.value = props.modelValue;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <popup class="!min-h-[220px]" @close="emits('close')">
    <template #header>
      <div>
        <span>{{ props.mode === 'edit' ? '编辑' : '新建' }}</span
        >文件夹
      </div>
    </template>
    <div class="instant-reply-folder">
      <div class="instant-reply-folder-content">
        <el-input
          resize="none"
          v-model="message"
          style="height: 50px"
          :maxlength="MAX_REPLY_FOLDER_LENGTH"
        />
      </div>
      <div class="instant-reply-folder-footer">
        <common-button
          class="button-cancel"
          @click="emits('close')"
          type="blue"
          link
          >取消</common-button
        >
        <common-button
          type="primary"
          class="button-confirm"
          @click="handleConfirm"
          :disabled="!canSend"
          >确认</common-button
        >
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.instant-reply-folder {
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 30px;
  }

  &-header {
    font-size: 20px;
    color: var(--text-color);
    margin-bottom: 30px;
  }
}
</style>
