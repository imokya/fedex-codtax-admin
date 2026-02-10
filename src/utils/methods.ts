import { createApp } from 'vue';
import { ElMessage } from 'element-plus';
import Confirm from '@/components/base/Confirm/index.vue';
import Alert from '@/components/base/Alert/index.vue';
import AlertCountDown from '@/components/base/AlertCountDown/index.vue'
import { ElLoading } from 'element-plus';
import { Emitter } from 'mitt';
import { inject } from 'vue';
import SuccessIcon from '@/components/icons/Success.vue';
import ErrorIcon from '@/components/icons/Error.vue';
import router from '@/routers';
import { resetRouter } from '@/routers';
import { useUserStore } from '@/stores/admin/user';
import { usePermissionStore } from '@/stores/admin/permission';
import { ConfirmDialog } from '@/types/chat';

/**
 * 判断是否是外部资源
 * @param path
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export const wait = (duration: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, duration);
  });
};

export const showConfirm = (options: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
}) => {
  const confirmInstance = createApp(Confirm, {
    title: options.title,
    description: options.description,
    confirmText: options.confirmText,
    cancelText: options.cancelText,
    onCancel: () => {
      if (options?.onCancel) {
        options.onCancel();
      }
      unMount();
    },
    onConfirm: () => {
      if (options?.onConfirm) {
        options.onConfirm();
      }
      unMount();
    },
    onClose: () => {
      if (options?.onClose) {
        options.onClose();
      }
      unMount();
    },
  });

  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  confirmInstance.mount(mountNode);

  const unMount = () => {
    confirmInstance && confirmInstance.unmount();
    if (mountNode.parentNode) {
      document.body.removeChild(mountNode);
    }
  };
};

export const showAlert = (options: {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}) => {
  const confirmInstance = createApp(Alert, {
    title: options.title,
    description: options.description || '',
    onConfirm: () => {
      if (options?.onConfirm) {
        options.onConfirm();
      }
      unMount();
    },
    onClose: () => {
      if (options?.onClose) {
        options.onClose();
      }
      unMount();
    },
  });
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  confirmInstance.mount(mountNode);

  const unMount = () => {
    confirmInstance.unmount();
    document.body.removeChild(mountNode);
  };
};

export const showCountDownAlert = (options: {
  title: string;
  description?: string;
  duration?: number;
  onConfirm?: () => void;
  onClose?: () => void;
}) => {
  const confirmInstance = createApp(AlertCountDown, {
    title: options.title,
    description: options.description || '',
    duration: options.duration,
    onConfirm: () => {
      if (options?.onConfirm) {
        options.onConfirm();
      }
      unMount();
    },
    onClose: () => {
      if (options?.onClose) {
        options.onClose();
      }
      unMount();
    },
  });
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  confirmInstance.mount(mountNode);

  const unMount = () => {
    confirmInstance.unmount();
    document.body.removeChild(mountNode);
  };
};

export function showSuccess(message: string) {
  ElMessage({
    message,
    type: 'success',
    icon: SuccessIcon,
    showClose: true,
  });
}

export function showError(message: string) {
  ElMessage.closeAll();
  ElMessage({
    message,
    type: 'error',
    icon: ErrorIcon,
    showClose: true,
  });
}

export function showLoading(
  message: string,
  target: string | HTMLElement = 'body'
) {
  const loading = ElLoading.service({
    lock: true,
    text: message,
    target,
  });
  return loading;
}

export function hideLoading(loading: any) {
  loading.close();
}

export const getEmitter = (): Emitter<any> => {
  const emitter = inject('emitter') as Emitter<any>;
  return emitter;
};

export const goLogin = () => {
  const loginURL = import.meta.env.VITE_LOGIN_URL as string;
  const logoutURL = import.meta.env.VITE_LOGOUT_URL as string;
  if (loginURL.startsWith('https')) {
    location.href = logoutURL;
  } else {
    router.replace(loginURL);
  }
};

export const clearLoginInfo = () => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  resetRouter();
  userStore.setToken('');
  userStore.setUserInfo('');
  permissionStore.setHasSetRoute(false);
};

export const hightLightKeywords = (message: string, keywrod: string) => {
  return message.replace(
    new RegExp(keywrod, 'g'),
    `<span class="text-highlight">${keywrod}</span>`
  );
};
