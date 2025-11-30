import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { colors, borderRadius } from '../../constants/theme'

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
				mode === 'contained' && styles.contained,
				mode === 'outlined' && styles.outlined,
				style,
			]}
			labelStyle={[
				styles.label,
				mode === 'outlined' && styles.outlinedLabel,
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
	contained: {
		backgroundColor: colors.accent,
	},
	outlined: {
		borderColor: colors.accent,
		borderWidth: 2,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	outlinedLabel: {
		color: colors.accent,
	},
	content: {
		paddingVertical: 8,
	},
})

