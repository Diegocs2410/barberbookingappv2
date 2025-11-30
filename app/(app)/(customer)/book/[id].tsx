import React, { useEffect, useState, useMemo } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useBooking, useAuth, useThemeColors, useTranslation } from '../../../../src/hooks'
import { Button, Card, LoadingScreen } from '../../../../src/components/ui'
import { spacing, borderRadius } from '../../../../src/constants/theme'

// Generate next 14 days with locale support
function getNextDays(count: number, locale: string) {
	const days = []
	const today = new Date()
	const dateLocale = locale === 'es' ? 'es-CO' : 'en-US'

	for (let i = 0; i < count; i++) {
		const date = new Date(today)
		date.setDate(date.getDate() + i)
		days.push({
			date: date.toISOString().split('T')[0],
			dayName: date.toLocaleDateString(dateLocale, { weekday: 'short' }),
			dayNumber: date.getDate(),
			month: date.toLocaleDateString(dateLocale, { month: 'short' }),
			fullDate: date,
		})
	}

	return days
}

function getDayOfWeek(dateString: string): string {
	// Parse date string as local time (not UTC) for consistency
	const [year, month, day] = dateString.split('-').map(Number)
	const date = new Date(year, month - 1, day)
	const days = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	]
	return days[date.getDay()]
}

export default function BookingScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { user } = useAuth()
	const { colors, isDarkMode } = useThemeColors()
	const { t, locale } = useTranslation()
	const { currentBusiness, services, barbers } = useBusiness()
	const {
		selectedServiceId,
		selectedBarberId,
		selectedDate,
		selectedTimeSlot,
		availableSlots,
		isLoading,
		selectDate,
		selectTimeSlot,
		loadAvailableSlots,
		createBooking,
	} = useBooking()

	const [isBooking, setIsBooking] = useState(false)

	const days = useMemo(() => getNextDays(14, locale), [locale])

	const selectedService = services.find((s) => s.id === selectedServiceId)
	const selectedBarber = barbers.find((b) => b.id === selectedBarberId)

	useEffect(() => {
		if (
			selectedDate &&
			selectedBarberId &&
			selectedServiceId &&
			currentBusiness &&
			selectedService
		) {
			const dayOfWeek = getDayOfWeek(selectedDate) as keyof typeof currentBusiness.workingHours
			const workingHours = currentBusiness.workingHours[dayOfWeek]

			// Parse date string as local time (not UTC)
			const [year, month, day] = selectedDate.split('-').map(Number)
			const localDate = new Date(year, month - 1, day)

			loadAvailableSlots(
				selectedBarberId,
				currentBusiness.id,
				localDate,
				selectedService.duration,
				workingHours
			)
		}
	}, [selectedDate, selectedBarberId, selectedServiceId, currentBusiness, selectedService, loadAvailableSlots])

	const handleDateSelect = (dateString: string) => {
		selectDate(dateString)
		selectTimeSlot(null)
	}

	const handleTimeSelect = (time: string) => {
		selectTimeSlot(time)
	}

	const handleConfirmBooking = async () => {
		if (
			!selectedDate ||
			!selectedTimeSlot ||
			!selectedServiceId ||
			!selectedBarberId ||
			!currentBusiness ||
			!user ||
			!selectedService
		) {
			return
		}

		setIsBooking(true)

		try {
			const [hours, minutes] = selectedTimeSlot.split(':').map(Number)
			// Parse date string as local time (not UTC)
			const [year, month, day] = selectedDate.split('-').map(Number)
			const dateTime = new Date(year, month - 1, day, hours, minutes, 0, 0)

			await createBooking({
				businessId: currentBusiness.id,
				barberId: selectedBarberId,
				customerId: user.id,
				serviceId: selectedServiceId,
				dateTime,
				duration: selectedService.duration,
			})

			Alert.alert(
				t('customer.booking.confirmed'),
				t('customer.booking.confirmedMessage'),
				[
					{
						text: t('customer.booking.viewBookings'),
						onPress: () => router.replace('/(app)/my-bookings'),
					},
				]
			)
		} catch (error) {
			Alert.alert(t('customer.booking.failed'), t('customer.booking.tryAgain'))
			console.error('Booking error:', error)
		} finally {
			setIsBooking(false)
		}
	}

	if (!currentBusiness || !selectedService || !selectedBarber) {
		return <LoadingScreen message={t('common.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('customer.booking.title')}</Text>
				<View style={styles.backButton} />
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Summary Card */}
				<Card style={styles.summaryCard}>
					<Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>{t('customer.booking.summary')}</Text>
					<View style={styles.summaryRow}>
						<Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('customer.booking.service')}</Text>
						<Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{selectedService.name}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('customer.booking.barber')}</Text>
						<Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{selectedBarber.name}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('customer.booking.duration')}</Text>
						<Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
							{selectedService.duration} min
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('customer.booking.price')}</Text>
						<Text style={[styles.summaryPrice, { color: colors.textPrimary }]}>${selectedService.price}</Text>
					</View>
				</Card>

				{/* Date Selection */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('customer.business.selectDate')}</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.datesContainer}
					>
						{days.map((day) => (
							<Pressable
								key={day.date}
								onPress={() => handleDateSelect(day.date)}
							>
								<View
									style={[
										styles.dateCard,
										{
											borderColor: selectedDate === day.date ? colors.primary : colors.border,
											backgroundColor: selectedDate === day.date ? colors.primary : colors.card,
										},
									]}
								>
									<Text
										style={[
											styles.dayName,
											{ color: selectedDate === day.date ? (isDarkMode ? '#000000' : '#ffffff') : colors.textSecondary },
										]}
									>
										{day.dayName}
									</Text>
									<Text
										style={[
											styles.dayNumber,
											{ color: selectedDate === day.date ? (isDarkMode ? '#000000' : '#ffffff') : colors.textPrimary },
										]}
									>
										{day.dayNumber}
									</Text>
									<Text
										style={[
											styles.month,
											{ color: selectedDate === day.date ? (isDarkMode ? '#000000' : '#ffffff') : colors.textSecondary },
										]}
									>
										{day.month}
									</Text>
								</View>
							</Pressable>
						))}
					</ScrollView>
				</View>

				{/* Time Selection */}
				{selectedDate && (
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('customer.business.selectTime')}</Text>
						{isLoading ? (
							<Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('customer.booking.loadingTimes')}</Text>
						) : availableSlots.length === 0 ? (
							<Text style={[styles.emptyText, { color: colors.textMuted }]}>
								{t('customer.business.noAvailableSlots')}
							</Text>
						) : (
							<View style={styles.timeSlotsGrid}>
								{availableSlots.map((slot) => (
									<Pressable
										key={slot.time}
										onPress={() =>
											slot.available && handleTimeSelect(slot.time)
										}
										disabled={!slot.available}
									>
										<View
											style={[
												styles.timeSlot,
												{
													borderColor: selectedTimeSlot === slot.time ? colors.primary : colors.border,
													backgroundColor: selectedTimeSlot === slot.time ? colors.primary : colors.card,
													opacity: slot.available ? 1 : 0.4,
												},
											]}
										>
											<Text
												style={[
													styles.timeText,
													{
														color: selectedTimeSlot === slot.time
															? (isDarkMode ? '#000000' : '#ffffff')
															: (slot.available ? colors.textPrimary : colors.textMuted),
													},
												]}
											>
												{slot.time}
											</Text>
										</View>
									</Pressable>
								))}
							</View>
						)}
					</View>
				)}
			</ScrollView>

			{/* Confirm Button */}
			<View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
				<Button
					onPress={handleConfirmBooking}
					loading={isBooking}
					disabled={!selectedDate || !selectedTimeSlot || isBooking}
				>
					{!selectedDate
						? t('customer.booking.selectADate')
						: !selectedTimeSlot
							? t('customer.booking.selectATime')
							: `${t('customer.booking.confirmButton')} - $${selectedService.price}`}
				</Button>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	summaryCard: {
		marginBottom: spacing.xl,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.md,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: spacing.sm,
	},
	summaryLabel: {
		fontSize: 14,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: '500',
	},
	summaryPrice: {
		fontSize: 18,
		fontWeight: '700',
	},
	section: {
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.md,
	},
	datesContainer: {
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	dateCard: {
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: borderRadius.xl,
		borderWidth: 1.5,
		minWidth: 70,
	},
	dayName: {
		fontSize: 12,
		marginBottom: spacing.xs,
		fontWeight: '500',
	},
	dayNumber: {
		fontSize: 20,
		fontWeight: '700',
	},
	month: {
		fontSize: 12,
		marginTop: spacing.xs,
		fontWeight: '500',
	},
	loadingText: {
		fontSize: 14,
	},
	emptyText: {
		fontSize: 14,
	},
	timeSlotsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	timeSlot: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.lg,
		borderWidth: 1.5,
	},
	timeText: {
		fontSize: 14,
		fontWeight: '500',
	},
	footer: {
		padding: spacing.xl,
		borderTopWidth: 1,
	},
})
