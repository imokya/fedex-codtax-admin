<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emits = defineEmits<{
  (e: 'change', value: string): void;
}>();

const route = useRoute();
const router = useRouter();

const breadcrumbData = ref<any[]>([]);
const currentTitle = ref('欢迎回来');

const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter(
    (item) => item.meta && item.meta.title
  );
  const lastIndex = breadcrumbData.value.length - 1;
  currentTitle.value = breadcrumbData.value[lastIndex]?.meta?.title;
  emits('change', currentTitle.value);
};

watch(
  route,
  () => {
    getBreadcrumbData();
  },
  {
    immediate: true,
  }
);

const handleClick = (item: any) => {
  //router.push(item.path);
};
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbData"
      :key="item.path"
    >
      <span v-if="index === 0" class="home"
        >{{ item.meta.group }}
        <span style="font-weight: bold; padding: 0 10px 0 5px">/</span>
      </span>
      <span class="no-redirect" v-if="index === breadcrumbData.length - 1">{{
        item.meta.title
      }}</span>
      <span class="redirect" v-else @click="handleClick(item)">{{
        item.meta.title
      }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
}
.home {
  color: var(--text-color);
  font-weight: 600;
}
.redirect {
  cursor: pointer;
  color: var(--text-color);
  font-weight: 600;
  &:hover {
    color: var(--primary-purple);
  }
}
.no-redirect {
  color: var(--text-color);
  cursor: text;
}
</style>
