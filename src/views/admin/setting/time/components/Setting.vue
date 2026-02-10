<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { showConfirm, showError, showSuccess } from '@/utils/methods';
import type { CalendarDateType, CalendarInstance } from 'element-plus';
import CalendarIcon from '@/components/icons/Calendar.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import GlobalService from '@/services/admin/global.service';
import { API_Status } from '@/constants/api';
import CalendarService from '@/services/admin/calendar.service';

interface Props {
  channel: string;
}

const props = defineProps<Props>();

const workingTime = ref(new Date());
const offworkDays = ref<any[]>([]);
const workingDays = ref<any[]>([]);
const calendarKey = ref(0);

const settings = ref<any>({});

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};

const checkIsWorkingDay = (data: any) => {
  const day = dayjs(data.day).day();
  const isOffworkDay = offworkDays.value.some((item) => {
    return dayjs(item).isSame(dayjs(data.day));
  });

  const isWOrkingDay = workingDays.value.some((item) =>
    dayjs(item).isSame(dayjs(data.day))
  );
  if (isOffworkDay) {
    return false;
  }

  // 只有周日是休息日
  if (day === 0) {
    if (isWOrkingDay) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

const handleChange = (data: any) => {
  const isWorkingDay = checkIsWorkingDay(data);
  const description = isWorkingDay
    ? '是否要将其改为休息日？'
    : '是否要将其改为工作日？';
  showConfirm({
    title: '更改状态',
    description,
    onConfirm: async () => {
      const { status } = await CalendarService.save({
        category: props.channel,
        date: data.day,
        type: isWorkingDay ? 'NOT_WORKDAY' : 'WORKDAY',
      });

      if (status === API_Status.SUCCESS) {
        showSuccess('保存成功');
      } else {
        showError('保存出错');
      }

      getCalendar();

      // if (isWorkingDay) {
      //   workingDays.value = workingDays.value.filter(
      //     (item) => !dayjs(data.day).isSame(dayjs(item))
      //   );
      //   offworkDays.value = offworkDays.value.filter(
      //     (item) => !dayjs(data.day).isSame(dayjs(item))
      //   );
      //   offworkDays.value = [...offworkDays.value, data.day];
      //   console.log('not working', data);
      // } else {
      //   offworkDays.value = offworkDays.value.filter(
      //     (item) => !dayjs(data.day).isSame(dayjs(item))
      //   );
      //   workingDays.value = workingDays.value.filter(
      //     (item) => !dayjs(data.day).isSame(dayjs(item))
      //   );
      //   workingDays.value = [...workingDays.value, data.day];
      // }
      // console.log(offworkDays.value, workingDays.value);
    },
  });
};

const getConfig = async () => {
  const { data: result } = await GlobalService.getConfig({
    configKey: 'WORKHOUR',
    configKey2: props.channel,
  });

  settings.value = result.configItems.reduce((a: any, b: any) => {
    a[b.configKey3] = b.configValue;
    return a;
  }, {});
};

const saveConfig = async () => {
  const newData = Object.keys(settings.value).map((key: string) => {
    return {
      configKey: 'WORKHOUR',
      configKey2: props.channel,
      configKey3: key,
      configValue: settings.value[key],
    };
  });

  const { status } = await GlobalService.saveConfig({
    configItems: newData,
  });
  if (status === API_Status.SUCCESS) {
    showSuccess('保存成功');
  }
};

const getCalendar = async () => {
  const { data: result } = await CalendarService.getList(props.channel);

  const _workingDays = result.map((item: any) => {
    if (item.dateType == 0) {
      return item.calendarDate;
    }
  });
  const _offworkDays = result.map((item: any) => {
    if (item.dateType == 1) {
      return item.calendarDate;
    }
  });
  workingDays.value = _workingDays;
  offworkDays.value = _offworkDays;
};

const handleSave = () => {
  saveConfig();
};

onMounted(() => {
  getConfig();
  getCalendar();
});
</script>
<template>
  <div>
    <el-card>
      <el-scrollbar class="scrollbar">
        <div class="group-wrap flex gap-10">
          <div class="group">
            <div class="group-title">开始工作时间</div>
            <div class="group-content">
              <el-time-picker
                v-model="settings['WORK.START.TIME']"
                placeholder="选择时间"
                :prefix-icon="CalendarIcon"
                format="HH:mm"
                value-format="HH:mm"
              />
            </div>
          </div>

          <div class="group">
            <div class="group-title">结束工作时间</div>
            <div class="group-content">
              <el-time-picker
                v-model="settings['WORK.END.TIME']"
                placeholder="选择时间"
                :prefix-icon="CalendarIcon"
                format="HH:mm"
                value-format="HH:mm"
              />
            </div>
          </div>
        </div>

        <div class="group xl:w-[70%]">
          <div class="group-title">工作时间外提示用户</div>
          <div class="group-content">
            <el-input
              type="textarea"
              v-model="settings['NOT.WORKING.PUSH.MESSAGE']"
            />
          </div>
        </div>

        <div class="group">
          <div class="group-title">调整工作日</div>
          <div class="group-content">
            <el-calendar
              v-model="workingTime"
              ref="calendar"
              :key="calendarKey"
              class="xl:w-[70%]"
            >
              <template #header="{ date }">
                <div class="flex flex-col">
                  <div>{{ date }}</div>
                  <div class="flex gap-5 mt-2">
                    <div class="workingDay">工作日</div>
                    <div class="offDay">休息日</div>
                  </div>
                </div>
                <el-button-group>
                  <el-button size="small" @click="selectDate('prev-year')">
                    上一年
                  </el-button>
                  <el-button size="small" @click="selectDate('prev-month')">
                    上一月
                  </el-button>
                  <el-button size="small" @click="selectDate('today')"
                    >今天</el-button
                  >
                  <el-button size="small" @click="selectDate('next-month')">
                    下一月
                  </el-button>
                  <el-button size="small" @click="selectDate('next-year')">
                    下一年
                  </el-button>
                </el-button-group>
              </template>
              <template #date-cell="{ data }">
                <div
                  class="calendar-cell w-full h-full p-4"
                  :class="{ active: checkIsWorkingDay(data) }"
                  @click.stop="handleChange(data)"
                >
                  {{ dayjs(data.day).format('D') }}
                </div>
              </template>
            </el-calendar>
          </div>
        </div>

        <div class="flex justify-end pb-5 mt-[50px] w-[70%]">
          <common-button
            type="primary"
            class="button-confirm"
            @click="handleSave"
            >保存</common-button
          >
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.group {
  margin-bottom: 20px;
  &-title {
    font-size: 12px;
    margin-bottom: 5px;
  }
}

:deep(.el-calendar) {
  --el-calendar-cell-width: 60px;
}

:deep(.el-calendar__header),
:deep(.el-calendar__body) {
  padding-left: 0;
  padding-right: 0;
  font-size: 16px;
}

:deep(.el-calendar-table) {
  thead {
    background-color: var(--secondary-purple);
    th {
      color: #fff;
    }
    th:first-child {
      background-color: #e3e3e3;
      color: #565656;
    }
  }
}

:deep(.el-calendar-table__row) {
  td:first-child {
    .calendar-cell {
      background-color: #f2f2f2;
      color: #565656;
    }
  }
}

:deep(.el-calendar__title) {
  font-size: 16px;
  color: #303133;
}

:deep(.el-calendar-day) {
  padding: 0;
}

:deep(.calendar-cell) {
  background-color: #f2f2f2;
  color: #565656;
}

:deep(.calendar-cell.active) {
  color: var(--primary-purple);
  background-color: #faf7fb !important;
  font-weight: 600;
}

:deep(.el-calendar-table:not(.is-range) td.next) {
  color: currentColor;
}

:deep(.el-calendar-table:not(.is-range) td.prev) {
  color: currentColor;
}

.workingDay {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 15px;
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    background-color: var(--primary-purple);
    left: 0;
  }
}

.offDay {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 15px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    background-color: #8e8e8e;
    left: 0;
  }
}
</style>
