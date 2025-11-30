import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Text } from 'react-native-paper'
import { colors, borderRadius } from '../../constants/theme'

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

export function Avatar({ source, name, size = 'medium' }: AvatarProps) {
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
				},
			]}
		>
			<Text style={[styles.initials, { fontSize }]}>{initials}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	avatar: {
		backgroundColor: colors.surfaceVariant,
	},
	placeholder: {
		backgroundColor: colors.accent,
		justifyContent: 'center',
		alignItems: 'center',
	},
	initials: {
		color: colors.textPrimary,
		fontWeight: 'bold',
	},
})

