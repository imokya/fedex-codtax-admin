<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/admin';

const store = useAppStore();
const icon = computed(() => {
  return store.sidebarOpened ? 'hamburger-opened' : 'hamburger-closed';
});
const toggleClick = () => {
  store.toggleSidebarOpen();
};
</script>

<template>
  <div class="hamburger-container" @click="toggleClick">
    <svg-icon class="hamburger" :icon="icon"></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-container {
  cursor: pointer;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}

