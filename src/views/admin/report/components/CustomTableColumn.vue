<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  propName: string;
  tooltip: string;
  minWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <el-table-column :min-width="props.minWidth || 200">
    <template #header>
      <div class="custom-header">
        <div class="custom-header-left">
          <div class="custom-header-title">{{ props.title }}</div>
          <div class="custom-header-subtitle">{{ props.subtitle }}</div>
        </div>
        <div class="custom-header-right">
          <el-tooltip
            :content="props.tooltip"
            placement="bottom"
            effect="customized"
          >
            <svg-icon icon="admin-exclaim" />
          </el-tooltip>
        </div>
      </div>
    </template>
    <template #default="scope">
      <div v-if="$slots.default">
        <!-- {{
          props.isTime
            ? dayjs(scope.row[props.propName]).format('YYYY-MM-DD HH:mm:ss')
            : scope.row[props.propName]
        }} -->
        <slot :data="scope"></slot>
      </div>
      <div v-else>
        {{ scope.row[props.propName] }}
      </div>
    </template>
  </el-table-column>
</template>

<style lang="scss" scoped>
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  overflow: hidden;

  &-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &-right {
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
      fill: #007ab7;
    }
  }
  &-title {
    font-size: 14px;
    color: #4e5969;
  }
  &-subtitle {
    font-size: 11px;
    color: #4e5969;
    font-weight: normal;
  }
}
</style>
