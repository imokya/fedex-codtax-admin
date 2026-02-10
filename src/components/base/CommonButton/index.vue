<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';

interface Props {
  type?: 'primary' | 'blue' | 'orange' | 'normal';
  plain?: boolean;
  link?: boolean;
  round?: boolean;
  inline?: boolean;
  disabled?: boolean;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'normal',
  plain: false,
  link: false,
  round: false,
  inline: false,
  disabled: false,
  loading: false,
});
</script>

<template>
  <div
    class="button"
    :class="[
      props.type,
      { disabled },
      { plain: props.plain },
      { link: props.link },
      { round: props.round },
      { inline: props.inline },
      { loading: props.loading },
    ]"
  >
    <div class="button-prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="button-loading" v-show="props.loading">
      <loading style="width: 18px; height: 18px" />
    </div>
    <slot></slot>
    <div class="button-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.button {
  padding: 8px 30px;
  background-color: #fff;
  border: 1px solid #c9cdd4;
  font-size: 16px;
  color: #424a61;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: relative;

  &-loading {
    margin-right: 2px;
    animation: rotate 2s linear infinite;
  }

  &.inline {
    display: inline-block !important;
  }

  &.link {
    border: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  &.loading {
    pointer-events: none;
  }

  &.plain {
    &:hover,
    &:focus {
      background-color: var(--plain-hover-color);
    }
  }

  &.round {
    border-radius: 24px;
  }

  &.disabled {
    color: var(--button-disabled-text-color) !important;
    cursor: default;
    pointer-events: none;

    .button-suffix {
      filter: grayscale(100%);
    }

    .button-prefix {
      filter: grayscale(100%);
    }

    &.button.primary {
      background-color: var(--button-disabled-bg-color) !important;
      border-color: transparent;
    }
    &.button.orange {
      background-color: var(--button-disabled-bg-color) !important;
      border-color: transparent;
    }
  }

  &.blue {
    color: var(--primary-blue);
    border-color: currentColor;
    &:hover,
    &:focus {
      color: var(--primary-blue-hover);
    }
  }

  &.orange {
    color: #fff;
    background-color: var(--primary-orange);
    &:hover,
    &:focus {
      background-color: var(--primary-orange-hover);
    }
  }

  &.primary {
    color: #fff;
    background-color: var(--primary-orange);
    &:hover,
    &:focus {
      background-color: var(--primary-orange-hover);
    }
  }
}
</style>
