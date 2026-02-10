<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import CustomTableColumn from './components/CustomTableColumn.vue';
import CalendarIcon from '@/components/icons/Calendar.vue';

import ReportService from '@/services/admin/report.service';
import ChannelService from '@/services/admin/channel.service';
import { ChannelData } from '@/types/admin';
import { showSuccess, showError } from '@/utils/methods';
import { downloadFile } from '@/utils/admin/methods';
import { disabledReportDate } from '@/utils/admin/methods';

const currentChannel = ref('IXP');
const channelList = ref<ChannelData[]>([]);

const tableData = ref<any[]>([]);
const total = ref(1);
const page = ref(1);
const size = ref(30);
const time = ref<number | null>(+dayjs());
const startTime = ref<number>();
const endTime = ref<number>();

const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const getList = async () => {
  if (time.value) {
    startTime.value = +dayjs(time.value).startOf('date');
    endTime.value = +dayjs(time.value).endOf('date');
  }
  const { data: result } = await ReportService.chatReport({
    channel: currentChannel.value,
    startTime: startTime.value,
    endTime: endTime.value,
    pageNum: page.value,
    pageSize: size.value,
  });
  tableData.value = result?.records;
  total.value = result?.pageTotal;
};

const getChannelList = async () => {
  const { data: result } = await ChannelService.getList();
  channelList.value = result?.channels;
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

const handleExport = async () => {
  try {
    const blob = await ReportService.export({
      channel: currentChannel.value,
      startTime: startTime.value,
      endTime: endTime.value,
      reportType: 'CHAT_REPORT',
    });
    const channelName = currentChannel.value ? `_${currentChannel.value}` : '';
    const name = `${dayjs().format(
      'YYYY-MM-DD'
    )}聊天统计报表${channelName}.xlsx`;
    downloadFile(blob, name);
  } catch (error) {
    if (error === 'noData') {
      showSuccess('暂无数据');
    } else {
      showError('下载失败');
    }
  }
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
          <div class="card-header-title-label">聊天统计</div>
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
            <el-select type="text" placeholder="渠道" class="w-[250px]" v-model="currentChannel" :clearable="false">
              <el-option v-for="(item, index) in channelList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </div>

          <div class="filter-input">
            <el-date-picker v-model="time" type="date" format="YYYY-MM-DD" date-format="YYYY/MM/DD"
              :prefix-icon="CalendarIcon" :clearable="false" @clear="handleDateClear"
              :disabled-date="disabledReportDate" />
          </div>
        </div>
        <div class="filter-group flex gap-4 items-center mb-4 ml-4 flex-shrink-0">
          <!-- <div>
            <common-button type="blue" link class="button-cancel"
              >清空</common-button
            >
          </div> -->
          <div>
            <common-button type="primary" class="button-confirm" @click="handleApply">应用</common-button>
          </div>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <custom-table-column title="时间" subtitle="Time" prop-name="reportTime" tooltip="体现数据的相关时间段" />
        <custom-table-column title="聊天互动量" subtitle="Chat interaction" prop-name="chatInteraction"
          tooltip="特定时段内与客户的互动次数" />
        <custom-table-column title="接入聊天量" subtitle="Incoming chat" prop-name="incomingChat" tooltip="特定时段内接入的客户数量" />

        <custom-table-column title="放弃聊天量" subtitle="Abandoned chat" prop-name="abandonedChat" tooltip="特定时段内放弃的客户数量" />

        <custom-table-column title="平均等待时长(s)" subtitle="Average wait time" prop-name="avgWaiting"
          tooltip="特定时段内客户从排队开始到接入人工客服的平均时长" />

        <custom-table-column title="在线客服人数" subtitle="Online CE" prop-name="maxOnlineEmployeeCount"
          tooltip="特定时段内在线的客服人数（最大值，在线+忙碌都会计算）" />

        <custom-table-column title="在线时长 (m)" subtitle="Online duration" prop-name="onlineTime"
          tooltip="特定时段内在线的所有客服的总在线时长（在线+忙碌都会计算）" />
      </el-table>
      <div class="flex justify-end">
        <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
          :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
