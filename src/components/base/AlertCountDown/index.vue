<script setup lang="ts">
import CommonButton from '@/components/base/CommonButton/index.vue';
import Popup from '@/components/base/Popup/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  title?: string;
  description?: string;
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  duration: 10
});

const emits = defineEmits(['confirm', 'close']);
const count = ref(props.duration)
const buttonText = ref('')
const disabled = ref(true)
let id: NodeJS.Timeout

const handleConfirm = () => {
  emits('confirm');
};

const handleClose = () => {
  emits('close');
};

const countDown = () => {
  count.value = count.value - 1
  if (count.value > 0) {
    buttonText.value = count.value + ' s'
    id = setTimeout(countDown, 1000)
  } else {
    buttonText.value = '确定'
    disabled.value = false
  }
}

const init = () => {
  buttonText.value = count.value + ' s'
  id = setTimeout(countDown, 1000)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  clearTimeout(id)
})
</script>

<template>
  <popup @close="handleClose">
    <div class="alert-panel flex flex-col justify-center items-center text-center">
      <div class="alert-icon">
        <svg-icon icon="chat-alert" style="width: 32px; height: 32px"></svg-icon>
      </div>
      <div class="alert-title">
        {{ props.title }}
      </div>
      <div class="alert-description">倒计时后重新刷新页面</div>
      <div class="alert-footer">
        <common-button @click="handleConfirm" type="primary" class="button-confirm" :disabled="disabled"
          style="width:120px;">
          {{ buttonText }} </common-button>
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.alert {
  &-footer {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }

  &-title {
    font-size: 20px;
    color: var(--text-color);
    margin-top: 20px;
  }

  &-description {
    font-size: 14px;
    color: var(--text-color);
    margin-top: 20px;
  }
}
</style>