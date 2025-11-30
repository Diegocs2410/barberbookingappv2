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
import { useAuth, useBusiness, useBooking, useThemeColors, useTranslation } from '../../../src/hooks'
import { Card, LoadingScreen } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
import { Booking, BookingStatus } from '../../../src/types'

interface QuickAction {
	title: string
	icon: keyof typeof Ionicons.glyphMap
	route: string
}

export default function DashboardScreen() {
	const { user } = useAuth()
	const { colors, isDarkMode } = useThemeColors()
	const { t } = useTranslation()

	const QUICK_ACTIONS: QuickAction[] = [
		{
			title: t('owner.services.title'),
			icon: 'cut-outline',
			route: '/(app)/(owner)/services',
		},
		{
			title: t('owner.barbers.title'),
			icon: 'people-outline',
			route: '/(app)/(owner)/barbers',
		},
		{
			title: t('owner.settings.title'),
			icon: 'settings-outline',
			route: '/(app)/(owner)/settings',
		},
	]
	const { currentBusiness, loadOwnerBusiness, services, barbers, loadServices, loadBarbers } =
		useBusiness()
	const { bookings, isLoading, loadBusinessBookings, confirmBooking, completeBooking } = useBooking()

	const [refreshing, setRefreshing] = useState(false)

	const STATUS_COLORS: Record<BookingStatus, string> = {
		pending: colors.warning,
		confirmed: colors.success,
		completed: colors.info,
		cancelled: colors.error,
	}

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
							color={colors.textPrimary}
						/>
						<Text style={[styles.timeText, { color: colors.textPrimary }]}>{formatTime(item.dateTime)}</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: STATUS_COLORS[item.status] },
						]}
					>
						<Text style={styles.statusText}>
							{t(`customer.myBookings.status.${item.status}`)}
						</Text>
					</View>
				</View>

				<View style={[styles.bookingDetails, { borderTopColor: colors.border }]}>
					<Text style={[styles.serviceName, { color: colors.textPrimary }]}>
						{service?.name || 'Service'}
					</Text>
					<Text style={[styles.barberName, { color: colors.textSecondary }]}>
						{t('customer.booking.barber')}: {barber?.name || 'Barber'}
					</Text>
				</View>

				{item.status === 'pending' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, { backgroundColor: colors.success }]}
							onPress={() => handleConfirm(item.id)}
						>
							<Text style={styles.actionButtonText}>{t('common.confirm')}</Text>
						</Pressable>
					</View>
				)}

				{item.status === 'confirmed' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, { backgroundColor: colors.primary }]}
							onPress={() => handleComplete(item.id)}
						>
							<Text style={[styles.actionButtonText, { color: isDarkMode ? '#000000' : '#ffffff' }]}>{t('owner.dashboard.markComplete')}</Text>
						</Pressable>
					</View>
				)}
			</Card>
		)
	}

	if (isLoading && !refreshing && !currentBusiness) {
		return <LoadingScreen message={t('common.loading')} />
	}

	if (!currentBusiness) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
				<View style={styles.setupContainer}>
					<View style={[styles.setupIconContainer, { backgroundColor: colors.surfaceVariant }]}>
						<Ionicons
							name="storefront-outline"
							size={48}
							color={colors.textPrimary}
						/>
					</View>
					<Text style={[styles.setupTitle, { color: colors.textPrimary }]}>{t('owner.dashboard.setupBusiness')}</Text>
					<Text style={[styles.setupSubtitle, { color: colors.textSecondary }]}>
						{t('owner.dashboard.setupDescription')}
					</Text>
					<Pressable
						style={[styles.setupButton, { backgroundColor: colors.primary }]}
						onPress={() => router.push('/(app)/(owner)/settings')}
					>
						<Text style={[styles.setupButtonText, { color: isDarkMode ? '#000000' : '#ffffff' }]}>{t('owner.dashboard.getStarted')}</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<View>
					<Text style={[styles.greeting, { color: colors.textSecondary }]}>
						{t('owner.dashboard.welcome')}, {user?.name?.split(' ')[0]}!
					</Text>
					<Text style={[styles.businessName, { color: colors.textPrimary }]}>{currentBusiness.name}</Text>
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
						tintColor={colors.primary}
					/>
				}
			>
				{/* Stats Cards */}
				<View style={styles.statsRow}>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{todayBookings.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('owner.dashboard.todayAppointments')}</Text>
					</View>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{pendingBookings.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('customer.myBookings.status.pending')}</Text>
					</View>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{services.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('owner.services.title')}</Text>
					</View>
				</View>

				{/* Quick Actions */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('owner.dashboard.quickActions')}</Text>
					<View style={styles.actionsGrid}>
						{QUICK_ACTIONS.map((action) => (
							<Pressable
								key={action.title}
								style={({ pressed }) => [
									styles.actionCard,
									{ backgroundColor: colors.surface, borderColor: colors.border },
									pressed && styles.actionCardPressed,
								]}
								onPress={() => router.push(action.route as any)}
							>
								<View style={[styles.actionIcon, { backgroundColor: colors.surfaceVariant }]}>
									<Ionicons
										name={action.icon}
										size={24}
										color={colors.textPrimary}
									/>
								</View>
								<Text style={[styles.actionTitle, { color: colors.textPrimary }]}>{action.title}</Text>
							</Pressable>
						))}
					</View>
				</View>

				{/* Today's Schedule */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('owner.dashboard.todaySchedule')}</Text>
					{todayBookings.length === 0 ? (
						<Card style={styles.emptyCard}>
							<View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceVariant }]}>
								<Ionicons
									name="calendar-outline"
									size={32}
									color={colors.textMuted}
								/>
							</View>
							<Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('owner.dashboard.noAppointments')}</Text>
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
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
		borderBottomWidth: 1,
	},
	greeting: {
		fontSize: 15,
		fontWeight: '500',
	},
	businessName: {
		fontSize: 24,
		fontWeight: '700',
		marginTop: spacing.xs,
		letterSpacing: -0.5,
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
		borderRadius: borderRadius.xl,
		borderWidth: 1,
	},
	statNumber: {
		fontSize: 28,
		fontWeight: '700',
	},
	statLabel: {
		fontSize: 11,
		marginTop: spacing.xs,
		textAlign: 'center',
		fontWeight: '500',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},
	section: {
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
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
		borderRadius: borderRadius.xl,
		borderWidth: 1,
	},
	actionCardPressed: {
		opacity: 0.7,
		transform: [{ scale: 0.98 }],
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
		fontSize: 13,
		fontWeight: '600',
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
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.sm,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#ffffff',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},
	bookingDetails: {
		borderTopWidth: 1,
		paddingTop: spacing.sm,
	},
	serviceName: {
		fontSize: 16,
		fontWeight: '500',
	},
	barberName: {
		fontSize: 14,
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
		borderRadius: borderRadius.lg,
		alignItems: 'center',
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff',
	},
	emptyCard: {
		alignItems: 'center',
		padding: spacing.xl,
	},
	emptyIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	emptyText: {
		fontSize: 14,
		fontWeight: '500',
	},
	setupContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.xl,
	},
	setupIconContainer: {
		width: 96,
		height: 96,
		borderRadius: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.lg,
	},
	setupTitle: {
		fontSize: 24,
		fontWeight: '700',
		marginTop: spacing.sm,
	},
	setupSubtitle: {
		fontSize: 15,
		marginTop: spacing.sm,
		textAlign: 'center',
		lineHeight: 22,
	},
	setupButton: {
		marginTop: spacing.xl,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.lg,
	},
	setupButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
})
