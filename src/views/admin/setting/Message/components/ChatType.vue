<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { InputInstance } from 'element-plus';
import CommonButton from '@/components/base/CommonButton/index.vue';
import TypeCard from './TypeCard.vue';
import { showAlert, showSuccess } from '@/utils/methods';
import { v4 as uuid } from 'uuid';

const inputVisible = ref(false);
const inputValue = ref('');
const chatTypes = ref([
  {
    id: '1',
    text: '会话类型1',
  },
  {
    id: '2',
    text: '会话类型2',
  },
  {
    id: '3',
    text: '会话类型3',
  },
  {
    id: '4',
    text: '会话类型4',
  },
]);

const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);

const InputRef = ref<InputInstance>();

const handleRemoveType = (tag: any) => {
  showAlert({
    title: '删除会话类型',
    description: '确定要删除该会话类型吗？',
    onConfirm: () => {
      const newData = props.modelValue.filter((item: any) => item !== tag);
      emits('update:modelValue', newData);
      showSuccess('删除成功');
    },
  });
};
const handleSaveType = (text: string, tag: any) => {
  const newData = props.modelValue.map((item: any) => {
    if (item === tag) {
      return text;
    }
    return item;
  });
  emits('update:modelValue', newData);
  showSuccess('更新会话类型成功');
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value.trim() !== '') {
    const newData = [...props.modelValue, inputValue.value];
    emits('update:modelValue', newData);
    showSuccess('添加会话类型成功');
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>

<template>
  <div class="group w-[70%]">
    <div class="group-title">会话类型</div>
    <div class="group-content flex gap-4 w-full justify-between relative">
      <div class="flex gap-5 flex-wrap w-[70%]">
        <type-card
          v-for="tag in props.modelValue"
          :text="tag"
          :key="tag"
          @remove="handleRemoveType(tag)"
          @save="handleSaveType($event, tag)"
        ></type-card>
        <!-- <el-tag
          v-for="tag in chatTypes"
          :key="tag"
          closable
          :disable-transitions="false"
          effect="plain"
          size="large"
          @close="handleRemoveType"
        >
          {{ tag }}
        </el-tag> -->
      </div>
      <div class="h-[50px]">
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="w-[200px] absolute right-0"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <common-button
          type="blue"
          plain
          round
          class="button-action !py-[5px]"
          @click="showInput"
          v-else
        >
          <template #prefix>
            <svg-icon icon="chat-add" class="svg-add" />
          </template>
          添加
        </common-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group {
  margin-bottom: 20px;
  &-title {
    font-size: 12px;
    margin-bottom: 5px;
  }
}
</style>
