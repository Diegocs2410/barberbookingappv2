import { useState, useCallback } from 'react'
import i18n from '../i18n'

type SupportedLocale = 'en' | 'es'

/**
 * Custom hook for internationalization
 * @returns Translation function and locale management utilities
 */
export function useTranslation() {
	const [locale, setLocaleState] = useState<SupportedLocale>(
		i18n.locale.startsWith('es') ? 'es' : 'en'
	)

	/**
	 * Translates a key to the current locale
	 * @param key - The translation key (e.g., 'auth.login.title')
	 * @param params - Optional parameters for interpolation
	 */
	const t = useCallback((key: string, params?: Record<string, string | number>) => {
		return i18n.t(key, params)
	}, [])

	/**
	 * Changes the app locale
	 * @param newLocale - The new locale to set ('en' or 'es')
	 */
	const setLocale = useCallback((newLocale: SupportedLocale) => {
		i18n.locale = newLocale
		setLocaleState(newLocale)
	}, [])

	return {
		t,
		locale,
		setLocale,
		isSpanish: locale === 'es',
		isEnglish: locale === 'en',
	}
}

