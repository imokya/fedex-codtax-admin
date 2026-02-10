<script setup lang="ts">
import { computed, ref, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { filterRoutes, generateMenus } from '@/utils/route';
import SidebarItem from './SidebarItem.vue';
import { useAppStore } from '@/stores/admin';

const router = useRouter();
const route = useRoute();
const store = useAppStore();

const groups = ['后台管理', '数据报表'];
provide('groups', groups);

const routes = computed(() => {
  const filteredRoutes = filterRoutes(router.getRoutes());
  const routes = generateMenus(filteredRoutes);
  return routes.sort((a, b) => a.meta?.order - b.meta?.order);
});

const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

const opens = ref(['']);
</script>

<template>
  <el-menu
    :default-active="activeMenu"
    :unique-opened="true"
    :collapse="!store.sidebarOpened"
    :default-openeds="opens"
    router
  >
    <sidebar-item
      v-for="item in routes"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-menu>
</template>
