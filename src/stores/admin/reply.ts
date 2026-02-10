import { defineStore } from 'pinia';

import type { InstantReply } from '@/types/chat';
import { MAX_REPLY_FOLDER, MAX_REPLY_PER_FOLDER } from '@/constants/chat';
import { showAlert } from '@/utils/methods';

const replyData: InstantReply[] = [];

type DIALOG_MODE = 'add' | 'edit';

export const useReplyStore = defineStore('replyStore', {
  state: () => ({
    data: replyData as InstantReply[],
    replyMessageDialogVisible: false,
    replyFolderDialogVisible: false,
    selectedFolderId: '',
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

    setSelectedFolderId(payload: string) {
      this.selectedFolderId = payload;
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

  getters: {
    currentFolderData(state) {
      return state.data.find((item) => item.id === state.selectedFolderId)
        ?.children;
    },
    currentFolderId(state) {
      return state.data.find((item) => item.id === state.selectedFolderId)?.id;
    },
    currentFolderName(state) {
      return state.data.find((item) => item.id === state.selectedFolderId)
        ?.text;
    },
  },
});
