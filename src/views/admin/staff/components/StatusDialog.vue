<script setup lang="ts">
interface Props {
  status: 'loading' | 'success' | 'fail' | '';
}

const props = withDefaults(defineProps<Props>(), {
  status: 'fail',
});

const emits = defineEmits(['close']);
</script>

<template>
  <div class="status-dialog">
    <div class="status-panel pt-5 pb-10 px-10">
      <div
        class="status-loading flex flex-col items-center justify-center gap-10"
        v-if="props.status === 'loading'"
      >
        <div
          class="status-loading-icon absolute left-0 right-0 -mt-[100px]"
          v-loading="true"
        ></div>
        <div class="text-[18px] text-[#262626] mt-20">上传中</div>
      </div>

      <div
        class="status-success flex flex-col items-center justify-center"
        v-if="props.status === 'success'"
      >
        <div class="status-loading-icon mt-5">
          <svg-icon icon="admin-success" style="width: 70px; height: 70px" />
        </div>
        <div class="text-[18px] text-[#262626] mt-2">导入成功</div>
        <el-button type="primary" class="mt-10" @click="emits('close')"
          >查看详情</el-button
        >
      </div>

      <div
        class="status-fail flex flex-col items-center justify-center"
        v-if="props.status === 'fail'"
      >
        <div class="status-loading-icon mt-5">
          <svg-icon icon="admin-fail" style="width: 70px; height: 70px" />
        </div>
        <div class="text-[18px] text-[#262626] mt-2">导入失败</div>
        <div class="h-[150px] mt-5">
          <el-scrollbar>
            <div class="text-[#bcbcbc] text-[14px] leading-6">
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
              <p>
                “ID1391348 李想一”、“ID1381765 李想二”、“ID1567984 李想三”、
              </p>
            </div>
          </el-scrollbar>
        </div>
        <el-button type="primary" class="mt-10" @click="emits('close')"
          >知道了</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.circular) {
  width: 60px;
  height: 60px;
}
.status-loading {
  height: 100%;
}
.status-panel {
  width: 600px;
  min-height: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
  & > div {
    min-height: 300px;
  }
}
.status-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
