import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { useThemeColors } from '../../hooks'
import { borderRadius } from '../../constants/theme'

interface ButtonProps {
	children: React.ReactNode
	onPress: () => void
	mode?: 'contained' | 'outlined' | 'text'
	loading?: boolean
	disabled?: boolean
	icon?: string
	style?: ViewStyle
	fullWidth?: boolean
}

/**
 * Componente de botón reutilizable
 * Sigue el diseño monocromático de la app con soporte para temas
 */
export function Button({
	children,
	onPress,
	mode = 'contained',
	loading = false,
	disabled = false,
	icon,
	style,
	fullWidth = true,
}: ButtonProps) {
	const { colors, isDarkMode } = useThemeColors()

	const dynamicStyles = {
		contained: {
			backgroundColor: colors.primary,
		},
		outlined: {
			borderColor: colors.primary,
		},
		disabled: {
			backgroundColor: colors.border,
		},
		label: {
			color: isDarkMode ? '#000000' : '#ffffff',
		},
		outlinedLabel: {
			color: colors.primary,
		},
		textLabel: {
			color: colors.primary,
		},
		disabledLabel: {
			color: colors.textMuted,
		},
	}

	return (
		<PaperButton
			mode={mode}
			onPress={onPress}
			loading={loading}
			disabled={disabled || loading}
			icon={icon}
			style={[
				styles.button,
				fullWidth && styles.fullWidth,
				mode === 'contained' && dynamicStyles.contained,
				mode === 'outlined' && dynamicStyles.outlined,
				disabled && dynamicStyles.disabled,
				style,
			]}
			labelStyle={[
				styles.label,
				mode === 'contained' && dynamicStyles.label,
				mode === 'outlined' && dynamicStyles.outlinedLabel,
				mode === 'text' && dynamicStyles.textLabel,
				disabled && dynamicStyles.disabledLabel,
			]}
			contentStyle={styles.content}
		>
			{children}
		</PaperButton>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: borderRadius.lg,
	},
	fullWidth: {
		width: '100%',
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		letterSpacing: 0.3,
	},
	content: {
		paddingVertical: 8,
	},
})
