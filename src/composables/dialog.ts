import useModalStore from "stores/modal";
import YesNoModal from "src/components/dialog/YesNoModal.vue";
import { useI18n } from "vue-i18n";

export function useDialog() {
  const { t } = useI18n();
  const modal = useModalStore();

  const yesNoDialog = (title: string, message: string, lcallback: (arg0: boolean) => void) => {
    const customDialog = YesNoModal;
    const customDialogProps = {
      title: title,
      message: message
    };
    const actions = [
      {
        label: t('yes'),
        callback: () => {
          lcallback(true)
          modal.close();
        },
      },
      {
        label: t('no'),
        callback: () => {
          lcallback(false)
          modal.close();
        },
      },
    ];

    const dialog = {
      init: () => modal.init(customDialog, actions, customDialogProps),
      open: () => modal.open()
    }
    return dialog;
  }

  return { yesNoDialog }
}
