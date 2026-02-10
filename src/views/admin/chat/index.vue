<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import ChatDialog from './components/ChatDialog.vue';
import Empty from '@/components/base/Empty/index.vue';
import { Search } from '@element-plus/icons-vue';
import CalendarIcon from '@/components/icons/Calendar.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import AuditService from '@/services/admin/audit.service';
import { showError, showSuccess } from '@/utils/methods';
import { disabledChatDate } from '@/utils/admin/methods';

export interface UserData {
  id: number;
  nickname: string;
  staffNo: string;
  startTime: string;
  endTime: string;
}

const data = ref<UserData[]>([]);

const total = ref(6);
const page = ref(1);
const size = ref(10);
const time = ref([+dayjs().startOf('date'), +dayjs().endOf('date')]);

const showChatDialog = ref(false);
const employeeId = ref<string>('');
const userNickName = ref<string>('');
const content = ref<string>('');
const startTime = ref<number>();
const endTime = ref<number>();
const sessionId = ref<string>('');
const scopeId = ref<string>('');

const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const handleView = (row: any) => {
  showChatDialog.value = true;
  sessionId.value = row.sessionId;
  scopeId.value = row.scopeId;
};

const downloadFile = (blob: any, filename: string) => {
  const downloadURL = (window.URL || window.webkitURL).createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleDownload = async (sessionId: string) => {
  try {
    const blob = await AuditService.download(sessionId);
    downloadFile(blob, `chat-${sessionId}.pdf`);
  } catch (error) {
    if (error === 'noData') {
      showSuccess('暂无数据');
    } else {
      showError('下载失败');
    }
  }
};

const getList = async () => {
  if (time.value) {
    startTime.value = +dayjs(time.value[0]);
    endTime.value = +dayjs(time.value[1]);
  }

  const { data: result } = await AuditService.getList({
    employeeId: employeeId.value,
    userNickName: userNickName.value,
    content: content.value,
    startTime: startTime.value,
    endTime: endTime.value,
    pageNum: page.value,
    pageSize: size.value,
  });
  data.value = result?.records;
  total.value = result?.pageTotal;
};

const handleDateClear = () => {
  time.value = null;
  startTime.value = undefined;
  endTime.value = undefined;
};

const handleApply = () => {
  getList();
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div ref="cardRef">
    <el-card>
      <div class="card-header flex justify-between">历史聊天记录</div>
      <div class="flex">
        <div class="filter-group flex gap-4 items-center mb-4 flex-shrink-0">
          <!-- <div class="filter-label flex-shrink-0">筛选:</div> -->
          <div class="filter-input">
            <el-input type="text" placeholder="客服编号" class="w-[210px]" :suffix-icon="Search" v-model="employeeId"
              clearable />
          </div>
          <div class="filter-input">
            <el-input type="text" placeholder="客户昵称" class="w-[210px]" :suffix-icon="Search" v-model="userNickName"
              clearable />
          </div>
          <div class="filter-input">
            <el-input type="text" placeholder="聊天内容" class="w-[210px]" :suffix-icon="Search" v-model="content"
              clearable />
          </div>
          <div class="filter-input">
            <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="截止日期"
              format="YYYY-MM-DD HH:mm:ss" :prefix-icon="CalendarIcon"
              :default-time="[+dayjs().startOf('date'), +dayjs().endOf('date')]" clearable @clear="handleDateClear"
              :disabled-date="disabledChatDate" />
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
      <div>
        <el-table :data="data" style="width: 100%" :cell-style="{ height: '50px' }">
          <el-table-column label="客户昵称" prop="userNickName"></el-table-column>
          <el-table-column label="客服编号" prop="employeeId"></el-table-column>
          <el-table-column label="接入时间" #default="{ row }">
            {{ dayjs(row.accessTime).format('YYYY-MM-DD HH:mm:ss') }}
          </el-table-column>
          <el-table-column label="结束时间" #default="{ row }">
            {{ dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
          </el-table-column>
          <el-table-column label="操作" #default="{ row }">
            <el-button size="small" @click="handleView(row)" class="table-action-button" link>查看</el-button>
            <el-button size="small" class="table-action-button" link
              @click="handleDownload(row?.sessionId)">下载</el-button>
          </el-table-column>
          <template #empty>
            <empty content="没有搜索结果，请重新查找" class="m-10" />
          </template>
        </el-table>
        <div class="flex justify-end">
          <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="page" :page-size="size"
            :page-sizes="[2, 5, 10, 20]" layout="prev, pager, next" :page-count="total" background></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
  <chat-dialog v-if="showChatDialog" @close="showChatDialog = false" :scope-id="scopeId" :session-id="sessionId"
    :keyword="content" @download="handleDownload" />
</template>
