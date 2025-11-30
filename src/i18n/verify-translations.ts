/**
 * Translation Verification Utility
 * This script helps verify that all translation keys exist in both languages
 */

import en from '../locales/en'
import es from '../locales/es'

type TranslationObject = Record<string, string | TranslationObject>

/**
 * Gets all keys from a nested object
 */
function getAllKeys(obj: TranslationObject, prefix = ''): string[] {
	const keys: string[] = []

	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key

		if (typeof value === 'object' && value !== null) {
			keys.push(...getAllKeys(value as TranslationObject, fullKey))
		} else {
			keys.push(fullKey)
		}
	}

	return keys
}

/**
 * Compares two sets of translation keys
 */
function compareTranslations() {
	const enKeys = new Set(getAllKeys(en))
	const esKeys = new Set(getAllKeys(es))

	const missingInEnglish = [...esKeys].filter((key) => !enKeys.has(key))
	const missingInSpanish = [...enKeys].filter((key) => !esKeys.has(key))

	console.log('🔍 Translation Verification Results:\n')

	if (missingInEnglish.length === 0 && missingInSpanish.length === 0) {
		console.log('✅ All translations are complete!')
		console.log(`📊 Total keys: ${enKeys.size}`)
		return true
	}

	if (missingInEnglish.length > 0) {
		console.log('❌ Missing in English:')
		missingInEnglish.forEach((key) => console.log(`  - ${key}`))
		console.log()
	}

	if (missingInSpanish.length > 0) {
		console.log('❌ Missing in Spanish:')
		missingInSpanish.forEach((key) => console.log(`  - ${key}`))
		console.log()
	}

	console.log(`📊 English keys: ${enKeys.size}`)
	console.log(`📊 Spanish keys: ${esKeys.size}`)

	return false
}

/**
 * Gets translation statistics
 */
export function getTranslationStats() {
	const enKeys = getAllKeys(en)
	const esKeys = getAllKeys(es)

	return {
		english: enKeys.length,
		spanish: esKeys.length,
		complete: enKeys.length === esKeys.length,
	}
}

// Run verification if executed directly
if (require.main === module) {
	compareTranslations()
}

export default compareTranslations

