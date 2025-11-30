import React from 'react'
import { StyleSheet, View, ViewStyle, Pressable, StyleProp } from 'react-native'
import { colors, borderRadius, spacing } from '../../constants/theme'

interface CardProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
	onPress?: () => void
	variant?: 'default' | 'elevated'
}

export function Card({
	children,
	style,
	onPress,
	variant = 'default',
}: CardProps) {
	const cardStyle: StyleProp<ViewStyle> = [
		styles.card,
		variant === 'elevated' ? styles.elevated : undefined,
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
		backgroundColor: colors.card,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	elevated: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	pressed: {
		opacity: 0.8,
	},
})

