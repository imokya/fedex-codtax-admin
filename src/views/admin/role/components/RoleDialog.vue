<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { RoleData } from '../index.vue';
import { PERMISSION_MENU } from '@/constants';
import RoleService from '@/services/admin/role.service';
import CommonButton from '@/components/base/CommonButton/index.vue';
import { useUserStore } from '@/stores/admin/user';

interface Props {
  modelValue: boolean;
  mode?: 'add' | 'edit' | 'view';
  data?: RoleData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'add',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: RoleData): void;
  (e: 'edit', data: RoleData): void;
}>();

const userStore = useUserStore();
const title = computed(() => {
  return props.mode === 'add' ? '添加角色及权限' : '编辑角色及权限';
});
const onfirmText = computed(() => {
  return props.mode !== 'view' ? '保存' : '确定';
});

const data = ref<RoleData | undefined>();
const treeProps = {
  children: 'children',
  label: 'nameDisplay',
};

const treeRef = ref();
const channelOptions = [
  {
    value: 'IXP',
    label: 'IXP',
  },
  {
    value: 'DXP',
    label: 'DXP',
  },
];

const platformOptions = [
  {
    value: 'chat',
    label: '微聊',
  },
  {
    value: 'admin',
    label: '微聊后台',
  },
];

const rules = ref({
  roleName: {
    required: true,
    // pattern: /^(I|D)XP-\S+$/,
    pattern: /^[A-Z]+(?:-[A-Z]+)*$/,
    trigger: 'blur',
    message: '角色名称格式错误',
  },
  // name: {
  //   required: true,
  //   trigger: 'blur',
  //   message: '名称必须',
  // },
  // channel: {
  //   required: true,
  //   trigger: 'blur',
  //   message: '渠道必须',
  // },
  // platform: {
  //   required: true,
  //   trigger: 'blur',
  //   message: '平台必须',
  // },
});

const formRef = ref();
const permissions = ref([]);
const channel = computed(() => {
  const name = data.value!.roleName;
  return name?.split('-')[0];
});

const setData = () => {
  data.value = { ...props.data } as RoleData;
};

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
  treeRef.value.setCheckedKeys([]);
};

const handleSave = () => {
  if (formRef.value) {
    data.value!.permissions = treeRef.value.getCheckedKeys();
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        if (props.mode === 'add') {
          emits('save', data.value as RoleData);
        } else if (props.mode === 'edit') {
          emits('edit', data.value as RoleData);
        } else {
          handleClose();
        }
      }
    });
  }
};

const handleOpen = () => {
  if (props.data?.permissions) {
    treeRef.value.setCheckedKeys(props.data.permissions);
  }
};

const getPermission = async () => {
  console.log('getpermission', channel.value);
  const { data: result } = await RoleService.getPermission(channel.value);
  permissions.value = result.permissionList;
};

watch(channel, () => {
  if (props.mode === 'edit') {
    getPermission();
  }
});
</script>

<template>
  <el-dialog
    :title="title"
    :model-value="props.modelValue"
    @close="handleClose"
    @open="handleOpen"
    class="w-[650px]"
  >
    <el-form :model="data" :rules="rules" ref="formRef">
      <div class="flex gap-6">
        <el-form-item
          label="角色名称"
          prop="roleName"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="data!.roleName"
            :disabled="props.mode === 'edit'"
          />
        </el-form-item>

        <el-form-item
          label="角色中文名称"
          prop="displayName"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="data!.displayName"
          />
        </el-form-item>
      </div>
      <div class="flex gap-6">
        <el-form-item
          label="渠道"
          prop="channel"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="text"
            placeholder="请输入"
            :value="channel"
            disabled
          />
          <!-- <el-select v-model="data!.channel">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item
          label="平台"
          prop="platform"
          label-position="top"
          class="flex-1"
        >
          <el-input type="text" placeholder="请输入" v-model="data!.platform" />
          <!-- <el-select v-model="data!.platform" style="width: 300px">
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
      </div>
      <div class="flex gap-6">
        <el-form-item
          label="角色说明"
          prop="description"
          label-position="top"
          class="flex-1"
        >
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="data!.description"
          />
        </el-form-item>
      </div>
    </el-form>

    <div class="permission-list">
      <div class="text-[14px] text-[#595959]">权限设定</div>
      <div class="mt-4 bg-[#f8f8f8] p-4 rounded-[8px]">
        <el-scrollbar style="height: 150px">
          <el-tree
            ref="treeRef"
            :data="permissions"
            :props="treeProps"
            node-key="name"
            show-checkbox
            check-on-click-node
            check-strictly
          >
          </el-tree>
        </el-scrollbar>
      </div>
    </div>

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
