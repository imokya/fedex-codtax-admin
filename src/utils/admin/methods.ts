import { ElMessage } from 'element-plus';

export function showSuccessMessage(message: string) {
  ElMessage({
    message,
    type: 'success',
  });
}

export function showErrorMessage(message: string) {
  ElMessage({
    message,
    type: 'error',
  });
}

export function showMessage(message: string, type: 'success' | 'fail') {
  ElMessage({
    message,
    type: type as any,
  });
}

export function downloadFile(blob: any, filename: string) {
  const downloadURL = (window.URL || window.webkitURL).createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function disabledReportDate(time: Date) {
  const now = new Date();
  const min = new Date(now);
  min.setMonth(min.getMonth() - 13);
  return time.getTime() < min.getTime();
};

export function disabledChatDate(time: Date) {
  const now = new Date();
  const min = new Date(now);
  min.setMonth(min.getMonth() - 12);
  return time.getTime() < min.getTime();
};
