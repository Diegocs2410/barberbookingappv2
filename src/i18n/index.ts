import { I18n } from 'i18n-js'
import * as Localization from 'expo-localization'
import en from './locales/en'
import es from './locales/es'

const i18n = new I18n({
	en,
	es,
})

// Set the locale once at the beginning of your app
// Get the device locale and extract language code
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'es'
i18n.locale = deviceLocale
i18n.enableFallback = true
i18n.defaultLocale = 'es'

export default i18n

