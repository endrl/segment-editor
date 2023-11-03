import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

// generate imports
const qLangList = import.meta.glob('../../node_modules/quasar/lang/*.mjs')
const i18nLangList = import.meta.glob('../i18n/locale/*.yaml')
const SUPPORTED_LOCALES = ['auto', 'en-US', 'fr', 'de']

export function useLocales() {
  const $q = useQuasar()
  const { locale, setLocaleMessage } = useI18n()

  /**
   * transform browser iso code to quasar locale isoCode ex. (de-DE to de)
   * @param isoCode code
   * @returns
   */
  const transformLocale = (isoCode: string) => {
    if (isoCode.includes('de')) {
      return 'de'
    }
    else if (isoCode.includes('fr')) {
      return 'fr'
    }
    return isoCode
  }

  /**
   * Set locale for Quasar and vue-i18n, will import translation file
   * @param lang auto or isoCode that matches quasar and src/locales file
   * @returns
   */
  const handleLocaleChange = (lang: string): string => {
    let langIso = lang == 'auto' ? $q.lang.getLocale() ?? 'en-US' : lang
    langIso = transformLocale(langIso)
    try {
      // quasar
      qLangList[`../../node_modules/quasar/lang/${langIso}.mjs`]().then(lang => {
        $q.lang.set(lang.default)
      })
      // vue-i18n
      // TODO we can track the imports to prevent import twice
      i18nLangList[`../i18n/locale/${langIso}.yaml`]().then(lang => {
        setLocaleMessage(langIso, lang.default)
      })
    } catch (error) {
      console.error(`Loading lang: ${langIso}`)
      langIso = 'en-US'
    }
    locale.value = langIso
    return langIso
  }

  return { handleLocaleChange, SUPPORTED_LOCALES }
}
