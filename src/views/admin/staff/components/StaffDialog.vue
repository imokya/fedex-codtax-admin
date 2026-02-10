<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { UserData } from '../index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';

interface Props {
  modelValue: boolean;
  mode?: 'add' | 'edit' | 'view';
  data?: UserData;
  checkedKeys: number[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'add',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: UserData): void;
  (e: 'edit', data: UserData): void;
}>();

const title = computed(() => {
  return '工作人员管理';
});
const onfirmText = computed(() => {
  return props.mode !== 'view' ? '保存' : '确定';
});

const formRef = ref();

const data = ref<UserData>({
  id: 1,
  name: '',
  role: '',
  addTime: '',
  operator: '',
});

const setData = () => {
  data.value = { ...props.data };
};

const rules = ref({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '姓名必须',
    },
  ],
  role: [
    {
      required: true,
      trigger: 'blur',
      message: '角色必须',
    },
  ],
});

watch(
  () => [props.data],
  () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    setData();
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
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        emits('save', data.value as UserData);
      }
    });
  }
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
      <div class="flex gap-6">
        <el-form-item
          label="客服ID"
          prop="description"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="data.id"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
          label-position="top"
          class="flex-1"
        >
          <el-input type="text" placeholder="请输入" v-model="data.name" />
        </el-form-item>
      </div>

      <div class="flex gap-6">
        <el-form-item
          label="角色"
          prop="role"
          label-position="top"
          class="flex-1"
        >
          <el-input type="text" placeholder="请输入" v-model="data.role" />
        </el-form-item>
        <el-form-item
          label="添加时间"
          prop="addTime"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="data.addTime"
            disabled
          />
        </el-form-item>
      </div>
      <div class="flex gap-6">
        <el-form-item
          label="添加人"
          prop="operator"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="data.operator"
            disabled
            class="w-[300px]"
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
        <common-button
          type="primary"
          @click="handleSave"
          class="button-confirm"
          >{{ onfirmText }}</common-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-tree {
  background-color: transparent;
  --el-tree-node-content-height: 35px;
}
</style>
