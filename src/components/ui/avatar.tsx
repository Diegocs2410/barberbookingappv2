import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Text } from 'react-native-paper'
import { useThemeColors } from '../../hooks'

interface AvatarProps {
	source?: string | null
	name: string
	size?: 'small' | 'medium' | 'large'
}

const SIZES = {
	small: 40,
	medium: 60,
	large: 100,
}

const FONT_SIZES = {
	small: 16,
	medium: 24,
	large: 40,
}

/**
 * Componente de avatar reutilizable
 * Muestra imagen o iniciales del usuario con soporte para temas
 */
export function Avatar({ source, name, size = 'medium' }: AvatarProps) {
	const { colors, isDarkMode } = useThemeColors()
	const dimension = SIZES[size]
	const fontSize = FONT_SIZES[size]

	// Get initials from name
	const initials = name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)

	if (source) {
		return (
			<Image
				source={{ uri: source }}
				style={[
					styles.avatar,
					{
						width: dimension,
						height: dimension,
						borderRadius: dimension / 2,
						backgroundColor: colors.surfaceVariant,
						borderColor: colors.border,
					},
				]}
			/>
		)
	}

	return (
		<View
			style={[
				styles.placeholder,
				{
					width: dimension,
					height: dimension,
					borderRadius: dimension / 2,
					backgroundColor: colors.primary,
					borderColor: colors.primary,
				},
			]}
		>
			<Text style={[styles.initials, { fontSize, color: isDarkMode ? '#000000' : '#ffffff' }]}>
				{initials}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	avatar: {
		borderWidth: 2,
	},
	placeholder: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
	},
	initials: {
		fontWeight: '600',
	},
})
