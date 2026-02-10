<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import CalendarIcon from '@/components/icons/Calendar.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import CustomTableColumn from './components/CustomTableColumn.vue';

import ReportService from '@/services/admin/report.service';
import ChannelService from '@/services/admin/channel.service';
import { ChannelData } from '@/types/admin';
import { showSuccess, showError } from '@/utils/methods';
import { downloadFile } from '@/utils/admin/methods';
import { disabledReportDate } from '@/utils/admin/methods';

const tableData = ref<any[]>([]);
const total = ref(1);
const page = ref(1);
const size = ref(10);
const time = ref([+dayjs().startOf('date'), +dayjs().endOf('date')]);
const startTime = ref<number>();
const endTime = ref<number>();

const currentChannel = ref('IXP');
const channelList = ref<ChannelData[]>([]);

const EndType = [
  '系统关闭',
  '客服手动关闭',
  '系统关闭',
  '系统关闭',
  '系统关闭',
];

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
  const { data: result } = await ReportService.sessionReport({
    channel: currentChannel.value,
    startTime: startTime.value,
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
      reportType: 'SESSION_MESSAGE',
    });
    const channelName = currentChannel.value ? `_${currentChannel.value}` : '';
    const name = `${dayjs().format(
      'YYYY-MM-DD'
    )}会话消息报表${channelName}.xlsx`;
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

onMounted(() => {
  getList();
  getChannelList();
});

onMounted(() => {
  // getList();
  getChannelList();
});
</script>
<template>
  <div>
    <el-card>
      <div class="card-header flex items-center justify-between">
        <div class="card-header-title">
          <div class="card-header-title-label">会话消息</div>
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
        <custom-table-column title="微信ID" subtitle="Wechat ID" prop-name="wechatId" tooltip="微信的openid"
          :min-width="280" />
        <custom-table-column title="客户微信昵称" subtitle="Wechat nickname" prop-name="nickName" tooltip="微信昵称" />
        <custom-table-column title="接入时间" subtitle="Access time" prop-name="accessTime" tooltip="客户被分配具体客服的时间"
          #default="{ data }">
          {{ data.row['accessTime'] }}
        </custom-table-column>

        <custom-table-column title="结束时间" subtitle="End time" prop-name="endTime" tooltip="客服手动结束对话或者客户没有响应系统自动结束对话的时间"
          #default="{ data }">
          {{ data.row['endTime'] }}
        </custom-table-column>

        <custom-table-column title="聊天时长(s)" subtitle="Chat duration" prop-name="chatDuration" tooltip="结束时间-接入时间"
          :min-width="130" />

        <custom-table-column title="咨询类型" subtitle="Inquiry type" prop-name="inquiryType" tooltip="客户咨询的对话类型"
          :min-width="150" />

        <custom-table-column title="结束标识" subtitle="End type" prop-name="endType" tooltip="仅仅两种值, “客服手动关闭”或者”系统关闭”"
          :min-width="220" #default="{ data }">
          {{ data.row.endType }}
        </custom-table-column>

        <custom-table-column title="受理客服" subtitle="Employee ID" prop-name="employeeId" tooltip="客服的ID"
          :min-width="200" />
      </el-table>
      <div class="flex justify-end">
        <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
          :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
