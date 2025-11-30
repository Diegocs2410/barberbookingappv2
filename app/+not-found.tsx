import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { Link } from 'expo-router'
import { colors, spacing } from '../src/constants/theme'
import { Button } from '../src/components/ui'

export default function NotFoundScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>404</Text>
			<Text style={styles.subtitle}>Page Not Found</Text>
			<Text style={styles.description}>
				The page you're looking for doesn't exist.
			</Text>
			<Link href="/" asChild>
				<Button onPress={() => {}}>Go Home</Button>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
		padding: spacing.xl,
	},
	title: {
		fontSize: 72,
		fontWeight: 'bold',
		color: colors.accent,
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: 24,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	description: {
		fontSize: 16,
		color: colors.textSecondary,
		marginBottom: spacing.xl,
		textAlign: 'center',
	},
})

