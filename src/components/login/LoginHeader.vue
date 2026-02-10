<script setup lang="ts"></script>

<template>
  <div class="login-header">
    <div class="login-header-inner w-[80%]">
      <div class="login-logo">
        <svg-icon icon="login-logo" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-header {
    width: 100%;
    height: 64px;
    background-color: var(--primary-purple);
    display: flex;
    align-items: center;
    justify-content: center;
    &-inner {
      max-width: 1600px;
    }
  }
  &-logo {
    svg {
      width: 82px;
      height: 23px;
    }
  }
}
</style>
