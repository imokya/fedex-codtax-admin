<script setup lang="ts">
import Navbar from './components/Navbar/index.vue';
import Sidebar from './components/Sidebar/index.vue';
import AppMain from './components/AppMain/index.vue';
import AdminHeader from './components/AdminHeader/index.vue';
import { useAppStore } from '@/stores/admin';
import styles from './index.module.scss';

const store = useAppStore();
</script>

<template>
  <div
    class="admin-layout"
    :class="[
      styles['app-wrap'],
      store.sidebarOpened ? styles['open-sidebar'] : styles['hide-sidebar'],
    ]"
  >
    <admin-header />
    <!-- 左侧 menu -->
    <sidebar :class="styles['sidebar-container']" />
    <div :class="styles['main-container']">
      <!-- 顶部 navbar -->
      <div :class="styles['fixed-header']">
        <navbar />
      </div>
      <!-- 内容区 -->
      <app-main />
    </div>
  </div>
</template>
