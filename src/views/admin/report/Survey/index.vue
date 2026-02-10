<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import CalendarIcon from '@/components/icons/Calendar.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import CustomTableColumn from '../components/CustomTableColumn.vue';
import ChatDialog from './components/ChatDialog.vue';

import { ChannelData } from '@/types/admin';

import ReportService from '@/services/admin/report.service';
import ChannelService from '@/services/admin/channel.service';

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

const showChatDialog = ref(false);
const currentChannel = ref('');
const channelList = ref<ChannelData[]>([]);
const totalTriggerSuccessCount = ref(0);
const totalNotTriggerCount = ref(0);

const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const handleDateClear = () => {
  time.value = null;
  startTime.value = undefined;
  endTime.value = undefined;
};

const getChannelList = async () => {
  const { data: result } = await ChannelService.getList();
  channelList.value = result?.channels;
};

const handleDetail = (row: any) => {
  showChatDialog.value = true;
};

const getList = async () => {
  if (time.value) {
    startTime.value = +dayjs(time.value[0]);
    endTime.value = +dayjs(time.value[1]);
  }
  const { data: result } = await ReportService.surveyReport({
    // channel: currentChannel.value,
    startTime: startTime.value,
    endTime: endTime.value,
    pageNum: page.value,
    pageSize: size.value,
  });
  tableData.value = result?.records;
  total.value = result?.pageTotal;
  totalNotTriggerCount.value = result?.totalNotTriggerCount;
  totalTriggerSuccessCount.value = result?.totalTriggerSuccessCount;
};

const handleExport = async () => {
  try {
    const blob = await ReportService.export({
      // channel: currentChannel.value,
      startTime: startTime.value,
      endTime: endTime.value,
      reportType: 'SURVEY',
    });
    const name = `${dayjs().format('YYYY-MM-DD')}微聊调研统计报表.xlsx`;
    downloadFile(blob, name);
  } catch (error) {
    if (error === 'noData') {
      showSuccess('暂无数据');
    } else {
      showError('下载失败');
    }
  }
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
  // getChannelList();
});
</script>
<template>
  <div>
    <el-card>
      <div class="card-header flex items-center justify-between">
        <div class="card-header-title">
          <div class="card-header-title-label">微聊调研统计</div>
          <div class="card-header-title-icon" title="刷新" @click="handleRefresh">
            <svg-icon icon="reload" />
          </div>
        </div>
        <div class="flex">
          <div class="card-summary flex gap-4 mr-10">
            <div class="card-summary-item flex">
              <div class="card-summary-item-label">总触发次数</div>
              <div class="card-summary-item-value">
                {{ totalTriggerSuccessCount }}
              </div>
            </div>
            <div class="card-summary-item flex">
              <div class="card-summary-item-label">未触发次数</div>
              <div class="card-summary-item-value">
                {{ totalNotTriggerCount }}
              </div>
            </div>
          </div>
          <common-button class="button-action" type="blue" plain round @click="handleExport">
            下载
          </common-button>
        </div>
      </div>

      <div class="flex mt-[-10px]">
        <div class="filter-group flex gap-4 items-center mb-4 flex-shrink-0">
          <!-- <div class="filter-label flex-shrink-0">筛选:</div> -->
          <!-- <div class="filter-input">
            <el-select
              type="text"
              placeholder="渠道"
              class="w-[250px]"
              v-model="currentChannel"
              clearable
            >
              <el-option
                v-for="(item, index) in channelList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div> -->

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
        <custom-table-column title="序列号" subtitle="Serial Number" prop-name="serialNumber"
          tooltip="每个互动次数中，回复时间≤60s的比例" />
        <custom-table-column title="是否推送成功" subtitle="Send Result" prop-name="sendResult" tooltip="推送机制"
          #default="{ data }">
          <!-- {{ data.row['sendResult'] === 0 ? '成功' : '不成功' }} -->
          {{ data.row['sendResult'] }}
        </custom-table-column>
        <custom-table-column title="服务日期" subtitle="Service date" prop-name="surveyDate" tooltip="服务日期"
          #default="{ data }">
          {{ data.row['surveyDate'] }}
        </custom-table-column>
        <custom-table-column title="客户微信号" subtitle="Customer wechat ID" prop-name="wechatId" tooltip="客户微信号" />

        <custom-table-column title="对话日期" subtitle="Chat date" prop-name="chatDate" tooltip="聊天日期" #default="{ data }">
          {{ data.row['chatDate'] }}
        </custom-table-column>

        <custom-table-column title="开始时间" subtitle="Access time" prop-name="accessTime" tooltip="聊天开始时间"
          #default="{ data }">
          {{ data.row['accessTime'] }}
        </custom-table-column>

        <custom-table-column title="结束时间" subtitle="End time" prop-name="endTime" tooltip="聊天结束时间" #default="{ data }">
          {{ data.row['endTime'] }}
        </custom-table-column>

        <custom-table-column title="结束标识" subtitle="Close code" prop-name="closeCode" tooltip="结束标识" />

        <custom-table-column title="受理客服" subtitle="Employee ID" prop-name="employeeId" tooltip="客服ID" />

        <custom-table-column title="经理工号" subtitle="Manager ID" prop-name="managerId" tooltip="经理ID" />

        <custom-table-column title="客户评分1" subtitle="Customer rating1" prop-name="score1" tooltip="客户评分对应截图第一行评分" />

        <custom-table-column title="客户评分2" subtitle="Customer rating2" prop-name="score2" tooltip="客户评分对应截图第二行评分" />

        <custom-table-column title="是否解决" subtitle="Resolution status" prop-name="score3" tooltip="是否解决" />

        <custom-table-column title="评分原因" subtitle="Rating reason" prop-name="reason" tooltip="评分原因" />

        <custom-table-column title="客户称呼" subtitle="Customer name" prop-name="customerName" tooltip="客户称呼" />

        <custom-table-column title="客户手机" subtitle="Customer phone" prop-name="customerPhoneNum" tooltip="客户手机" />

        <custom-table-column title="客户邮箱" subtitle="Customer email" prop-name="customerEmail" tooltip="客户邮箱" />

        <custom-table-column title="客户FedEx账号" subtitle="Customer FedEx Account" prop-name="customerAcct"
          tooltip="客户FedEx账号" />

        <!-- <el-table-column
          label="操作"
          #default="{ row }"
          fixed="right"
          min-width="100"
        >
          <el-button
            size="small"
            class="table-action-button"
            link
            @click="handleDetail(row)"
            >查看</el-button
          >
        </el-table-column> -->
      </el-table>
      <div class="flex justify-end">
        <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
          :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
      </div>
    </el-card>
  </div>
  <chat-dialog v-if="showChatDialog" v-model="showChatDialog" session-id="1" @close="showChatDialog = false" />
</template>

<style lang="scss" scoped></style>
