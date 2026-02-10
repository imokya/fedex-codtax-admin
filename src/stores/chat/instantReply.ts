import { defineStore } from 'pinia';

import type { InstantReply } from '@/types/chat';
import { MAX_REPLY_FOLDER, MAX_REPLY_PER_FOLDER } from '@/constants/chat';
import { showAlert } from '@/utils/methods';

const replyData: InstantReply[] = [
  // {
  //   id: '1',
  //   text: '常用目录1',
  //   children: [
  //     {
  //       id: '1-1',
  //       text: '快捷回复1-1',
  //     },
  //     {
  //       id: '1-2',
  //       text: '快捷回复1-2',
  //     },
  //   ],
  // },
  // {
  //   id: '2',
  //   text: '常用目录2',
  //   children: [
  //     {
  //       id: '2-1',
  //       text: '快捷回复2-1',
  //     },
  //   ],
  // },
];

type DIALOG_MODE = 'add' | 'edit';

export const useInstantReplyStore = defineStore('instantReplyStore', {
  state: () => ({
    data: replyData as InstantReply[],
    publicData: [] as InstantReply[],
    replyMessageDialogVisible: false,
    replyFolderDialogVisible: false,
    mode: 'add' as DIALOG_MODE,
    messageId: '',
    folderId: '',
    message: '',
    folderName: '',
  }),
  actions: {
    setData(payload: InstantReply[]) {
      this.data = payload;
    },

    setPublicData(payload: InstantReply[]) {
      this.publicData = payload;
    },

    openMessageDialog(data: InstantReply, mode: DIALOG_MODE) {
      if (mode === 'add') {
        if (data!.children!.length >= MAX_REPLY_PER_FOLDER) {
          showAlert({
            title: `每个文件夹最多有${MAX_REPLY_PER_FOLDER}条回复`,
          });
          return;
        }
        this.message = '';
        this.mode = 'add';
        this.folderId = data.id;
      } else if (mode === 'edit') {
        this.message = data.text;
        this.mode = 'edit';
        this.messageId = data.id;
      }
      this.replyMessageDialogVisible = true;
    },

    openFolderDialog(data: any, mode: DIALOG_MODE) {
      if (mode === 'add') {
        this.folderName = '';
        this.mode = 'add';
      } else if (mode === 'edit') {
        console.log(data.id);
        this.folderName = data.text;
        this.mode = 'edit';
        this.folderId = data.id;
      }
      this.replyFolderDialogVisible = true;
    },

    showReplyMessageDialog(payload: boolean) {
      this.replyMessageDialogVisible = payload;
    },
    showReplyFolderDialog(payload: boolean) {
      this.replyFolderDialogVisible = payload;
    },
  },
});
