<script setup lang="ts">
import { nextTick, ref } from 'vue';
interface Props {
  text: string;
}

const emits = defineEmits<{
  (e: 'remove', data?: any): void;
  (e: 'save', data?: any): void;
}>();

const props = defineProps<Props>();
const text = ref('');
const showEdit = ref(false);
const inputRef = ref();

const handleRemove = () => {
  emits('remove');
};

const handleBlur = () => {
  if (text.value.trim() !== '') {
    emits('save', text.value);
  }
  showEdit.value = false;
};

const handleKeydown = (e: any) => {
  if (e.code === 'Enter') {
    handleBlur();
  }
};

const handleClick = () => {
  showEdit.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};
</script>

<template>
  <div class="type-card" :title="props.text">
    <div class="type-card-wrap" v-show="!showEdit">
      <div class="type-card-inner" @click="handleClick">
        <div class="type-card-text">{{ props.text }}</div>
      </div>
      <div class="type-card-icon" @click.stop="handleRemove">
        <svg-icon icon="chat-remove" />
      </div>
    </div>
    <div class="type-card-input" v-show="showEdit">
      <el-input
        type="text"
        class="input"
        v-model="text"
        ref="inputRef"
        :value="props.text"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';
.input {
  --el-input-inner-height: 30px;
  --el-component-size: 30px;
  height: 30px;
  width: 160px;
  :deep(.el-input__wrapper) {
    -el-input-inner-height: 30px;
    --el-component-size: 30px;
    height: 30px;
  }
}
.type-card {
  height: 30px;
  width: 160px;
  font-size: 14px;
  &-text {
    @include mixins.ellipsis;
  }

  &-wrap {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &-inner {
    width: 140px;
    border: 1px solid #8e8e8e;
    padding: 5px 15px;
    flex-shrink: 0;
    box-sizing: border-box;
    white-space: nowrap;
  }
  &-icon {
    width: 15px;
    cursor: pointer;
    svg {
      width: 15px;
      height: 15px;
    }
  }
}
</style>
