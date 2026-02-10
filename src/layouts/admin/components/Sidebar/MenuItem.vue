<script setup lang="ts">
interface Props {
  title: string;
  icon: string;
  hideIcon?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hideIcon: false,
});
</script>

<template>
  <div style="min-width: 16px" class="flex items-center">
    <svg-icon
      :icon="icon"
      style="width: 20px; height: 20px"
      v-if="!props.hideIcon"
    />
  </div>
  <span>{{ props.title }}</span>
</template>
