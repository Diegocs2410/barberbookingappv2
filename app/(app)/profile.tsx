import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/hooks'
import { Button, Card, Avatar, Input } from '../../src/components/ui'
import { colors, spacing, borderRadius } from '../../src/constants/theme'

export default function ProfileScreen() {
	const { user, signOut, updateProfile, isLoading } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [name, setName] = useState(user?.name || '')
	const [phone, setPhone] = useState(user?.phone || '')

	const handleSaveProfile = async () => {
		try {
			await updateProfile({ name, phone })
			setIsEditing(false)
			Alert.alert('Success', 'Profile updated successfully!')
		} catch (error) {
			Alert.alert('Error', 'Failed to update profile')
		}
	}

	const handleSignOut = () => {
		Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Sign Out',
				style: 'destructive',
				onPress: async () => {
					await signOut()
					router.replace('/(auth)/login')
				},
			},
		])
	}

	const getRoleName = (role: string) => {
		switch (role) {
			case 'owner':
				return 'Business Owner'
			case 'barber':
				return 'Barber'
			default:
				return 'Customer'
		}
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Card */}
				<Card style={styles.profileCard}>
					<View style={styles.profileHeader}>
						<Avatar
							source={user?.photoUrl}
							name={user?.name || 'User'}
							size="large"
						/>
						{!isEditing && (
							<>
								<Text style={styles.userName}>{user?.name}</Text>
								<Text style={styles.userEmail}>{user?.email}</Text>
								<View style={styles.roleBadge}>
									<Text style={styles.roleText}>
										{getRoleName(user?.role || 'customer')}
									</Text>
								</View>
							</>
						)}
					</View>

					{isEditing ? (
						<View style={styles.editForm}>
							<Input
								label="Full Name"
								value={name}
								onChangeText={setName}
								placeholder="Your name"
								autoCapitalize="words"
							/>
							<Input
								label="Phone"
								value={phone}
								onChangeText={setPhone}
								placeholder="Your phone number"
								keyboardType="phone-pad"
							/>
							<View style={styles.editButtons}>
								<Button
									mode="outlined"
									onPress={() => {
										setIsEditing(false)
										setName(user?.name || '')
										setPhone(user?.phone || '')
									}}
									style={styles.cancelButton}
								>
									Cancel
								</Button>
								<Button
									onPress={handleSaveProfile}
									loading={isLoading}
									style={styles.saveButton}
								>
									Save
								</Button>
							</View>
						</View>
					) : (
						<Button
							mode="outlined"
							onPress={() => setIsEditing(true)}
							icon="pencil"
							style={styles.editButton}
						>
							Edit Profile
						</Button>
					)}
				</Card>

				{/* Info Section */}
				<Card style={styles.infoCard}>
					<View style={styles.infoRow}>
						<View style={styles.infoIcon}>
							<Ionicons
								name="mail-outline"
								size={20}
								color={colors.accent}
							/>
						</View>
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Email</Text>
							<Text style={styles.infoValue}>{user?.email}</Text>
						</View>
					</View>

					<Divider style={styles.divider} />

					<View style={styles.infoRow}>
						<View style={styles.infoIcon}>
							<Ionicons
								name="call-outline"
								size={20}
								color={colors.accent}
							/>
						</View>
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Phone</Text>
							<Text style={styles.infoValue}>
								{user?.phone || 'Not set'}
							</Text>
						</View>
					</View>

					<Divider style={styles.divider} />

					<View style={styles.infoRow}>
						<View style={styles.infoIcon}>
							<Ionicons
								name="person-outline"
								size={20}
								color={colors.accent}
							/>
						</View>
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Account Type</Text>
							<Text style={styles.infoValue}>
								{getRoleName(user?.role || 'customer')}
							</Text>
						</View>
					</View>
				</Card>

				{/* Sign Out Button */}
				<Button
					mode="outlined"
					onPress={handleSignOut}
					style={styles.signOutButton}
				>
					Sign Out
				</Button>

				{/* App Version */}
				<Text style={styles.version}>BarberBooking v1.0.0</Text>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: colors.textPrimary,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	profileCard: {
		marginBottom: spacing.lg,
	},
	profileHeader: {
		alignItems: 'center',
		marginBottom: spacing.lg,
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginTop: spacing.md,
	},
	userEmail: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	roleBadge: {
		marginTop: spacing.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		backgroundColor: colors.accent,
		borderRadius: borderRadius.full,
	},
	roleText: {
		fontSize: 12,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	editButton: {
		marginTop: spacing.md,
	},
	editForm: {
		marginTop: spacing.md,
	},
	editButtons: {
		flexDirection: 'row',
		gap: spacing.md,
		marginTop: spacing.md,
	},
	cancelButton: {
		flex: 1,
	},
	saveButton: {
		flex: 1,
	},
	infoCard: {
		marginBottom: spacing.lg,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: spacing.sm,
	},
	infoIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.surfaceVariant,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: spacing.md,
	},
	infoContent: {
		flex: 1,
	},
	infoLabel: {
		fontSize: 12,
		color: colors.textSecondary,
	},
	infoValue: {
		fontSize: 16,
		color: colors.textPrimary,
		marginTop: spacing.xs,
	},
	divider: {
		backgroundColor: colors.border,
		marginVertical: spacing.sm,
	},
	signOutButton: {
		marginTop: spacing.md,
		borderColor: colors.error,
	},
	version: {
		textAlign: 'center',
		fontSize: 12,
		color: colors.textMuted,
		marginTop: spacing.xl,
	},
})

