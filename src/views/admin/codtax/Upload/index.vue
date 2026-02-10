<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { showSuccess, showError } from '@/utils/methods'
import type { UploadProps, UploadFile } from 'element-plus'
import { ElLoading } from 'element-plus';


const loadingRef = ref()
let loadingInstance: any

const handleBeforeUpload = () => {
  showLoading()
}
const handleSuccess: UploadProps['onSuccess'] = (response: any) => { loadingInstance.close() }
const handleError: UploadProps['onError'] = (error: Error) => { showError('文件上传失败'); loadingInstance.close() }



const showLoading = () => {
  loadingInstance = ElLoading.service({
    target: loadingRef.value,
    text: '上传中...'
  });
}
</script>

<template>
  <div class="codtax-upload" ref="loadingRef">
    <el-upload class="uploader" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :on-success="handleSuccess" :on-error="handleError" :before-upload="handleBeforeUpload" :show-file-list="false"
      crossorigin="anonymous">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件或 <em>点击上传</em>
      </div>
      <template #tip>
      </template>
    </el-upload>
  </div>
</template>



<style lang="scss" scoped>
.codtax-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

:deep(.el-upload-dragger) {
  border-radius: 0;
}

.el-upload__text {
  em {
    color: var(--primary-purple);
    font-weight: 600;
  }
}

.uploader {
  width: 500px;
  height: 500px;
  border-radius: 0;
}
</style>