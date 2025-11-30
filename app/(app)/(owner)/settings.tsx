import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	ScrollView,
	Pressable,
	Alert,
} from 'react-native'
import { Text, Switch, Divider } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth, useBusiness } from '../../../src/hooks'
import { Card, Button, Input, LoadingScreen } from '../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../src/constants/theme'
import { updateUserRole } from '../../../src/services/auth-service'

const businessSchema = z.object({
	name: z.string().min(2, 'Business name is required'),
	address: z.string().min(5, 'Address is required'),
	phone: z.string().min(10, 'Phone number is required'),
	description: z.string().optional(),
})

type BusinessFormData = z.infer<typeof businessSchema>

const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
] as const

export default function SettingsScreen() {
	const { user } = useAuth()
	const {
		currentBusiness,
		isLoading,
		loadOwnerBusiness,
		createBusiness,
		updateBusiness,
	} = useBusiness()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isCreating, setIsCreating] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BusinessFormData>({
		resolver: zodResolver(businessSchema),
		defaultValues: {
			name: '',
			address: '',
			phone: '',
			description: '',
		},
	})

	useEffect(() => {
		if (user?.id) {
			loadOwnerBusiness(user.id)
		}
	}, [user?.id])

	useEffect(() => {
		if (currentBusiness) {
			reset({
				name: currentBusiness.name,
				address: currentBusiness.address,
				phone: currentBusiness.phone,
				description: currentBusiness.description || '',
			})
		}
	}, [currentBusiness])

	const onSubmit = async (data: BusinessFormData) => {
		if (!user?.id) return

		setIsSubmitting(true)
		try {
			if (currentBusiness) {
				await updateBusiness(currentBusiness.id, data)
				Alert.alert('Success', 'Business updated successfully!')
			} else {
				setIsCreating(true)
				const newBusiness = await createBusiness(user.id, data)
				// Update user's businessId
				await updateUserRole(user.id, 'owner', newBusiness.id)
				Alert.alert('Success', 'Business created successfully!')
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to save business')
		} finally {
			setIsSubmitting(false)
			setIsCreating(false)
		}
	}

	if (isLoading && !currentBusiness && !isCreating) {
		return <LoadingScreen message="Loading settings..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={styles.headerTitle}>Business Settings</Text>
				<View style={styles.backButton} />
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Business Info */}
				<Card style={styles.card}>
					<Text style={styles.sectionTitle}>Business Information</Text>
					<Text style={styles.sectionSubtitle}>
						{currentBusiness
							? 'Update your business details'
							: 'Set up your business to start accepting bookings'}
					</Text>

					<View style={styles.form}>
						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, value } }) => (
								<Input
									label="Business Name"
									value={value}
									onChangeText={onChange}
									placeholder="e.g., Classic Cuts Barbershop"
									error={errors.name?.message ?? ''}
								/>
							)}
						/>

						<Controller
							control={control}
							name="address"
							render={({ field: { onChange, value } }) => (
								<Input
									label="Address"
									value={value}
									onChangeText={onChange}
									placeholder="123 Main St, City, State"
									error={errors.address?.message ?? ''}
								/>
							)}
						/>

						<Controller
							control={control}
							name="phone"
							render={({ field: { onChange, value } }) => (
								<Input
									label="Phone Number"
									value={value}
									onChangeText={onChange}
									placeholder="(555) 123-4567"
									keyboardType="phone-pad"
									error={errors.phone?.message ?? ''}
								/>
							)}
						/>

						<Controller
							control={control}
							name="description"
							render={({ field: { onChange, value } }) => (
								<Input
									label="Description (optional)"
									value={value || ''}
									onChangeText={onChange}
									placeholder="Tell customers about your barbershop"
									multiline
									numberOfLines={3}
								/>
							)}
						/>

						<Button
							onPress={handleSubmit(onSubmit)}
							loading={isSubmitting}
							style={styles.submitButton}
						>
							{currentBusiness ? 'Save Changes' : 'Create Business'}
						</Button>
					</View>
				</Card>

				{currentBusiness && (
					<>
						{/* Subscription Status */}
						<Card style={styles.card}>
							<Text style={styles.sectionTitle}>Subscription</Text>
							<View style={styles.subscriptionStatus}>
								<View style={styles.subscriptionBadge}>
									<Text style={styles.subscriptionText}>
										{currentBusiness.subscriptionStatus === 'trial'
											? 'Free Trial'
											: currentBusiness.subscriptionStatus.charAt(0).toUpperCase() +
											  currentBusiness.subscriptionStatus.slice(1)}
									</Text>
								</View>
								{currentBusiness.subscriptionStatus === 'trial' && (
									<Text style={styles.trialText}>
										Upgrade to unlock all features
									</Text>
								)}
							</View>
							<Button
								mode="outlined"
								onPress={() =>
									Alert.alert(
										'Coming Soon',
										'Subscription management will be available soon!'
									)
								}
								style={styles.upgradeButton}
							>
								Manage Subscription
							</Button>
						</Card>

						{/* Working Hours */}
						<Card style={styles.card}>
							<Text style={styles.sectionTitle}>Working Hours</Text>
							<Text style={styles.sectionSubtitle}>
								Set when your barbershop is open
							</Text>

							{DAYS.map((day) => {
								const hours = currentBusiness.workingHours[day]
								return (
									<View key={day} style={styles.dayRow}>
										<View style={styles.dayInfo}>
											<Text style={styles.dayName}>
												{day.charAt(0).toUpperCase() + day.slice(1)}
											</Text>
											{hours.isOpen ? (
												<Text style={styles.dayHours}>
													{hours.start} - {hours.end}
												</Text>
											) : (
												<Text style={styles.closedText}>Closed</Text>
											)}
										</View>
										<Switch
											value={hours.isOpen}
											onValueChange={() => {
												// TODO: Implement working hours edit
												Alert.alert(
													'Coming Soon',
													'Working hours editing will be available soon!'
												)
											}}
											color={colors.accent}
										/>
									</View>
								)
							})}
						</Card>
					</>
				)}
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	card: {
		marginBottom: spacing.lg,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: spacing.lg,
	},
	form: {
		gap: spacing.xs,
	},
	submitButton: {
		marginTop: spacing.md,
	},
	subscriptionStatus: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
		marginBottom: spacing.md,
	},
	subscriptionBadge: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		backgroundColor: colors.accent,
		borderRadius: borderRadius.full,
	},
	subscriptionText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	trialText: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	upgradeButton: {
		marginTop: spacing.sm,
	},
	dayRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	dayInfo: {
		flex: 1,
	},
	dayName: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	dayHours: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	closedText: {
		fontSize: 14,
		color: colors.textMuted,
		marginTop: spacing.xs,
	},
})

