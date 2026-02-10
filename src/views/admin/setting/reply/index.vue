<script setup lang="ts">
import { onMounted, ref } from 'vue';

import ReplyFolder from './components/ReplyFolder.vue';
import ReplyList from './components/ReplyList.vue';
import { useReplyStore } from '@/stores/admin/reply';
import ReplyService from '@/services/chat/reply.service';

const replyStore = useReplyStore();
const showLoading = ref(true);

const getReplyData = async () => {
  try {
    const { data: result } = await ReplyService.getCategory('PUBLIC');

    if (result?.categories) {
      replyStore.setData(result?.categories);
      if (!replyStore.selectedFolderId) {
        replyStore.setSelectedFolderId(result?.categories[0]?.id);
      }
    }
  } finally {
    showLoading.value = false;
  }
};

const handleRefresh = () => {
  getReplyData();
};

onMounted(() => {
  getReplyData();
});
</script>

<template>
  <div class="reply-template">
    <div class="reply-folder"><reply-folder @refresh="handleRefresh" /></div>
    <div class="reply-list"><ReplyList @refresh="handleRefresh" /></div>
  </div>
</template>

<style lang="scss" scoped>
.reply-folder {
  width: 300px;
  height: 100%;
}
.reply-list {
  flex: 1;
  height: 100%;
  overflow: hidden;
}
.reply-template {
  display: flex;
  height: 100%;
}
</style>
