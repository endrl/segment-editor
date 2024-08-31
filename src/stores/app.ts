// Utilities
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useLocales } from 'src/composables/locales'

export const useAppStore = defineStore('app', () => {
  const $q = useQuasar()
  const { handleLocaleChange, SUPPORTED_LOCALES } = useLocales()

  const selectedLocale = ref('auto')
  const themeIndex = ref(1)
  const showVideoPlayer = ref(true)
  const enableEdl = ref(true)

  const setTheme = () => {
    if (!themeIndex.value) {
      $q.dark.set('auto')
    } else {
      $q.dark.set(themeIndex.value == 1)
    }
  }

  // watch user theme changes
  watch(themeIndex, setTheme)

  // locale handling
  const setLocale = () => {
    handleLocaleChange(selectedLocale.value)
  }
  // watch user lang changes
  watch(selectedLocale, setLocale)

  return { selectedLang: selectedLocale, themeIndex, showVideoPlayer, enableEdl, setTheme, setLocale, SUPPORTED_LOCALES }
})
