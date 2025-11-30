import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native'
import { Text, SegmentedButtons } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useBooking, useBusiness } from '../../src/hooks'
import { Card, LoadingScreen } from '../../src/components/ui'
import { colors, spacing, borderRadius } from '../../src/constants/theme'
import { Booking, BookingStatus } from '../../src/types'

const STATUS_COLORS: Record<BookingStatus, string> = {
	pending: colors.warning,
	confirmed: colors.success,
	completed: colors.info,
	cancelled: colors.error,
}

export default function MyBookingsScreen() {
	const { user } = useAuth()
	const {
		upcomingBookings,
		pastBookings,
		isLoading,
		loadCustomerBookings,
		cancelBooking,
	} = useBooking()
	const { businesses, loadAllBusinesses, services, loadServices } = useBusiness()

	const [refreshing, setRefreshing] = useState(false)
	const [tab, setTab] = useState('upcoming')

	useEffect(() => {
		if (user?.id) {
			loadCustomerBookings(user.id)
			loadAllBusinesses()
		}
	}, [user?.id])

	const onRefresh = async () => {
		setRefreshing(true)
		if (user?.id) {
			await loadCustomerBookings(user.id)
		}
		setRefreshing(false)
	}

	const handleCancelBooking = (bookingId: string) => {
		Alert.alert(
			'Cancel Booking',
			'Are you sure you want to cancel this appointment?',
			[
				{ text: 'No', style: 'cancel' },
				{
					text: 'Yes, Cancel',
					style: 'destructive',
					onPress: async () => {
						try {
							await cancelBooking(bookingId)
							Alert.alert('Cancelled', 'Your booking has been cancelled.')
						} catch (error) {
							Alert.alert('Error', 'Failed to cancel booking.')
						}
					},
				},
			]
		)
	}

	const formatDateTime = (date: Date) => {
		return {
			date: date.toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			}),
			time: date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			}),
		}
	}

	const renderBooking = ({ item }: { item: Booking }) => {
		const business = businesses.find((b) => b.id === item.businessId)
		const { date, time } = formatDateTime(item.dateTime)
		const isPast = item.dateTime < new Date()
		const canCancel =
			!isPast && (item.status === 'pending' || item.status === 'confirmed')

		return (
			<Card style={styles.bookingCard}>
				<View style={styles.bookingHeader}>
					<View style={styles.dateTimeContainer}>
						<Ionicons
							name="calendar-outline"
							size={16}
							color={colors.accent}
						/>
						<Text style={styles.dateText}>{date}</Text>
						<Text style={styles.timeText}>{time}</Text>
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
					<Text style={styles.businessName}>
						{business?.name || 'Loading...'}
					</Text>
					<View style={styles.detailRow}>
						<Ionicons
							name="time-outline"
							size={14}
							color={colors.textSecondary}
						/>
						<Text style={styles.detailText}>{item.duration} min</Text>
					</View>
				</View>

				{canCancel && (
					<View style={styles.bookingActions}>
						<Text
							style={styles.cancelButton}
							onPress={() => handleCancelBooking(item.id)}
						>
							Cancel Booking
						</Text>
					</View>
				)}
			</Card>
		)
	}

	const currentBookings = tab === 'upcoming' ? upcomingBookings : pastBookings

	if (isLoading && !refreshing && upcomingBookings.length === 0) {
		return <LoadingScreen message="Loading your bookings..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.title}>My Bookings</Text>
			</View>

			<View style={styles.tabsContainer}>
				<SegmentedButtons
					value={tab}
					onValueChange={setTab}
					buttons={[
						{ value: 'upcoming', label: 'Upcoming' },
						{ value: 'past', label: 'Past' },
					]}
					style={styles.tabs}
				/>
			</View>

			<FlatList
				data={currentBookings}
				renderItem={renderBooking}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.accent}
					/>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Ionicons
							name={tab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
							size={64}
							color={colors.textMuted}
						/>
						<Text style={styles.emptyTitle}>
							No {tab} bookings
						</Text>
						<Text style={styles.emptySubtitle}>
							{tab === 'upcoming'
								? 'Book an appointment to get started'
								: 'Your past bookings will appear here'}
						</Text>
					</View>
				}
			/>
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
	tabsContainer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
	},
	tabs: {
		backgroundColor: colors.surface,
	},
	listContent: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	bookingCard: {
		marginBottom: spacing.md,
	},
	bookingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	dateTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	dateText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	timeText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.sm,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	bookingDetails: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.md,
	},
	businessName: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	detailText: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	bookingActions: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		marginTop: spacing.md,
		paddingTop: spacing.md,
	},
	cancelButton: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.error,
		textAlign: 'center',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: spacing.xxl * 2,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginTop: spacing.md,
	},
	emptySubtitle: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: spacing.xs,
		textAlign: 'center',
	},
})

