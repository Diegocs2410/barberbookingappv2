import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useTranslation } from '../../src/hooks'
import { Button, Card } from '../../src/components/ui'
import { colors, spacing, borderRadius } from '../../src/constants/theme'
import { UserRole } from '../../src/types'

interface RoleOption {
	role: UserRole
	titleKey: string
	descriptionKey: string
	icon: keyof typeof Ionicons.glyphMap
}

const ROLE_OPTIONS: RoleOption[] = [
	{
		role: 'customer',
		titleKey: 'auth.roleSelect.customer',
		descriptionKey: 'auth.roleSelect.customerDescription',
		icon: 'person-outline',
	},
	{
		role: 'owner',
		titleKey: 'auth.roleSelect.owner',
		descriptionKey: 'auth.roleSelect.ownerDescription',
		icon: 'business-outline',
	},
]

export default function RoleSelectScreen() {
	const { updateRole, isLoading, user } = useAuth()
	const { t } = useTranslation()
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

	const handleContinue = async () => {
		if (!selectedRole) return

		try {
			await updateRole(selectedRole)
			router.replace('/')
		} catch (err) {
			console.error('Error updating role:', err)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>
						{t('auth.roleSelect.title')}, {user?.name?.split(' ')[0]}!
					</Text>
					<Text style={styles.subtitle}>{t('auth.roleSelect.subtitle')}</Text>
				</View>

				<View style={styles.options}>
					{ROLE_OPTIONS.map((option) => (
						<Pressable
							key={option.role}
							onPress={() => setSelectedRole(option.role)}
							style={({ pressed }) => [pressed && styles.pressed]}
						>
						<Card
							style={{
								...styles.optionCard,
								...(selectedRole === option.role ? styles.selectedCard : {}),
							}}
							>
								<View style={styles.optionContent}>
									<View
										style={[
											styles.iconContainer,
											selectedRole === option.role && styles.selectedIconContainer,
										]}
									>
										<Ionicons
											name={option.icon}
											size={32}
											color={
												selectedRole === option.role
													? colors.textPrimary
													: colors.accent
											}
										/>
									</View>
									<View style={styles.optionText}>
										<Text style={styles.optionTitle}>{t(option.titleKey)}</Text>
										<Text style={styles.optionDescription}>
											{t(option.descriptionKey)}
										</Text>
									</View>
									<View style={styles.radioContainer}>
										<View
											style={[
												styles.radio,
												selectedRole === option.role && styles.radioSelected,
											]}
										>
											{selectedRole === option.role && (
												<View style={styles.radioInner} />
											)}
										</View>
									</View>
								</View>
							</Card>
						</Pressable>
					))}
				</View>

				<View style={styles.footer}>
					<Button
						onPress={handleContinue}
						loading={isLoading}
						disabled={!selectedRole || isLoading}
					>
						{t('auth.roleSelect.continueButton')}
					</Button>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		padding: spacing.xl,
		justifyContent: 'center',
	},
	header: {
		marginBottom: spacing.xxl,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	options: {
		gap: spacing.md,
	},
	optionCard: {
		borderWidth: 2,
		borderColor: colors.border,
	},
	selectedCard: {
		borderColor: colors.accent,
		backgroundColor: colors.surfaceVariant,
	},
	optionContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.surfaceVariant,
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectedIconContainer: {
		backgroundColor: colors.accent,
	},
	optionText: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	optionDescription: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	radioContainer: {
		padding: spacing.xs,
	},
	radio: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: colors.border,
		justifyContent: 'center',
		alignItems: 'center',
	},
	radioSelected: {
		borderColor: colors.accent,
	},
	radioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.accent,
	},
	footer: {
		marginTop: spacing.xxl,
	},
	pressed: {
		opacity: 0.8,
	},
})

