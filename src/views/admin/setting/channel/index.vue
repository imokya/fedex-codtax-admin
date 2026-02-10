<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import ChannelDialog from './components/ChannelDialog.vue';
import { showConfirm, showSuccess } from '@/utils/methods';
import CommonButton from '@/components/base/CommonButton/index.vue';
import ChannelService from '@/services/admin/channel.service';

export interface ChannelData {
  name: string;
  description?: string;
}

const channels = ref<ChannelData[]>([]);
const currentData = ref<ChannelData>({ name: '', description: '' });
const showDialog = ref(false);
const mode = ref<'add' | 'edit'>('add');

const handleSave = async (data: ChannelData) => {
  if (mode.value === 'add') {
    channels.value = [...channels.value, data];
    showDialog.value = false;
  } else {
    await ChannelService.saveChannel(data);
    getList();
    showDialog.value = false;
    showSuccess('保存成功');
  }
};

const handleRemove = (row: ChannelData) => {
  showConfirm({
    title: '删除渠道',
    description: '请问是否确定要删除该渠道吗？',
    onConfirm: () => {
      channels.value = channels.value.filter((item) => item.id !== row.id);
      showSuccess('删除成功');
    },
  });
};

const handleAdd = () => {
  currentData.value.name = '';
  currentData.value.description = '';
  mode.value = 'add';
  showDialog.value = true;
};

const handleModify = (row: ChannelData) => {
  currentData.value = { ...row };
  mode.value = 'edit';
  showDialog.value = true;
};

const getList = async () => {
  const { data: result } = await ChannelService.getList();
  channels.value = result?.channels;
};

getList();
</script>

<template>
  <div>
    <el-card>
      <div class="card-header flex justify-between">
        渠道列表
        <!-- <common-button
          class="button-action"
          type="blue"
          plain
          round
          @click="handleAdd"
        >
          <template #prefix>
            <svg-icon icon="admin-action-plus" />
          </template>
          添加渠道
        </common-button> -->
      </div>
      <el-table
        :data="channels"
        style="width: 100%"
        :cell-style="{ height: '50px' }"
      >
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="操作" width="300" #default="{ row }">
          <el-button
            size="small"
            @click="handleModify(row)"
            class="table-action-button"
            link
            >修改</el-button
          >
          <!-- <el-button
            size="small"
            @click="handleRemove(row)"
            class="table-action-button"
            link
            >删除</el-button
          > -->
        </el-table-column>
      </el-table>
    </el-card>
    <channel-dialog
      v-model="showDialog"
      @save="handleSave"
      @edit="handleSave"
      :data="currentData"
      :mode="mode"
    />
  </div>
</template>
