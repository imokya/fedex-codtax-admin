<script setup lang="ts">
import { ref } from 'vue';
import Hamburger from '@/components/admin/Hamburger/index.vue';
import Breadcrumb from '@/components/admin/Breadcrumb/index.vue';
import UserService from '@/services/admin/user.service';
import styles from './index.module.scss';

const title = ref('欢迎回来');

const handleChange = (e: string) => {
  if (e) {
    title.value = e;
  }
};
</script>

<template>
  <div :class="styles['navbar']">
    <!-- 汉堡开关 -->
    <!-- <hamburger :class="styles['hamburger-container']" /> -->
    <div class="title">{{ title }}</div>
    <div class="flex w-full">
      <breadcrumb
        :class="styles['breadcrumb-container']"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  color: var(--text-color);
}
</style>
