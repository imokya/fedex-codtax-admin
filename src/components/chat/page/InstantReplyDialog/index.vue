<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Popup from '@/components/base/Popup/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import { MAX_REPLY_LENGTH } from '@/constants/chat';

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
  <popup @close="emits('close')">
    <template #header>
      <div class="instant-reply-header">
        <span>{{ props.mode === 'edit' ? '编辑' : '添加' }}</span
        >快捷回复
      </div>
    </template>
    <div class="instant-reply">
      <div class="instant-reply-add-content">
        <el-input
          resize="none"
          type="textarea"
          v-model="message"
          input-style="height:190px;padding: 15px;"
          placeholder="请输入快捷回复内容"
          :maxlength="MAX_REPLY_LENGTH"
        />
        <div class="instant-reply-tip">*最大{{ MAX_REPLY_LENGTH }}符数限制</div>
      </div>
      <div class="instant-reply-footer">
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
.instant-reply {
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
  }

  &-tip {
    font-size: 12px;
    color: #999;
    margin-top: 10px;
    text-align: right;
  }

  &-header {
    font-size: 20px;
    color: var(--text-color);
    margin-bottom: 20px;
  }
}
</style>
