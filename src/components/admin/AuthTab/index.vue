<script setup lang="ts">
import { ref } from 'vue';

import ChannelService from '@/services/admin/channel.service';
import { useUserStore } from '@/stores/admin/user';

interface ChannelData {
  label: string;
  key: string;
}

interface Props {
  setting: any;
  staffOnly?: boolean; // 只显示IXP和DXP
}

const props = withDefaults(defineProps<Props>(), {
  staffOnly: false,
});

const data = ref<ChannelData[]>([]);
const activeName = ref<'IXP' | 'DXP'>('DXP');
const userStore = useUserStore();

const getChannelList = async () => {
  const userChannel = userStore.userInfo.channel;
  const { data: result } = await ChannelService.getList();
  let formatData = result?.channels?.map((item: any) => {
    return {
      label: `${item.name}人员`,
      key: item.name,
    };
  });

  if (userChannel !== 'ADM') {
    formatData = formatData.filter(
      (item: ChannelData) => item.key === userStore.userInfo.channel
    );
  }
  if (props.staffOnly) {
    formatData = formatData.filter(
      (item: ChannelData) => item.key === 'DXP' || item.key === 'IXP'
    );
  }
  data.value = formatData;
};

getChannelList();
</script>
<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane
        v-for="item in data"
        :label="item.label"
        :name="item.key"
        :key="item.key"
      >
        <component
          :is="props.setting"
          :channel="item.key"
          v-if="activeName === item.key"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
