<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';

import CommonButton from '@/components/base/CommonButton/index.vue';
import CustomTableColumn from '../components/CustomTableColumn.vue';

import ReportService from '@/services/admin/report.service';
import ChannelService from '@/services/admin/channel.service';
import { ChannelData } from '@/types/admin';

import { Search } from '@element-plus/icons-vue';
import CalendarIcon from '@/components/icons/Calendar.vue';
import DetailDialog from './components/DetailDialog.vue';
import { showSuccess, showError } from '@/utils/methods';
import { downloadFile } from '@/utils/admin/methods';
import { disabledReportDate } from '@/utils/admin/methods';

const tableData = ref<any[]>([]);
const total = ref(1);
const page = ref(1);
const size = ref(10);
const time = ref<number[] | null>([
  +dayjs().startOf('date'),
  +dayjs().endOf('date'),
]);
const startTime = ref<number>();
const endTime = ref<number>();
const employeeId = ref();
const detailEmployeeId = ref('');

const currentChannel = ref('IXP');
const channelList = ref<ChannelData[]>([]);
const showDetailDialog = ref(false);


const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const getChannelList = async () => {
  const { data: result } = await ChannelService.getList();
  channelList.value = result?.channels;
};

const getList = async () => {
  if (time.value) {
    startTime.value = +dayjs(time.value[0]);
    endTime.value = +dayjs(time.value[1]);
  }

  const { data: result } = await ReportService.onlineReport({
    channel: currentChannel.value,
    startTime: startTime.value,
    employeeId: employeeId.value,
    endTime: endTime.value,
    pageNum: page.value,
    pageSize: size.value,
  });
  tableData.value = result?.records;
  total.value = result?.pageTotal;
};

const handleExport = async () => {
  try {
    const blob = await ReportService.export({
      channel: currentChannel.value,
      startTime: startTime.value,
      endTime: endTime.value,
      reportType: 'CS_ONLINE',
      employeeId: employeeId.value
    });
    const channelName = currentChannel.value ? `_${currentChannel.value}` : '';
    const name = `${dayjs().format(
      'YYYY-MM-DD'
    )}在线客服报表${channelName}.xlsx`;
    downloadFile(blob, name);
  } catch (error) {
    if (error === 'noData') {
      showSuccess('暂无数据');
    } else {
      showError('下载失败');
    }
  }
};

const handleDateClear = () => {
  time.value = null;
  startTime.value = undefined;
  endTime.value = undefined;
};

const handleApply = () => {
  getList();
};

const handleRefresh = async () => {
  await getList();
  showSuccess('刷新成功');
};

const handleDetail = (row: any) => {
  detailEmployeeId.value = row.employeeId;
  showDetailDialog.value = true;
};

onMounted(() => {
  getList();
  getChannelList();
});
</script>
<template>
  <div>
    <el-card>
      <div class="card-header flex items-center justify-between">
        <div class="card-header-title">
          <div class="card-header-title-label">在线客服</div>
          <div class="card-header-title-icon" title="刷新" @click="handleRefresh">
            <svg-icon icon="reload" />
          </div>
        </div>
        <common-button class="button-action" type="blue" plain round @click="handleExport">
          下载
        </common-button>
      </div>

      <div class="flex mt-[-10px]">
        <div class="filter-group flex gap-4 items-center mb-4 flex-shrink-0">
          <!-- <div class="filter-label flex-shrink-0">筛选:</div> -->
          <div class="filter-input">
            <el-select type="text" placeholder="渠道" class="w-[250px]" v-model="currentChannel" clearable>
              <el-option v-for="(item, index) in channelList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </div>

          <div class="filter-input">
            <el-input type="text" placeholder="客服编号" class="w-[220px]" :suffix-icon="Search" v-model="employeeId"
              clearable />
          </div>

          <div class="filter-input">
            <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="截止日期"
              format="YYYY-MM-DD HH:mm:ss" :default-time="[+dayjs().startOf('date'), +dayjs().endOf('date')]"
              :prefix-icon="CalendarIcon" clearable @clear="handleDateClear" :disabled-date="disabledReportDate" />
          </div>
        </div>
        <div class="filter-group flex gap-4 items-center mb-4 ml-4 flex-shrink-0">
          <div>
            <common-button type="primary" class="button-confirm" @click="handleApply">应用</common-button>
          </div>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <custom-table-column title="客服编号" subtitle="Employee ID" prop-name="employeeId" tooltip="客服ID" />
        <custom-table-column title="聊天数量" subtitle="Chat volume" prop-name="chatVolume" tooltip="特定时段内接入的客户数量" />
        <custom-table-column title="互动次数" subtitle="Interaction count" prop-name="interactionCount"
          tooltip="与客户的互动次数" />

        <custom-table-column title="聊天时长" subtitle="Chat duration" prop-name="chatDuration" tooltip="结束时间-接入时间" />

        <custom-table-column title="服务时长" subtitle="Service duration" prop-name="serviceDuration"
          tooltip="有客户在线的时间，仅仅计算最早的点-最晚的聊天点，多次登录就累加" />

        <custom-table-column title="在线时长" subtitle="Online duration" prop-name="onlineDuration"
          tooltip="登录之后统计在线状态的时长，多次登录登出, 需要sum" />

        <custom-table-column title="忙碌时长" subtitle="Busy Duration" prop-name="busyDuration"
          tooltip="登录之后统计忙碌状态的时长，多次登录登出, 需要sum" />

        <custom-table-column title="时间效率" subtitle="Time efficiency" prop-name="timeEfficiency" tooltip="服务时长/在线时长+忙碌时长"
          #default="{ data }">
          {{ data.row['timeEfficiency'] }}
        </custom-table-column>

        <custom-table-column title="服务效率" subtitle="Service efficiency" prop-name="serviceEfficiency"
          tooltip="聊天时长/服务时长，保留两位小数" #default="{ data }">
          {{ data.row['serviceEfficiency'] }}
        </custom-table-column>

        <custom-table-column title="服务指标" subtitle="Service Metrics" prop-name="serviceMetrics"
          tooltip="统计在设定时间段内每一个客服回复时间小于60s的百分比" #default="{ data }">
          {{ data.row['serviceMetrics'] }}
        </custom-table-column>

        <custom-table-column title="平均回复时间" subtitle="Average response time" prop-name="avgRes"
          tooltip="统计在设定时间段内每一个客服平均的回复时间" />

        <custom-table-column title="平均等待时间" subtitle="Average wait time" prop-name="avgWaiting"
          tooltip="特定时段内客户从排队开始到接入人工客服的平均时长" />

        <custom-table-column title="平均聊天时长" subtitle="Average chat duration" prop-name="avgChatDuration"
          tooltip="平均聊天时间" />
        <el-table-column label="操作" #default="{ row }" fixed="right" min-width="120">
          <el-button size="small" class="table-action-button" v-if="row.employeeId !== 'Summary'" link
            @click="handleDetail(row)">查看详情</el-button>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
          :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
      </div>
    </el-card>
  </div>
  <detail-dialog v-if="showDetailDialog" @close="showDetailDialog = false" :time="time" :channel="currentChannel"
    :employee-id="detailEmployeeId" />
</template>

<style lang="scss" scoped></style>
