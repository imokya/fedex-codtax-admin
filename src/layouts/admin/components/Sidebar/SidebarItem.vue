<script setup lang="ts">
import { ref, inject } from 'vue';
import MenuItem from './MenuItem.vue';

interface Props {
  route: any;
}
const props = defineProps<Props>();
const groupName = ref('');
const groups = inject('groups') as [];

const displayGroup = (group: string) => {
  const index = groups.findIndex((item) => item === group);
  if (index !== -1) {
    groups.splice(index, 1);
    return group;
  }
  return '';
};
groupName.value = displayGroup(props.route.meta?.group);
</script>

<template>
  <div v-if="groupName" class="group-name">
    {{ groupName }}
  </div>
  <el-sub-menu v-if="route.children.length > 0" :index="route.path">
    <template #title>
      <menu-item :title="route.meta.title" :icon="route.meta.icon"></menu-item>
    </template>
    <!-- 循环渲染 -->
    <sidebar-item
      v-for="item in route.children"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-sub-menu>
  <el-menu-item v-else :index="route.path">
    <menu-item
      :title="route.meta.title"
      :icon="route.meta.icon"
      :hide-icon="route.meta.hideIcon !== undefined"
    ></menu-item>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.group-name {
  font-size: 14px;
  color: var(--primary-purple);
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 20px;
}
</style>
