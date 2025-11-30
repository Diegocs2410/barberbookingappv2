import React, { useEffect, useState, useMemo } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useBooking, useAuth } from '../../../../src/hooks'
import { Button, Card, LoadingScreen } from '../../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../../src/constants/theme'

// Generate next 14 days
function getNextDays(count: number) {
	const days = []
	const today = new Date()

	for (let i = 0; i < count; i++) {
		const date = new Date(today)
		date.setDate(date.getDate() + i)
		days.push({
			date: date.toISOString().split('T')[0],
			dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
			dayNumber: date.getDate(),
			month: date.toLocaleDateString('en-US', { month: 'short' }),
			fullDate: date,
		})
	}

	return days
}

function getDayOfWeek(dateString: string): string {
	const date = new Date(dateString)
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

	const days = useMemo(() => getNextDays(14), [])

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

			loadAvailableSlots(
				selectedBarberId,
				currentBusiness.id,
				new Date(selectedDate),
				selectedService.duration,
				workingHours
			)
		}
	}, [selectedDate, selectedBarberId, selectedServiceId, currentBusiness])

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
			const dateTime = new Date(selectedDate)
			dateTime.setHours(hours, minutes, 0, 0)

			await createBooking({
				businessId: currentBusiness.id,
				barberId: selectedBarberId,
				customerId: user.id,
				serviceId: selectedServiceId,
				dateTime,
				duration: selectedService.duration,
			})

			Alert.alert(
				'Booking Confirmed!',
				`Your appointment is scheduled for ${selectedDate} at ${selectedTimeSlot}`,
				[
					{
						text: 'View Bookings',
						onPress: () => router.replace('/(app)/my-bookings'),
					},
				]
			)
		} catch (error) {
			Alert.alert('Booking Failed', 'Please try again later.')
			console.error('Booking error:', error)
		} finally {
			setIsBooking(false)
		}
	}

	if (!currentBusiness || !selectedService || !selectedBarber) {
		return <LoadingScreen message="Loading..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={styles.headerTitle}>Book Appointment</Text>
				<View style={styles.backButton} />
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Summary Card */}
				<Card style={styles.summaryCard}>
					<Text style={styles.summaryTitle}>Booking Summary</Text>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Service</Text>
						<Text style={styles.summaryValue}>{selectedService.name}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Barber</Text>
						<Text style={styles.summaryValue}>{selectedBarber.name}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Duration</Text>
						<Text style={styles.summaryValue}>
							{selectedService.duration} min
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Price</Text>
						<Text style={styles.summaryPrice}>${selectedService.price}</Text>
					</View>
				</Card>

				{/* Date Selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Select Date</Text>
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
										selectedDate === day.date && styles.selectedDateCard,
									]}
								>
									<Text
										style={[
											styles.dayName,
											selectedDate === day.date && styles.selectedText,
										]}
									>
										{day.dayName}
									</Text>
									<Text
										style={[
											styles.dayNumber,
											selectedDate === day.date && styles.selectedText,
										]}
									>
										{day.dayNumber}
									</Text>
									<Text
										style={[
											styles.month,
											selectedDate === day.date && styles.selectedText,
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
						<Text style={styles.sectionTitle}>Select Time</Text>
						{isLoading ? (
							<Text style={styles.loadingText}>Loading available times...</Text>
						) : availableSlots.length === 0 ? (
							<Text style={styles.emptyText}>
								No available slots for this date
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
												!slot.available && styles.unavailableSlot,
												selectedTimeSlot === slot.time && styles.selectedTimeSlot,
											]}
										>
											<Text
												style={[
													styles.timeText,
													!slot.available && styles.unavailableText,
													selectedTimeSlot === slot.time && styles.selectedText,
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
			<View style={styles.footer}>
				<Button
					onPress={handleConfirmBooking}
					loading={isBooking}
					disabled={!selectedDate || !selectedTimeSlot || isBooking}
				>
					{!selectedDate
						? 'Select a Date'
						: !selectedTimeSlot
							? 'Select a Time'
							: `Confirm Booking - $${selectedService.price}`}
				</Button>
			</View>
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
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
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
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: spacing.sm,
	},
	summaryLabel: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	summaryPrice: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.accent,
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
	datesContainer: {
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	dateCard: {
		alignItems: 'center',
		padding: spacing.md,
		backgroundColor: colors.card,
		borderRadius: borderRadius.lg,
		borderWidth: 2,
		borderColor: colors.border,
		minWidth: 70,
	},
	selectedDateCard: {
		borderColor: colors.accent,
		backgroundColor: colors.accent,
	},
	dayName: {
		fontSize: 12,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	dayNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.textPrimary,
	},
	month: {
		fontSize: 12,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	selectedText: {
		color: colors.textPrimary,
	},
	loadingText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	emptyText: {
		fontSize: 14,
		color: colors.textMuted,
	},
	timeSlotsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	timeSlot: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		backgroundColor: colors.card,
		borderRadius: borderRadius.md,
		borderWidth: 2,
		borderColor: colors.border,
	},
	unavailableSlot: {
		opacity: 0.4,
	},
	selectedTimeSlot: {
		borderColor: colors.accent,
		backgroundColor: colors.accent,
	},
	timeText: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	unavailableText: {
		color: colors.textMuted,
	},
	footer: {
		padding: spacing.xl,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		backgroundColor: colors.surface,
	},
})

