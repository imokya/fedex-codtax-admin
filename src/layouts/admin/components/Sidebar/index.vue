<script setup lang="ts">
import SidebarMenu from './SidebarMenu.vue';
import styles from './index.module.scss';
</script>

<template>
  <div class="sidebar">
    <el-scrollbar class="scrollbar">
      <sidebar-menu :class="styles['sidebar-menu']"></sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  padding-top: 10px;
  border-right: 1px solid #e3e3e3;
}

.scrollbar {
  flex: 1;
}

.user-panel-wrap {
  width: 100%;
  height: 140px;
  flex-shrink: 0;
}
</style>
