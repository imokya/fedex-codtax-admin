<script setup lang="ts">
import SidebarHeader from '@/components/chat/page/SidebarHeader/index.vue';
import SidebarFooter from '@/components/chat/page/SidebarFooter/index.vue';
import SidebarMain from '@/components/chat/page/SidebarMain/index.vue';
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <sidebar-header />
    </div>
    <div class="sidebar-main">
      <sidebar-main />
    </div>
    <div class="sidebar-footer">
      <sidebar-footer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-main {
    flex: 1;
  }
  &-footer {
    height: var(--chat-footer-height);
    margin-top: auto;
    border-top: 1px solid var(--frame-border-color);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-header {
    height: var(--chat-header-height) !important;
    background-color: #fff;
    border-bottom: 1px solid var(--frame-border-color);
    flex-shrink: 0;
  }
}
</style>
