import { Emitter } from 'mitt';
import { inject } from 'vue';

declare const document: any;

export const getEmitter = (): Emitter<any> => {
  const emitter = inject('emitter') as Emitter<any>;
  return emitter;
};
