<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';

const emits = defineEmits(['close']);
</script>

<template>
  <teleport to="body">
    <div class="popup">
      <div class="popup-panel" :class="$attrs.class">
        <div class="popup-panel-header">
          <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="popup-panel-close" @click="emits('close')">
          <svg-icon icon="chat-close" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &-panel {
    min-width: 600px;
    min-height: 320px;
    background-color: #fff;
    margin-top: -50px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    position: relative;

    &-header {
      margin-top: -20px;
      margin-bottom: 20px;
      font-size: 20px;
      color: var(--text-color);
    }

    &-close {
      cursor: pointer;
      position: absolute;
      top: 30px;
      right: 30px;
    }
  }
}
</style>
