import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	ScrollView,
	FlatList,
	RefreshControl,
	Pressable,
} from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useBusiness, useBooking } from '../../../src/hooks'
import { Card, LoadingScreen } from '../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../src/constants/theme'
import { Booking, BookingStatus } from '../../../src/types'

const STATUS_COLORS: Record<BookingStatus, string> = {
	pending: colors.warning,
	confirmed: colors.success,
	completed: colors.info,
	cancelled: colors.error,
}

interface QuickAction {
	title: string
	icon: keyof typeof Ionicons.glyphMap
	route: string
	color: string
}

const QUICK_ACTIONS: QuickAction[] = [
	{
		title: 'Services',
		icon: 'cut-outline',
		route: '/(app)/(owner)/services',
		color: colors.accent,
	},
	{
		title: 'Barbers',
		icon: 'people-outline',
		route: '/(app)/(owner)/barbers',
		color: colors.secondary,
	},
	{
		title: 'Settings',
		icon: 'settings-outline',
		route: '/(app)/(owner)/settings',
		color: colors.info,
	},
]

export default function DashboardScreen() {
	const { user } = useAuth()
	const { currentBusiness, loadOwnerBusiness, services, barbers, loadServices, loadBarbers } =
		useBusiness()
	const { bookings, isLoading, loadBusinessBookings, confirmBooking, completeBooking } = useBooking()

	const [refreshing, setRefreshing] = useState(false)

	useEffect(() => {
		if (user?.id) {
			loadOwnerBusiness(user.id)
		}
	}, [user?.id])

	useEffect(() => {
		if (currentBusiness?.id) {
			loadBusinessBookings(currentBusiness.id, new Date())
			loadServices(currentBusiness.id)
			loadBarbers(currentBusiness.id)
		}
	}, [currentBusiness?.id])

	const onRefresh = async () => {
		setRefreshing(true)
		if (currentBusiness?.id) {
			await loadBusinessBookings(currentBusiness.id, new Date())
		}
		setRefreshing(false)
	}

	const todayBookings = bookings.filter((b) => {
		const today = new Date()
		return (
			b.dateTime.toDateString() === today.toDateString() &&
			b.status !== 'cancelled'
		)
	})

	const pendingBookings = todayBookings.filter((b) => b.status === 'pending')
	const confirmedBookings = todayBookings.filter(
		(b) => b.status === 'confirmed' || b.status === 'completed'
	)

	const handleConfirm = async (bookingId: string) => {
		await confirmBooking(bookingId)
	}

	const handleComplete = async (bookingId: string) => {
		await completeBooking(bookingId)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
	}

	const renderBooking = ({ item }: { item: Booking }) => {
		const barber = barbers.find((b) => b.id === item.barberId)
		const service = services.find((s) => s.id === item.serviceId)

		return (
			<Card style={styles.bookingCard}>
				<View style={styles.bookingHeader}>
					<View style={styles.timeContainer}>
						<Ionicons
							name="time-outline"
							size={16}
							color={colors.accent}
						/>
						<Text style={styles.timeText}>{formatTime(item.dateTime)}</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: STATUS_COLORS[item.status] },
						]}
					>
						<Text style={styles.statusText}>
							{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
						</Text>
					</View>
				</View>

				<View style={styles.bookingDetails}>
					<Text style={styles.serviceName}>
						{service?.name || 'Service'}
					</Text>
					<Text style={styles.barberName}>
						with {barber?.name || 'Barber'}
					</Text>
				</View>

				{item.status === 'pending' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, styles.confirmButton]}
							onPress={() => handleConfirm(item.id)}
						>
							<Text style={styles.actionButtonText}>Confirm</Text>
						</Pressable>
					</View>
				)}

				{item.status === 'confirmed' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, styles.completeButton]}
							onPress={() => handleComplete(item.id)}
						>
							<Text style={styles.actionButtonText}>Mark Complete</Text>
						</Pressable>
					</View>
				)}
			</Card>
		)
	}

	if (isLoading && !refreshing && !currentBusiness) {
		return <LoadingScreen message="Loading dashboard..." />
	}

	if (!currentBusiness) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.setupContainer}>
					<Ionicons
						name="storefront-outline"
						size={64}
						color={colors.accent}
					/>
					<Text style={styles.setupTitle}>Set Up Your Business</Text>
					<Text style={styles.setupSubtitle}>
						Create your business profile to start accepting bookings
					</Text>
					<Pressable
						style={styles.setupButton}
						onPress={() => router.push('/(app)/(owner)/settings')}
					>
						<Text style={styles.setupButtonText}>Get Started</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<View>
					<Text style={styles.greeting}>
						Hello, {user?.name?.split(' ')[0]}!
					</Text>
					<Text style={styles.businessName}>{currentBusiness.name}</Text>
				</View>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.accent}
					/>
				}
			>
				{/* Stats Cards */}
				<View style={styles.statsRow}>
					<Card style={styles.statCard}>
						<Text style={styles.statNumber}>{todayBookings.length}</Text>
						<Text style={styles.statLabel}>Today's Bookings</Text>
					</Card>
					<Card style={styles.statCard}>
						<Text style={styles.statNumber}>{pendingBookings.length}</Text>
						<Text style={styles.statLabel}>Pending</Text>
					</Card>
					<Card style={styles.statCard}>
						<Text style={styles.statNumber}>{services.length}</Text>
						<Text style={styles.statLabel}>Services</Text>
					</Card>
				</View>

				{/* Quick Actions */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionsGrid}>
						{QUICK_ACTIONS.map((action) => (
							<Pressable
								key={action.title}
								style={styles.actionCard}
								onPress={() => router.push(action.route as any)}
							>
								<View
									style={[
										styles.actionIcon,
										{ backgroundColor: action.color },
									]}
								>
									<Ionicons
										name={action.icon}
										size={24}
										color={colors.textPrimary}
									/>
								</View>
								<Text style={styles.actionTitle}>{action.title}</Text>
							</Pressable>
						))}
					</View>
				</View>

				{/* Today's Schedule */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Today's Schedule</Text>
					{todayBookings.length === 0 ? (
						<Card style={styles.emptyCard}>
							<Ionicons
								name="calendar-outline"
								size={40}
								color={colors.textMuted}
							/>
							<Text style={styles.emptyText}>No bookings today</Text>
						</Card>
					) : (
						todayBookings.map((booking) => (
							<View key={booking.id}>
								{renderBooking({ item: booking })}
							</View>
						))
					)}
				</View>
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
		paddingBottom: spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	greeting: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	businessName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginTop: spacing.xs,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	statsRow: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginBottom: spacing.xl,
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		padding: spacing.md,
	},
	statNumber: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.accent,
	},
	statLabel: {
		fontSize: 11,
		color: colors.textSecondary,
		marginTop: spacing.xs,
		textAlign: 'center',
	},
	section: {
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	actionsGrid: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	actionCard: {
		flex: 1,
		alignItems: 'center',
		padding: spacing.md,
		backgroundColor: colors.card,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border,
	},
	actionIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	actionTitle: {
		fontSize: 12,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	bookingCard: {
		marginBottom: spacing.sm,
	},
	bookingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	timeText: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.sm,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	bookingDetails: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.sm,
	},
	serviceName: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	barberName: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	bookingActions: {
		marginTop: spacing.md,
		flexDirection: 'row',
		gap: spacing.sm,
	},
	actionButton: {
		flex: 1,
		paddingVertical: spacing.sm,
		borderRadius: borderRadius.md,
		alignItems: 'center',
	},
	confirmButton: {
		backgroundColor: colors.success,
	},
	completeButton: {
		backgroundColor: colors.info,
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	emptyCard: {
		alignItems: 'center',
		padding: spacing.xl,
	},
	emptyText: {
		fontSize: 14,
		color: colors.textMuted,
		marginTop: spacing.sm,
	},
	setupContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.xl,
	},
	setupTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginTop: spacing.lg,
	},
	setupSubtitle: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: spacing.sm,
		textAlign: 'center',
	},
	setupButton: {
		marginTop: spacing.xl,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		backgroundColor: colors.accent,
		borderRadius: borderRadius.lg,
	},
	setupButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
	},
})

