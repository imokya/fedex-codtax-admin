<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ChannelData } from '../index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';

interface Props {
  modelValue: boolean;
  mode?: 'add' | 'edit';
  data: ChannelData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'add',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: ChannelData): void;
  (e: 'edit', data: ChannelData): void;
}>();

const title = computed(() => {
  return props.mode === 'add' ? '添加渠道' : '编辑渠道';
});

const data = ref<ChannelData>({
  name: '',
  description: '',
});

const rules = ref({
  // name: [
  //   {
  //     required: true,
  //     trigger: 'blur',
  //     message: '渠道名称必须',
  //   },
  // ],
});

const formRef = ref();

watch(
  () => [props.data],
  () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }

    data.value = { ...props.data };
  },
  {
    immediate: true,
    deep: true,
  }
);

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleSave = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (props.mode === 'add') {
        emits('save', data.value as ChannelData);
      } else {
        emits('edit', data.value as ChannelData);
      }
    }
  });
};
</script>

<template>
  <el-dialog
    :title="title"
    :model-value="props.modelValue"
    @close="handleClose"
    class="w-[650px]"
  >
    <el-form :model="data" :rules="rules" ref="formRef">
      <div class="flex flex-col">
        <!-- <el-form-item
          label="渠道名称"
          prop="name"
          label-position="top"
          class="w-full"
        >
          <el-input type="text" placeholder="请输入" v-model="data.name" />
        </el-form-item> -->
        <el-form-item
          label="渠道说明"
          prop="description"
          label-position="top"
          class="w-full"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入"
            v-model="data.description"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer flex items-center justify-end">
        <common-button
          type="blue"
          link
          @click="handleClose"
          class="button-cancel"
          >取消</common-button
        >
        <common-button type="primary" @click="handleSave" class="button-confirm"
          >保存</common-button
        >
      </span>
    </template>
  </el-dialog>
</template>
