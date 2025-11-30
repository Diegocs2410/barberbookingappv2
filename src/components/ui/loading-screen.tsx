import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { useThemeColors } from '../../hooks'
import { spacing } from '../../constants/theme'

interface LoadingScreenProps {
	message?: string
}

/**
 * Pantalla de carga reutilizable
 * Diseño minimalista monocromático con soporte para temas
 */
export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
	const { colors } = useThemeColors()

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<ActivityIndicator size="large" color={colors.primary} />
			<Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	message: {
		marginTop: spacing.md,
		fontSize: 16,
		fontWeight: '500',
	},
})
