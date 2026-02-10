<script setup lang="ts">
import { ref, computed } from 'vue';
import ChatType from './ChatType.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';

import { useUserStore } from '@/stores/admin/user';
import GlobalService from '@/services/admin/global.service';
import { API_Status } from '@/constants/api';
import { showSuccess } from '@/utils/methods';

interface Props {
  channel: string;
}

const props = defineProps<Props>();
const userStore = useUserStore();
const data = ref<any>({});
const chatOverRemindTime = ref(2);

const greeting1 = ref('');
const greeting2 = ref('');
const greetingLimit = 20
const greeting1Limit = computed(() => {
  const maxLength = greetingLimit - userStore.userInfo.name.length - 2
  return Math.max(maxLength - greeting2.value.length, 0);
});
const greeting2Limit = computed(() => {
  const maxLength = greetingLimit - userStore.userInfo.name.length - 2
  return Math.max(maxLength - greeting1.value.length, 0);
});
const getConfig = async () => {
  const { data: result } = await GlobalService.getConfig({
    configKey: 'GLOBAL',
    configKey2: props.channel,
  });

  data.value = result.configItems.reduce((a: any, b: any) => {
    a[b.configKey3] = b.configValue;
    return a;
  }, {});

  const greeting = data.value['WELCOME.MESSAGE.TEMPLATE'].split('[{0}]');

  greeting1.value = greeting[0]?.trim();
  greeting2.value = greeting[1]?.trim();
};

const handleSave = async () => {
  data.value[
    'WELCOME.MESSAGE.TEMPLATE'
  ] = `${greeting1.value} [{0}] ${greeting2.value}`;

  const newData = Object.keys(data.value).map((key: string) => {
    return {
      configKey: 'GLOBAL',
      configKey2: props.channel,
      configKey3: key,
      configValue: data.value[key],
    };
  });

  const { status } = await GlobalService.saveConfig({
    configItems: newData,
  });
  if (status === API_Status.SUCCESS) {
    showSuccess('保存成功');
  }
};

getConfig();
</script>
<template>
  <div>
    <el-card>
      <el-scrollbar class="scrollbar">
        <!-- <div class="group">
          <div class="group-title">最大客户数</div>
          <div class="group-content">
            <el-input-number v-model="maxUserNum" :min="1" :max="10" />
          </div>
        </div> -->

        <div class="group-wrap flex gap-10 w-[70%]">
          <div class="group flex-shrink-0 w-[70%]">
            <div class="group-title">欢迎语文案（字符限制1-20个）</div>
            <div class="group-content text-[12px] flex items-center gap-4">
              <el-input v-model="greeting1" placeholder="请输入文案" class="flex-shrink-0 flex-1"
                :maxlength="greeting1Limit" />

              <div class="text-[#8e8e8e] px-4 py-2 bg-[#f2f2f2] flex-shrink-0 w-[102px]">
                + <span>客服工号</span> +
              </div>
              <el-input v-model="greeting2" placeholder="请输入文案" class="flex-shrink-0 flex-1"
                :maxlength="greeting2Limit" />
            </div>
          </div>

          <div class="group flex-shrink-0">
            <div class="group-title">实时预览</div>
            <div class="group-content text-[12px] flex items-center gap-4 text-[#262626] bg-[#f8f8f8] px-4 py-2">
              <div class="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis" v-html="greeting1"></div>
              <div class="bg-[#e3e3e3] px-[10px]">
                {{ userStore.userInfo.name }}
              </div>
              <div class="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis" v-html="greeting2"></div>
            </div>
          </div>
        </div>

        <div class="group w-[70%]">
          <div class="group-title">结束语</div>
          <div class="group-content">
            <el-input type="textarea" v-model="data['SURVEY.MESSAGE']" maxlength="100" placeholder="请输入100字以内文案" />
          </div>
        </div>

        <div class="group flex gap-4 w-[70%]">
          <div class="w-[200px]">
            <div class="group-subtitle text-[12px] mb-[5px]">
              <span class="font-bold">客户渠道内</span>等待N分钟<span class="text-[10px]">(同时超过3人排队)</span>
            </div>
            <div class="group-content">
              <el-input-number v-model="data['PIPELINE.COUNTDOWN.WAIT.MINUTES']" :min="0.1" :step="0.1" class="w-full">
                <template #suffix>
                  <span>分钟</span>
                </template>
              </el-input-number>
            </div>
          </div>
          <div class="flex-1">
            <div class="group-subtitle text-[12px] mb-[5px]">发送的文案</div>
            <div class="group-content flex">
              <el-input v-model="data['PIPELINE.COUNTDOWN.PUSH.MESSAGE']" placeholder="请输入文案"></el-input>
            </div>
          </div>
        </div>

        <div class="group flex gap-4 w-[70%]">
          <div class="w-[200px]">
            <div class="group-subtitle text-[12px] mb-[5px]">
              <span class="font-bold">客服断线后</span>N分钟
            </div>

            <div class="group-content">
              <el-input-number v-model="data['EMPLOYEE.DISCONNECTED.COUNTDOWN.WAIT.MINUTES']" :min="0.1" :step="0.1"
                class="w-full">
                <template #suffix>
                  <span>分钟</span>
                </template>
              </el-input-number>
            </div>
          </div>
          <div class="flex-1">
            <div class="group-subtitle text-[12px] mb-[5px]">发送的文案</div>
            <div class="group-content flex">
              <el-input v-model="data['EMPLOYEE.DISCONNECTED.PUSH.MESSAGE']" placeholder="请输入文案"></el-input>
            </div>
          </div>
        </div>

        <div class="group flex gap-4 w-[70%]">
          <div class="w-[200px]">
            <div class="group-subtitle text-[12px] mb-[5px]">
              <span class="font-bold">客户N分钟后</span>未回复消息
            </div>
            <div class="group-content">
              <el-input-number v-model="data['USER.INACTIVE.COUNTDOWN.WAIT.MINUTES']" :min="0.1" :step="0.1"
                class="w-full">
                <template #suffix>
                  <span>分钟</span>
                </template>
              </el-input-number>
            </div>
          </div>
          <div class="flex-1">
            <div class="group-subtitle text-[12px] mb-[5px]">
              发送的文案（字符限制1-20个）
            </div>
            <div class="group-content flex">
              <el-input v-model="data['USER.INACTIVE.PUSH.MESSAGE']" placeholder="请输入文案" maxlength="20"></el-input>
            </div>
          </div>
        </div>

        <div class="group w-[70%]">
          <div class="group-title">
            N分钟又1分钟后，自动结束发送的文案（字符限制1-20个）
          </div>
          <div class="group-content">
            <el-input type="textarea" v-model="data['USER.DISCONNECTED.PUSH.MESSAGE']" class="flex-1" maxlength="20" />
          </div>
        </div>

        <chat-type v-model="data['ADVICE.TYPE']" />
        <div class="flex justify-end pb-5 mt-[50px] w-[70%]">
          <common-button type="primary" class="button-confirm" @click="handleSave">保存</common-button>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  display: flex;
  flex: 1;
  margin-bottom: 0;
}

.group {
  margin-bottom: 20px;

  &-content {
    min-height: 38px;
  }

  &-title {
    font-size: 12px;
    margin-bottom: 5px;
  }
}
</style>
