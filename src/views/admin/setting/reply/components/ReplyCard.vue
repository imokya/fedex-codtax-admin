<script setup lang="ts">
export interface ReplyCardProps {
  id: string;
  text: string;
  active: boolean;
}

const props = defineProps<ReplyCardProps>();

const emits = defineEmits<{
  (e: 'remove', data: ReplyCardProps): void;
  (e: 'edit', id: string): void;
  (e: 'active'): void;
  (e: 'deactive'): void;
}>();
</script>

<template>
  <el-tooltip :content="props.text" :disabled="true" effect="customized">
    <div
      class="reply-card"
      @mouseenter="emits('active')"
      @mouseleave="emits('deactive')"
    >
      <div class="reply-card-normal" v-if="!props.active">
        {{ props.text }}
      </div>
      <div class="reply-card-edit" v-else>
        <div class="reply-card-edit-text" :title="props.text">
          {{ props.text }}
        </div>
        <div class="reply-card-edit-action">
          <div
            title="删除回复"
            class="reply-card-edit-action__delete cursor-pointer"
            @click.stop="emits('remove', props)"
          >
            <svg-icon icon="chat-remove"></svg-icon>
          </div>
          <div
            title="编辑回复"
            class="reply-card-edit-action__edit cursor-pointer"
            @click.stop="emits('edit', props.id)"
          >
            <svg-icon icon="chat-edit"></svg-icon>
          </div>
        </div>
      </div>
      <!-- <div class="reply-card-drag-status" v-if="props.active">
        <svg-icon
          icon="chat-movable"
          style="width: 10px; height: 10px"
        ></svg-icon>
      </div> -->
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';

.reply-card {
  user-select: none;
  position: relative;

  &-drag-status {
    width: 10px;
    height: 10px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    margin: 0 auto;
  }
  &-edit {
    box-sizing: border-box;
    padding: 10px;

    font-size: 14px;
    max-width: 100%;
    background-color: #f2f2f2;
    position: relative;
    overflow: hidden;

    &-action {
      width: 120px;
      height: 100%;
      color: var(--primary-purple);
      background-color: #f2f2f2;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      padding: 0 10px;

      &__send {
        font-size: 12px;
        color: #fff;
        background-color: var(--primary-orange);
        padding: 2px 10px;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &-text {
      max-width: 100%;
      @include mixins.ellipsis;
      color: #333333;
    }
  }
  &-normal {
    box-sizing: border-box;
    background-color: #fafafa;
    padding: 10px;
    font-size: 14px;
    max-width: 100%;
    @include mixins.ellipsis;
  }
}
</style>
