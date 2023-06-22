import { createI18n } from 'vue-i18n'

import en from '@/locales/en.yaml'
import de from '@/locales/de.yaml'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    de: de
  },
})
