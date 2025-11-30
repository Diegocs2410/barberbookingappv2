import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation, useThemeColors } from '../hooks'
import { spacing, borderRadius } from '../constants/theme'

/**
 * Componente selector de idioma
 * Permite cambiar entre español e inglés con soporte para temas
 */
export function LanguageSelector() {
	const { t, locale, setLocale } = useTranslation()
	const { colors } = useThemeColors()

	const languages = [
		{ code: 'es' as const, name: 'Español', flag: '🇨🇴' },
		{ code: 'en' as const, name: 'English', flag: '🇺🇸' },
	]

	return (
		<View style={styles.container}>
			<Text style={[styles.label, { color: colors.textSecondary }]}>
				{t('owner.settings.language')}
			</Text>
			<View style={styles.options}>
				{languages.map((lang) => (
					<Pressable
						key={lang.code}
						onPress={() => setLocale(lang.code)}
						style={({ pressed }) => [
							styles.languageOption,
							{
								borderColor: locale === lang.code ? colors.primary : colors.border,
								backgroundColor: locale === lang.code ? colors.surfaceVariant : colors.surface,
							},
							pressed && styles.pressed,
						]}
					>
						<Text style={styles.flag}>{lang.flag}</Text>
						<Text
							style={[
								styles.languageName,
								{
									color: locale === lang.code ? colors.textPrimary : colors.textSecondary,
									fontWeight: locale === lang.code ? '600' : '500',
								},
							]}
						>
							{lang.name}
						</Text>
						{locale === lang.code && (
							<Ionicons name="checkmark-circle" size={20} color={colors.primary} />
						)}
					</Pressable>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.sm,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: spacing.sm,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	options: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	languageOption: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing.md,
		gap: spacing.sm,
		borderWidth: 1.5,
		borderRadius: borderRadius.lg,
	},
	flag: {
		fontSize: 20,
	},
	languageName: {
		fontSize: 14,
	},
	pressed: {
		opacity: 0.7,
		transform: [{ scale: 0.98 }],
	},
})
