<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import RoleDialog from './components/RoleDialog.vue';
import { showConfirm, showError, showSuccess } from '@/utils/methods';
import CommonButton from '@/components/base/CommonButton/index.vue';
import RoleService from '@/services/admin/role.service';
import { API_Status } from '@/constants/api';

export interface RoleData {
  id: number | string;
  roleName: string;
  displayName: string;
  channel: string;
  platform: string;
  description: string;
  updateTime: string;
  permissions: string[];
}

const roles = ref<RoleData[]>([]);
const currentData = ref<RoleData>();
const showDialog = ref(false);
const mode = ref<'add' | 'edit' | 'view'>('add');
const checkedKeys = ref<number[]>([]);

const total = ref(0);
const page = ref(1);
const size = ref(10);

const getRoleList = async () => {
  const { data: result } = await RoleService.getRoleList({
    pageNum: page.value,
    pageSize: size.value,
  });
  total.value = result.pageTotal;
  roles.value = result.records;
};

const handleSave = async (data: RoleData) => {
  if (mode.value === 'add') {
    try {
      const { status } = await RoleService.addRole(data);
      if (status == API_Status.SUCCESS) {
        showSuccess('添加成功');
        getRoleList();
      } else {
        // showError('添加失败');
      }
    } catch (error) {
      showError('添加失败');
    } finally {
      showDialog.value = false;
    }
  } else {
    try {
      const { status } = await RoleService.updateRole(data);
      if (status == API_Status.SUCCESS) {
        showSuccess('保存成功');
        getRoleList();
      } else {
        // showError('保存失败');
      }
    } catch (error) {
      showError('保存失败');
    } finally {
      showDialog.value = false;
    }
  }
};

const handleRemove = (row: RoleData) => {
  showConfirm({
    title: '删除渠道',
    description: '请问是否确定要删除该渠道吗？',
    onConfirm: async () => {
      // roles.value = roles.value.filter((item) => item.id !== row.id);
      const { status } = await RoleService.removeRole(row.roleName);
      if (status == API_Status.SUCCESS) {
        showSuccess('删除成功');
        getRoleList();
      } else {
        showError('删除失败');
      }
    },
  });
};

const handleModify = (row: RoleData) => {
  checkedKeys.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  currentData.value = { ...row };
  mode.value = 'edit';
  showDialog.value = true;
};

const handleAdd = () => {
  currentData.value = [];
  checkedKeys.value = [];
  mode.value = 'add';
  showDialog.value = true;
};

const handleView = (row: RoleData) => {
  checkedKeys.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  currentData.value = { ...row };
  mode.value = 'view';
  showDialog.value = true;
};

const handleCurrentChange = (value: number) => {
  page.value = value;
  getRoleList();
};

getRoleList();
</script>

<template>
  <div>
    <el-card>
      <div class="card-header flex justify-between">
        角色列表
        <common-button
          class="button-action"
          type="blue"
          plain
          round
          @click="handleAdd"
        >
          <template #prefix>
            <svg-icon icon="admin-action-plus" />
          </template>
          添加角色
        </common-button>
      </div>
      <el-table
        :data="roles"
        style="width: 100%"
        :cell-style="{ height: '50px' }"
      >
        <el-table-column
          label="角色名称"
          prop="roleName"
          width="200"
        ></el-table-column>
        <el-table-column
          label="角色中文名称"
          prop="displayName"
          width="200"
        ></el-table-column>
        <el-table-column
          label="渠道"
          prop="channel"
          width="150"
        ></el-table-column>
        <el-table-column
          label="平台"
          prop="platform"
          width="100"
        ></el-table-column>
        <el-table-column
          label="角色说明"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作时间" width="200" #default="{ row }">
          {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm') }}
        </el-table-column>
        <el-table-column label="操作" width="300" #default="{ row }">
          <!-- <el-button size="small" @click="handleView(row)">查看</el-button> -->
          <el-button
            size="small"
            @click="handleModify(row)"
            link
            class="table-action-button"
            >修改</el-button
          >
          <el-button
            size="small"
            @click="handleRemove(row)"
            link
            class="table-action-button"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="size"
          :page-sizes="[2, 5, 10, 20]"
          layout="prev, pager, next"
          :page-count="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <role-dialog
      v-model="showDialog"
      @save="handleSave"
      @edit="handleSave"
      :data="currentData"
      :mode="mode"
    />
  </div>
</template>
