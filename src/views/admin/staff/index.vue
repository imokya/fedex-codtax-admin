<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { MAX_CONNECTION } from '@/constants/chat';
import CommonButton from '@/components/base/CommonButton/index.vue';
import StaffService from '@/services/admin/staff.service';
import ChannelService from '@/services/admin/channel.service';
import { API_Status } from '@/constants/api';
import { showSuccess } from '@/utils/methods';

import { ChannelData } from '@/types/admin';

export interface UserData {
  employeeId: string;
  name: string;
  channel: string;
  roleName: string;
  managerName: string;
  managerId: string;
  updateTime: string;
  loginStatus: string;
  capacity: number;
}

const StatusMap = ['离线', '在线', '忙碌', '离线', '登出'];

const data = ref<UserData[]>([]);
const channelList = ref<ChannelData[]>([]);

const total = ref(0);
const page = ref(1);
const size = ref(10);
const cardRef = ref();
const customerStatus = ref('');
const currentChannel = ref('');
const customerStatusOptions = [
  {
    value: 'ONLINE',
    label: '在线',
  },
  {
    value: 'OFFLINE',
    label: '离线',
  },
  {
    value: 'BUSY',
    label: '忙碌',
  },
  {
    value: 'LOGOUT',
    label: '登出',
  },
];
const keyword = ref('');
const currentBusyCount = ref(0);
const currentOnlineCount = ref(0);

const handleCurrentChange = (value: number) => {
  page.value = value;
  getList();
};

const handleMaxConnection = async (row: any) => {
  console.log('row', row.employeeId, row.capacity);
  const { status } = await StaffService.saveCapacity(
    row.employeeId,
    row.capacity
  );
  if (status === API_Status.SUCCESS) {
    showSuccess('修改成功');
  }
  getList();
};

const handleFilter = () => {
  getList();
};

const getList = async () => {
  const { data: result } = await StaffService.getList({
    name: keyword.value,
    pageNum: page.value,
    pageSize: size.value,
    loginStatus: customerStatus.value,
    channel: currentChannel.value,
  });
  data.value = result.employeeList;
  total.value = result.pageTotal;
  currentBusyCount.value = result.currentBusyCount;
  currentOnlineCount.value = result.currentOnlineCount;
};

const getChannelList = async () => {
  const { data: result } = await ChannelService.getList();
  channelList.value = result?.channels;
};

getList();
getChannelList();
</script>

<template>
  <div ref="cardRef">
    <el-card>
      <div class="card-header flex justify-between">
        工作人员名单
        <!-- <div class="flex gap-4">
          <el-upload
            :on-change="handleChange"
            :auto-upload="false"
            :show-file-list="false"
            accept=".xlsx, .xls"
          >
            <el-button :icon="Upload">上传</el-button>
          </el-upload>
          <el-button :icon="Download">下载模板</el-button>
        </div> -->
        <div class="card-summary flex gap-4">
          <div class="card-summary-item flex">
            <div class="card-summary-item-label">当前在线人数</div>
            <div class="card-summary-item-value">
              {{ currentOnlineCount }}人
            </div>
          </div>
          <div class="card-summary-item flex">
            <div class="card-summary-item-label">当前忙碌人数</div>
            <div class="card-summary-item-value">{{ currentBusyCount }}人</div>
          </div>
        </div>
      </div>
      <div class="filter-group flex gap-4 items-center mb-4">
        <!-- <div class="filter-label">筛选:</div> -->
        <div class="filter-input">
          <el-input
            type="text"
            placeholder="员工姓名/工号ID"
            class="w-[300px]"
            :suffix-icon="Search"
            v-model="keyword"
            clearable
          />
        </div>
        <div class="filter-input">
          <el-select
            type="text"
            placeholder="客服状态"
            class="w-[250px]"
            v-model="customerStatus"
            clearable
          >
            <el-option
              v-for="(item, index) in customerStatusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-input">
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
        </div>
        <common-button
          type="primary"
          class="button-confirm"
          @click="handleFilter"
          >应用</common-button
        >
      </div>
      <div>
        <el-table
          :data="data"
          style="width: 100%"
          :cell-style="{ height: '50px' }"
        >
          <el-table-column
            label="员工ID"
            width="200"
            prop="employeeId"
          ></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column
            label="渠道"
            width="100"
            prop="channel"
          ></el-table-column>
          <el-table-column
            label="角色"
            width="100"
            prop="roleName"
          ></el-table-column>
          <el-table-column
            label="经理姓名"
            prop="managerName"
          ></el-table-column>
          <el-table-column label="经理ID" prop="managerId"></el-table-column>
          <el-table-column label="操作时间" width="200" #default="{ row }">
            {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm') }}
          </el-table-column>

          <el-table-column label="状态" width="100" #default="{ row }">
            {{ StatusMap[row.loginStatus] }}
          </el-table-column>
          <el-table-column
            label="最大接入数"
            prop="capacity"
            width="100"
            #default="{ row }"
          >
            <el-select
              size="small"
              v-model="row.capacity"
              @change="handleMaxConnection(row)"
            >
              <el-option
                v-for="(item, index) in MAX_CONNECTION"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <el-pagination
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="size"
            :page-sizes="[2, 5, 10, 20]"
            layout=" prev, pager, next"
            :page-count="total"
            background
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <!-- <staff-dialog
      v-model="showDialog"
      @save="handleSave"
      @edit="handleSave"
      :data="currentData"
      :checked-keys="checkedKeys"
      :mode="mode"
    />
    <status-dialog :status="status" v-if="status" /> -->
  </div>
</template>
