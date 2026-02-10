<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  console.log('uploadfile', uploadFile);
};
</script>

<template>
  <div class="staff-empty flex justify-center items-center">
    <el-upload
      :on-change="handleChange"
      :auto-upload="false"
      :show-file-list="false"
      accept=".xlsx, .xls"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <svg-icon icon="admin-folder" style="width: 56px; height: 48px" />
        <div class="text-[#606266] text-[14px]">导入客服人员Excel</div>
        <el-button type="primary" :icon="Plus">上传文件</el-button>
      </div>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.staff-empty {
  height: 400px;
  background-color: #fbfbfb;
  border-radius: 12px;
}
</style>
