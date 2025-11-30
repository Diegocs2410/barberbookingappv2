import React from 'react'
import { StyleSheet, View, ViewStyle, Pressable, StyleProp } from 'react-native'
import { useThemeColors } from '../../hooks'
import { borderRadius, spacing } from '../../constants/theme'

interface CardProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
	onPress?: () => void
	variant?: 'default' | 'elevated' | 'outlined'
}

/**
 * Componente de tarjeta reutilizable
 * Diseño minimalista con bordes sutiles y soporte para temas
 */
export function Card({
	children,
	style,
	onPress,
	variant = 'default',
}: CardProps) {
	const { colors, isDarkMode } = useThemeColors()

	const dynamicStyles = {
		card: {
			backgroundColor: colors.card,
			borderColor: colors.border,
		},
		elevated: {
			shadowColor: isDarkMode ? '#ffffff' : '#000000',
			shadowOpacity: isDarkMode ? 0.1 : 0.08,
		},
	}

	const cardStyle: StyleProp<ViewStyle> = [
		styles.card,
		dynamicStyles.card,
		variant === 'elevated' && [styles.elevated, dynamicStyles.elevated],
		variant === 'outlined' && styles.outlined,
		style,
	]

	const content = (
		<View style={cardStyle}>
			{children}
		</View>
	)

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					pressed && styles.pressed,
				]}
			>
				{content}
			</Pressable>
		)
	}

	return content
}

const styles = StyleSheet.create({
	card: {
		borderRadius: borderRadius.xl,
		padding: spacing.md,
		borderWidth: 1,
	},
	elevated: {
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 0,
	},
	outlined: {
		backgroundColor: 'transparent',
		borderWidth: 1,
	},
	pressed: {
		opacity: 0.7,
		transform: [{ scale: 0.98 }],
	},
})
