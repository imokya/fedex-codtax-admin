<template>
  <div class="app-main">
    <div class="app-main-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 15px 20px 20px 20px;
  padding-top: calc(var(--navbar-height) + 10px);
  box-sizing: border-box;
  background-color: #f8f8f8;

  &-wrap {
    background-color: #fff;
    height: calc(100vh - var(--navbar-height) - 90px);
    overflow-y: auto;
  }
}
</style>
