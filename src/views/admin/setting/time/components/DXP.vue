<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { showConfirm } from '@/utils/methods';
import type { CalendarDateType, CalendarInstance } from 'element-plus';
import CalendarIcon from '@/components/icons/Calendar.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';

const workingTime1 = ref();
const workingTime2 = ref();
const offworkTimeText = ref(
  '您好，现在是客服离线时间，请在工作时间（周一至周六，早9点至晚6点）再联系'
);
const surveyText = ref('');
const workingTime = ref(new Date());
const offworkDays = ref<any[]>([]);
const workingDays = ref<any[]>([]);

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};

const checkIsWorkingDay = (data: any) => {
  const day = dayjs(data.day).day();
  const isOffworkDay = offworkDays.value.some((item) =>
    dayjs(item).isSame(dayjs(data.day))
  );

  const isWOrkingDay = workingDays.value.some((item) =>
    dayjs(item).isSame(dayjs(data.day))
  );

  if (isOffworkDay) {
    return false;
  }
  if (day === 0 || day === 6) {
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
    onConfirm: () => {
      console.log('isWOrkingDay', isWorkingDay);

      if (isWorkingDay) {
        workingDays.value = workingDays.value.filter(
          (item) => !dayjs(data.day).isSame(dayjs(item))
        );
        offworkDays.value = offworkDays.value.filter(
          (item) => !dayjs(data.day).isSame(dayjs(item))
        );
        offworkDays.value = [...offworkDays.value, data.day];
      } else {
        offworkDays.value = offworkDays.value.filter(
          (item) => !dayjs(data.day).isSame(dayjs(item))
        );
        workingDays.value = workingDays.value.filter(
          (item) => !dayjs(data.day).isSame(dayjs(item))
        );
        workingDays.value = [...workingDays.value, data.day];
      }
      console.log(offworkDays.value, workingDays.value);
    },
  });
};
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
                v-model="workingTime1"
                type="datetime"
                placeholder="选择时间"
                :prefix-icon="CalendarIcon"
              />
            </div>
          </div>

          <div class="group">
            <div class="group-title">结束工作时间</div>
            <div class="group-content">
              <el-time-picker
                v-model="workingTime2"
                type="datetime"
                placeholder="选择时间"
                :prefix-icon="CalendarIcon"
              />
            </div>
          </div>
        </div>

        <div class="group w-[70%]">
          <div class="group-title">调查问卷文案</div>
          <div class="group-content">
            <el-input type="textarea" v-model="surveyText" />
          </div>
        </div>

        <div class="group">
          <div class="group-title">调整工作日</div>
          <div class="group-content">
            <el-calendar v-model="workingTime" ref="calendar">
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
                  @click="handleChange(data)"
                >
                  {{ dayjs(data.day).format('D') }}
                </div>
              </template>
            </el-calendar>
          </div>
        </div>

        <div class="flex justify-end pb-5 mt-[50px] w-[70%]">
          <common-button type="primary" class="button-confirm"
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
  max-width: 70%;
  --el-calendar-cell-width: 60px;
}

:deep(.el-calendar__header),
:deep(.el-calendar__body) {
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
}

:deep(.el-calendar-table) {
  thead {
    background-color: var(--secondary-purple);
    th {
      color: #fff;
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
  background-color: #faf7fb;
}

:deep(.calendar-cell.active) {
  color: var(--primary-purple);
  font-weight: 600;
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
