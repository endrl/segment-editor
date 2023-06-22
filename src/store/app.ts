// Utilities
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useTheme, useLocale } from 'vuetify'


export const useAppStore = defineStore('app', () => {
  const theme = useTheme()
  const { current } = useLocale()

  const selectedLocale = ref('auto')
  const themeIndex = ref(1)
  const showVideoPlayer = ref(true)
  // Should match Vuetify lang codes and file name in src/locales/
  // https://vuetifyjs.com/en/features/internationalization/#supported-languages
  const SUPPORTED_LOCALES = ['auto', 'en', 'de']


  const setTheme = () => {
    if (!themeIndex.value) {
      theme.global.name.value = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    } else if (themeIndex.value == 1) {
      theme.global.name.value = 'dark'
    } else {
      theme.global.name.value = 'light'
    }
  }
  // watch for theme changes from browser
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    theme.global.name.value = event.matches ? "dark" : "light";
  });
  // watch user theme changes
  watch(themeIndex, setTheme)

  // locale handling
  const setLocale = () => {
    if (selectedLocale.value == 'auto') {
      current.value = navigator.language.includes('de') ? 'de' : 'en';
    } else {
      current.value = selectedLocale.value
    }
  }
  // watch user lang changes
  watch(selectedLocale, setLocale)

  return { selectedLang: selectedLocale, themeIndex, showVideoPlayer, setTheme, setLocale, SUPPORTED_LOCALES }
})
