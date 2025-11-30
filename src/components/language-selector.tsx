import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from '../hooks'
import { colors, spacing, borderRadius } from '../constants/theme'
import { Card } from './ui'

/**
 * Language selector component
 * Allows users to switch between Spanish and English
 */
export function LanguageSelector() {
	const { t, locale, setLocale } = useTranslation()

	const languages = [
		{ code: 'es' as const, name: 'Español', flag: '🇨🇴' },
		{ code: 'en' as const, name: 'English', flag: '🇺🇸' },
	]

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{t('owner.settings.language')}</Text>
			<View style={styles.options}>
				{languages.map((lang) => (
					<Pressable
						key={lang.code}
						onPress={() => setLocale(lang.code)}
						style={({ pressed }) => [pressed && styles.pressed]}
					>
						<Card
							style={[
								styles.languageCard,
								locale === lang.code && styles.selectedCard,
							]}
						>
							<Text style={styles.flag}>{lang.flag}</Text>
							<Text
								style={[
									styles.languageName,
									locale === lang.code && styles.selectedText,
								]}
							>
								{lang.name}
							</Text>
							{locale === lang.code && (
								<Ionicons name="checkmark-circle" size={24} color={colors.accent} />
							)}
						</Card>
					</Pressable>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.md,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	options: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	languageCard: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing.md,
		gap: spacing.sm,
		borderWidth: 2,
		borderColor: colors.border,
	},
	selectedCard: {
		borderColor: colors.accent,
		backgroundColor: colors.surfaceVariant,
	},
	flag: {
		fontSize: 24,
	},
	languageName: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.textSecondary,
	},
	selectedText: {
		color: colors.textPrimary,
		fontWeight: '600',
	},
	pressed: {
		opacity: 0.7,
	},
})

