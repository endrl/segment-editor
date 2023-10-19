// stores/modal.ts

import { markRaw } from 'vue';
import { defineStore } from 'pinia';

export type Modal = {
  isOpen: boolean,
  view: object,
  actions?: ModalAction[],
  viewProps?: object,
};

export type ModalAction = {
  label: string,
  callback: (props?: any) => void,
};

export const useModalStore = defineStore('modal', {
  state: (): Modal => ({
    isOpen: false,
    view: {},
    actions: [],
    viewProps: {}
  }),
  actions: {
    init(view: object, actions?: ModalAction[], props?: object) {
      this.actions = actions;
      // using markRaw to avoid over performance as reactive is not required
      this.view = markRaw(view);
      this.viewProps = props;
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.view = {};
      this.actions = [];
      this, this.viewProps = {};
    },
  },
  persist: false,
});

export default useModalStore;
