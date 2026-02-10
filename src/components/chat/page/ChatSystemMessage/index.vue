<script setup lang="ts">
interface Props {
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: '2024-12-13 12:00',
});
</script>

<template>
  <div class="system-message" v-html="props.message"></div>
</template>

<style lang="scss" scoped>
.system-message {
  align-self: center;
  max-width: 60%;
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
  margin-top: 5px;
  margin-bottom: -10px;
}
</style>
