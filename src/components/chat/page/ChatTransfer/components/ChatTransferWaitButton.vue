<script setup lang="ts"></script>

<template>
  <div class="transfer-wait-button">
    <svg-icon icon="chat-hand" style="width: 22px; height: 22px" />转接等待
  </div>
</template>

<style lang="scss" scoped>
.transfer-wait-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 139px;
  height: 48px;
  color: #fff;
  background-color: var(--primary-purple);
  border-radius: 24px;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}
</style>
