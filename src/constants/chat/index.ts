export const STAFF_STATUS = 'staff_status';

// 轮询间隔时间
export const AUTO_PULLING_INTERVAL = 5;

// 会话自动结束时间, 单位分钟
export const CHAT_OVER_REMIND_INTERVAL = 1;
export const CHAT_OVER_INTERVAL = 1;

// 自动转接到下一个会话, 单位秒
export const CHAT_NEXT_INTERVAL = 3;

// 快捷回复
export const MAX_REPLY_FOLDER = 20;
export const MAX_REPLY_PER_FOLDER = 20;

// 客服最大连接数
export const MAX_CONNECTION = 10;

// 客服接受转接的最大时间，单位秒
export const MAX_PICKUP_TRANSFER_TIME = 60;

// 快捷回复字数限制
export const MAX_REPLY_FOLDER_LENGTH = 50;
export const MAX_REPLY_LENGTH = 400;

// 当前用户ID
export const CHAT_ID = 'chat_id';

export enum MessageType {
  USER = 0,
  EMPLOYEE = 4,
  PIPELINE = 2,
  SYSTEM = 3,
  CHATBOT = 1,
}

export enum PickupStatus {
  WAITING = 0, // 等待转接
  ACCEPTED = 1, // 接受转接
  DECLINED = 2, // 拒绝转接
}


