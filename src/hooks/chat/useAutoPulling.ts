import ChatService from '@/services/chat/chat.service';
import { AUTO_PULLING_INTERVAL } from '@/constants/chat';
import { useChatStore } from '@/stores/chat';
import { useStaffStore } from '@/stores/chat/staff';
import { StaffStatus } from '@/types/chat';
import { goLogin } from '@/utils/methods';
import { clearLoginInfo, showError } from '@/utils/methods';

export default function () {
  let id: any;
  const chatStore = useChatStore();
  const staffStore = useStaffStore();
  let loginStatus: StaffStatus;
  let tryCount = 0
  const pullData = async () => {
    try {
      const { data: result } = await ChatService.refresh();
      chatStore.setNumInQueue(result.waitingCount);
      staffStore.setStatus(result.loginStatus);
      loginStatus = result.loginStatus;
      tryCount = 0
    } catch (error) {
      if (tryCount > 2) {
        showError('服务出错');
        goLogin();
      }
      tryCount++
    } finally {
      // 如果是登出状态跳转到登陆页面
      if (loginStatus === StaffStatus.LOGOUT) {
        goLogin();
      } else {
        id = setTimeout(() => {
          pullData();
        }, AUTO_PULLING_INTERVAL * 1000);
      }
    }
  };

  const start = () => {
    pullData();
  };

  const stop = () => {
    clearTimeout(id);
  };

  return {
    start,
    stop,
  };
}
