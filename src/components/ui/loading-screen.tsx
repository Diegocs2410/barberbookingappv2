import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { colors } from '../../constants/theme'

interface LoadingScreenProps {
	message?: string
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={colors.accent} />
			<Text style={styles.message}>{message}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	message: {
		marginTop: 16,
		color: colors.textSecondary,
		fontSize: 16,
	},
})

