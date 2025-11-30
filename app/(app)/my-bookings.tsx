import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Alert, Pressable } from 'react-native'
import { Text, SegmentedButtons } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useBooking, useBusiness, useThemeColors, useTranslation } from '../../src/hooks'
import { Card, LoadingScreen } from '../../src/components/ui'
import { spacing, borderRadius } from '../../src/constants/theme'
import { Booking, BookingStatus } from '../../src/types'

export default function MyBookingsScreen() {
	const { user } = useAuth()
	const { colors, isDarkMode } = useThemeColors()
	const { t, locale } = useTranslation()
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

	const STATUS_COLORS: Record<BookingStatus, string> = {
		pending: colors.warning,
		confirmed: colors.success,
		completed: colors.info,
		cancelled: colors.error,
	}

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
			t('customer.myBookings.cancelTitle'),
			t('customer.myBookings.cancelMessage'),
			[
				{ text: t('common.no'), style: 'cancel' },
				{
					text: t('customer.myBookings.yesCancel'),
					style: 'destructive',
					onPress: async () => {
						try {
							await cancelBooking(bookingId)
							Alert.alert(t('customer.myBookings.cancelled'), t('customer.myBookings.cancelledMessage'))
						} catch (error) {
							Alert.alert(t('common.error'), t('customer.myBookings.cancelError'))
						}
					},
				},
			]
		)
	}

	const formatDateTime = (date: Date) => {
		const dateLocale = locale === 'es' ? 'es-CO' : 'en-US'
		return {
			date: date.toLocaleDateString(dateLocale, {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			}),
			time: date.toLocaleTimeString(dateLocale, {
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
							color={colors.textPrimary}
						/>
						<Text style={[styles.dateText, { color: colors.textPrimary }]}>{date}</Text>
						<Text style={[styles.timeText, { color: colors.textSecondary }]}>{time}</Text>
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
					<Text style={[styles.businessName, { color: colors.textPrimary }]}>
						{business?.name || t('common.loading')}
					</Text>
					<View style={styles.detailRow}>
						<Ionicons
							name="time-outline"
							size={14}
							color={colors.textSecondary}
						/>
						<Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.duration} min</Text>
					</View>
				</View>

				{canCancel && (
					<View style={[styles.bookingActions, { borderTopColor: colors.border }]}>
						<Pressable
							onPress={() => handleCancelBooking(item.id)}
							style={styles.cancelButtonContainer}
						>
							<Text style={[styles.cancelButton, { color: colors.error }]}>
								{t('customer.myBookings.cancelBooking')}
							</Text>
						</Pressable>
					</View>
				)}
			</Card>
		)
	}

	const currentBookings = tab === 'upcoming' ? upcomingBookings : pastBookings

	if (isLoading && !refreshing && upcomingBookings.length === 0) {
		return <LoadingScreen message={t('customer.myBookings.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: colors.textPrimary }]}>{t('customer.myBookings.title')}</Text>
			</View>

			<View style={styles.tabsContainer}>
				<SegmentedButtons
					value={tab}
					onValueChange={setTab}
					buttons={[
						{ value: 'upcoming', label: t('customer.myBookings.upcoming') },
						{ value: 'past', label: t('customer.myBookings.past') },
					]}
					style={[styles.tabs, { backgroundColor: colors.surface }]}
					theme={{
						colors: {
							secondaryContainer: colors.primary,
							onSecondaryContainer: isDarkMode ? '#000000' : '#ffffff',
							outline: colors.border,
						},
					}}
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
						tintColor={colors.primary}
					/>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceVariant }]}>
							<Ionicons
								name={tab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
								size={40}
								color={colors.textMuted}
							/>
						</View>
						<Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
							{tab === 'upcoming'
								? t('customer.myBookings.noUpcoming')
								: t('customer.myBookings.noPast')}
						</Text>
						<Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
							{tab === 'upcoming'
								? t('customer.myBookings.bookToStart')
								: t('customer.myBookings.pastWillAppear')}
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
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
	},
	title: {
		fontSize: 32,
		fontWeight: '700',
		letterSpacing: -0.5,
	},
	tabsContainer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
	},
	tabs: {},
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
	},
	timeText: {
		fontSize: 14,
		fontWeight: '500',
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
		paddingTop: spacing.md,
	},
	businessName: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.sm,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	detailText: {
		fontSize: 13,
		fontWeight: '500',
	},
	bookingActions: {
		borderTopWidth: 1,
		marginTop: spacing.md,
		paddingTop: spacing.md,
	},
	cancelButtonContainer: {
		alignItems: 'center',
		paddingVertical: spacing.sm,
	},
	cancelButton: {
		fontSize: 14,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: spacing.xxl * 2,
	},
	emptyIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginTop: spacing.sm,
	},
	emptySubtitle: {
		fontSize: 14,
		marginTop: spacing.xs,
		textAlign: 'center',
	},
})
