// 聊天消息
// export type messageType =
//   | 'staff'
//   | 'robot'
//   | 'user'
//   | 'system'
//   | 'time'
//   | 'typeSelect';

export enum MessageType {
  USER = 0,
  CHATBOT = 1,
  PIPELINE = 2,
  SYSTEM = 3,
  EMPLOYEE = 4,
  TIME = 5,
  TYPE_SELECT = 6,
  TRANSFER = 7,
}

export enum MediaType {
  TEXT = 0,
  IMAGE = 1,
  UNKNOWN = 5,
}

export type MessageStatus = 'success' | 'fail';
export interface Message {
  type: MessageType;
  receiverType?: MessageType;
  name?: string;
  message?: string;
  mediaType?: MediaType;
  time?: string | number;
  status?: MessageStatus;
  sendResult?: number;
  seq?: string; // 用于标识失败消息
}

// 聊天列表
export type ChatCardStatus = 'normal' | 'untag' | 'done';
// 用户状态
export enum UserStatus {
  STARTED = 0,
  TYPE_REQUIRED = 1,
  NOT_STARTED = 2,
  END = 3,
}

export interface ChatCardProps {
  userId: string | number;
  sessionId: string | number; // 会话id
  scopeId: string | number; // 跨客服id
  avatar?: string;
  userName: string;
  lastMsgContent?: string;
  lastMsgTime: string | number;
  sessionStatus: UserStatus;
  unreadCount: number;
}

// 快捷回复
export interface InstantReply {
  id: string;
  text: string;
  children?: InstantReply[];
}

//客服状态
export enum StaffStatus {
  ONLINE = 1,
  BUSY = 2,
  OFFLINE = 3,
  LOGOUT = 4,
}

// 转接
export interface TransferData {
  employeeId: string;
  status?: StaffStatus;
}

// 对话框
export interface ConfirmDialog {
  close: () => void;
}

// 忙碌转接请求
export interface TransferRequest {
  employeeId: string;
  transferMessage?: string;
  sessionId: string;
  scopeId: string;
  userId: string;
}
