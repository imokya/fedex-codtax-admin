<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';

import CustomTableColumn from '../../components/CustomTableColumn.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import CalendarIcon from '@/components/icons/Calendar.vue';

import ReportService from '@/services/admin/report.service';
import { showSuccess, showError } from '@/utils/methods';
import { downloadFile } from '@/utils/admin/methods';
import { disabledReportDate } from '@/utils/admin/methods';

interface Props {
  employeeId: string;
  channel: string;
  time: number[] | null;
}

const props = withDefaults(defineProps<Props>(), {});

const emits = defineEmits<{
  (e: 'download', sessionId: string): void;
  (e: 'close'): void;
}>();

const tableData = ref<any[]>([]);
const page = ref(1);
const size = ref(8);
const total = ref(6);
const time = ref<number[] | null>(
  Array.isArray(props.time) ? [...props.time] : null
);
const startTime = ref<number>();
const endTime = ref<number>();

const handleApply = () => {
  getList();
};

const handleDateClear = () => {
  time.value = null;
  startTime.value = undefined;
  endTime.value = undefined;
};

const handleExport = async () => {
  try {
    const blob = await ReportService.export({
      startTime: startTime.value,
      endTime: endTime.value,
      reportType: 'CS_ONLINE_DETAIL',
      channel: props.channel,
      employeeId: props.employeeId
    });
    const name = `${dayjs().format('YYYY-MM-DD')}在线客服详情报表.xlsx`;
    downloadFile(blob, name);
  } catch (error) {
    showError('下载失败');
  }
};

const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const getList = async () => {
  if (time.value) {
    startTime.value = +dayjs(time.value[0]);
    endTime.value = +dayjs(time.value[1]);
  }
  const { data: result } = await ReportService.onlineDetailReport({
    startTime: startTime.value,
    employeeId: props.employeeId,
    endTime: endTime.value,
    pageNum: page.value,
    pageSize: size.value,
  });
  tableData.value = result?.records;
  total.value = result?.pageTotal;
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="chat-dialog">
    <div class="chat-panel w-[80%] xl:w-[50%] relative">
      <div class="chat-panel-header">
        <div class="chat-panel-header-head">
          <div class="text-[#262626] text-[18px]">查看详情</div>
          <common-button class="button-action mr-8 !py-1 !px-4" type="blue" plain round @click="handleExport">
            下载
          </common-button>
          <div class="absolute top-[20px] right-[20px] cursor-pointer" @click="emits('close')">
            <svg-icon icon="chat-close" class="!w-[14px] !h-[14px]" />
          </div>
        </div>
        <div class="chat-panel-header-filter">
          <div class="flex mt-[-10px]">
            <div class="filter-group flex gap-4 items-center mb-4 flex-shrink-0">
              <div class="filter-input">
                <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="截止日期"
                  format="YYYY-MM-DD HH:mm:ss" :default-time="[
                    +dayjs().startOf('date'),
                    +dayjs().endOf('date'),
                  ]" :prefix-icon="CalendarIcon" clearable @clear="handleDateClear"
                  :disabled-date="disabledReportDate" />
              </div>
            </div>
            <div class="filter-group flex gap-4 items-center mb-4 ml-4 flex-shrink-0">
              <div>
                <common-button type="primary" class="button-confirm" @click="handleApply">应用</common-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-panel-content">
        <el-table :data="tableData" style="width: 100%">
          <custom-table-column title="客服编号" subtitle="Customer No" prop-name="employeeId" tooltip="客服ID" />
          <custom-table-column title="客户昵称" subtitle="Nick name" prop-name="nickName" tooltip="客服ID" />
          <custom-table-column title="客服类型" subtitle="Customer type" prop-name="channel" tooltip="渠道名称" />

          <custom-table-column title="开始时间" subtitle="Access" prop-name="accessTime" tooltip="看到欢迎语的时间点"
            #default="{ data }">
            {{ data.row['accessTime'] }}
          </custom-table-column>

          <custom-table-column title="受理时间" subtitle="Deal" prop-name="dealTime" tooltip="客服发送第一条消息的时间点"
            #default="{ data }">
            {{ data.row['dealTime'] }}
          </custom-table-column>

          <custom-table-column title="结束时间" subtitle="End" prop-name="endTime" tooltip="聊天结束时间" #default="{ data }">
            {{ data.row['endTime'] }}
          </custom-table-column>

          <custom-table-column title="回复时长(s)" subtitle="Response(s)" prop-name="responseTime" tooltip="结束时间-接入时间" />

          <custom-table-column title="等待时长(s)" subtitle="Wait(s)" prop-name="waitingTime"
            tooltip="转人工分配到pipeline-看到欢迎语" />

          <custom-table-column title="聊天时长(s)" subtitle="Chat(s)" prop-name="chatTime"
            tooltip="pipeline之后客户发的第一条消息开始" />

          <custom-table-column title="互动次数" subtitle="Interactive count" prop-name="interactionCount"
            tooltip="与客户的互动次数" />

          <custom-table-column title="咨询类型" subtitle="Consulation" prop-name="inquiryType" tooltip="客户咨询的对话类型" />
        </el-table>
        <div class="flex justify-end">
          <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
            :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-panel {
  min-height: 550px;
  background-color: #fbfbfb;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);

  &-header {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);

    &-head {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
    }

    &-filter {
      display: flex;
      align-items: center;
      padding: 10px 20px 0 20px;
    }
  }

  &-content {
    padding: 20px;
    background-color: transparent;
  }
}

.chat-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.chat-room) {
  height: 480px;
}
</style>
