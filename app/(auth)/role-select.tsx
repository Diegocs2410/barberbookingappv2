import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useTranslation, useThemeColors, useBusiness } from '../../src/hooks'
import { Button } from '../../src/components/ui'
import { spacing, borderRadius } from '../../src/constants/theme'
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
		role: 'barber',
		titleKey: 'auth.roleSelect.barber',
		descriptionKey: 'auth.roleSelect.barberDescription',
		icon: 'cut-outline',
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
	const { colors, isDarkMode } = useThemeColors()
	const { findPendingBarberByEmail, linkBarber } = useBusiness()
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
	const [isSearchingBarber, setIsSearchingBarber] = useState(false)

	const handleContinue = async () => {
		if (!selectedRole || !user) return

		try {
			// Si seleccionó Barbero, buscar si hay un barbero pendiente con su email
			if (selectedRole === 'barber') {
				setIsSearchingBarber(true)

				const pendingBarber = await findPendingBarberByEmail(user.email)

				if (pendingBarber) {
					// Vincular automáticamente
					await linkBarber(pendingBarber.businessId, pendingBarber.barber.id, user.id)
					await updateRole('barber', pendingBarber.businessId)

					Alert.alert(
						t('common.success'),
						t('auth.roleSelect.barberLinkedSuccess'),
						[{ text: t('common.ok'), onPress: () => router.replace('/') }]
					)
				} else {
					// No hay barbero pendiente, mostrar mensaje explicativo
					setIsSearchingBarber(false)
					Alert.alert(
						t('auth.roleSelect.barberNotLinkedTitle'),
						t('auth.roleSelect.barberNotLinkedMessage'),
						[{ text: t('common.ok') }]
					)
					return
				}
			} else {
				// Para otros roles, continuar normalmente
				await updateRole(selectedRole)
				router.replace('/')
			}
		} catch (err) {
			console.error('Error updating role:', err)
			Alert.alert(t('common.error'), t('errors.generic'))
		} finally {
			setIsSearchingBarber(false)
		}
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.textPrimary }]}>
						{t('auth.roleSelect.title')}, {user?.name?.split(' ')[0]}!
					</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						{t('auth.roleSelect.subtitle')}
					</Text>
				</View>

				<View style={styles.options}>
					{ROLE_OPTIONS.map((option) => (
						<Pressable
							key={option.role}
							onPress={() => setSelectedRole(option.role)}
							style={({ pressed }) => [pressed && styles.pressed]}
						>
							<View
								style={[
									styles.optionCard,
									{
										borderColor: selectedRole === option.role ? colors.primary : colors.border,
										backgroundColor: selectedRole === option.role ? colors.surfaceVariant : colors.surface,
									},
								]}
							>
								<View style={styles.optionContent}>
									<View
										style={[
											styles.iconContainer,
											{
												backgroundColor: selectedRole === option.role ? colors.primary : colors.surfaceVariant,
												borderColor: selectedRole === option.role ? colors.primary : colors.border,
											},
										]}
									>
										<Ionicons
											name={option.icon}
											size={28}
											color={
												selectedRole === option.role
													? (isDarkMode ? '#000000' : '#ffffff')
													: colors.textPrimary
											}
										/>
									</View>
									<View style={styles.optionText}>
										<Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
											{t(option.titleKey)}
										</Text>
										<Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
											{t(option.descriptionKey)}
										</Text>
									</View>
									<View style={styles.radioContainer}>
										<View
											style={[
												styles.radio,
												{
													borderColor: selectedRole === option.role ? colors.primary : colors.border,
												},
											]}
										>
											{selectedRole === option.role && (
												<View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
											)}
										</View>
									</View>
								</View>
							</View>
						</Pressable>
					))}
				</View>

				<View style={styles.footer}>
					<Button
						onPress={handleContinue}
						loading={isLoading || isSearchingBarber}
						disabled={!selectedRole || isLoading || isSearchingBarber}
					>
						{isSearchingBarber
							? t('auth.roleSelect.barberSearching')
							: t('auth.roleSelect.continueButton')}
					</Button>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		fontWeight: '700',
		marginBottom: spacing.sm,
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 16,
		lineHeight: 24,
	},
	options: {
		gap: spacing.md,
	},
	optionCard: {
		padding: spacing.lg,
		borderWidth: 1.5,
		borderRadius: borderRadius.xl,
	},
	optionContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: borderRadius.lg,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
	},
	optionText: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.xs,
	},
	optionDescription: {
		fontSize: 14,
		lineHeight: 20,
	},
	radioContainer: {
		padding: spacing.xs,
	},
	radio: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	radioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
	footer: {
		marginTop: spacing.xxl,
	},
	pressed: {
		opacity: 0.8,
	},
})
