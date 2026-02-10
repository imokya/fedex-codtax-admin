import { Message, MessageType } from '@/types/chat';
import dayjs, { Dayjs } from 'dayjs';

// import utc from 'dayjs/plugin/utc.js';
// import timezone from 'dayjs/plugin/timezone.js';
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Shanghai');

const MAX_TIME_INTERVAL = 5;

export const insertSystemTime = (
  messages: Message[],
  baseTime: Dayjs = dayjs()
): Message[] => {
  const result: Message[] = [];
  // 按时间排序，最新的消息在下面
  // messages.sort((a:Message, b:Message) => Number(a.time) - Number(b.time))
  messages.forEach((item: Message) => {
    const chatTime = dayjs(item.time);
    const diff = baseTime.diff(chatTime, 'minute');
    //if (Math.abs(diff) > MAX_TIME_INTERVAL) {
    if (item.type === MessageType.SYSTEM) {
      result.push({
        type: MessageType.SYSTEM,
        message: formatChatTime(item.time),
      });
    }
    // }
    result.push(item);
    baseTime = chatTime;
  });

  return result;
};

export const formatChatTime = (_chatTime: any, short: boolean = false) => {
  const chatTime = dayjs(_chatTime);
  const fullTime = short
    ? chatTime.format('MM-DD HH:mm')
    : chatTime.format('YYYY-MM-DD HH:mm:ss');
  return fullTime;
};

// export const formatChatTime = (_chatTime: any, short: boolean = false) => {
//   const chatTime = dayjs(_chatTime);
//   const isToday = chatTime.isSame(dayjs(), 'day');
//   const fullTime = short
//     ? chatTime.format('MM-DD HH:mm')
//     : chatTime.format('YYYY-MM-DD HH:mm');
//   return isToday ? chatTime.format('HH:mm') : fullTime;
// };
