import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
	fetchCustomerBookings,
	fetchBusinessBookings,
	fetchAvailableSlots,
	createBooking as createBookingAction,
	cancelBooking as cancelBookingAction,
	confirmBooking as confirmBookingAction,
	completeBooking as completeBookingAction,
	setSelectedDate,
	setSelectedTimeSlot,
	setSelectedBarberId,
	setSelectedServiceId,
	clearBookingSelection,
} from '../store/slices/booking-slice'
import { Booking } from '../types'

export function useBooking() {
	const dispatch = useAppDispatch()
	const {
		bookings,
		upcomingBookings,
		pastBookings,
		selectedDate,
		selectedTimeSlot,
		selectedBarberId,
		selectedServiceId,
		availableSlots,
		isLoading,
		error,
	} = useAppSelector((state) => state.booking)

	// Fetch operations
	const loadCustomerBookings = useCallback(
		async (customerId: string) => {
			return dispatch(fetchCustomerBookings(customerId)).unwrap()
		},
		[dispatch]
	)

	const loadBusinessBookings = useCallback(
		async (businessId: string, date?: Date) => {
			return dispatch(fetchBusinessBookings({ businessId, date })).unwrap()
		},
		[dispatch]
	)

	const loadAvailableSlots = useCallback(
		async (
			barberId: string,
			businessId: string,
			date: Date,
			serviceDuration: number,
			workingHours: { start: string; end: string; isOpen: boolean }
		) => {
			return dispatch(
				fetchAvailableSlots({
					barberId,
					businessId,
					date,
					serviceDuration,
					workingHours,
				})
			).unwrap()
		},
		[dispatch]
	)

	// Booking operations
	const createBooking = useCallback(
		async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
			return dispatch(createBookingAction(data)).unwrap()
		},
		[dispatch]
	)

	const cancelBooking = useCallback(
		async (bookingId: string) => {
			return dispatch(cancelBookingAction(bookingId)).unwrap()
		},
		[dispatch]
	)

	const confirmBooking = useCallback(
		async (bookingId: string) => {
			return dispatch(confirmBookingAction(bookingId)).unwrap()
		},
		[dispatch]
	)

	const completeBooking = useCallback(
		async (bookingId: string) => {
			return dispatch(completeBookingAction(bookingId)).unwrap()
		},
		[dispatch]
	)

	// Selection operations
	const selectDate = useCallback(
		(date: string | null) => {
			dispatch(setSelectedDate(date))
		},
		[dispatch]
	)

	const selectTimeSlot = useCallback(
		(timeSlot: string | null) => {
			dispatch(setSelectedTimeSlot(timeSlot))
		},
		[dispatch]
	)

	const selectBarber = useCallback(
		(barberId: string | null) => {
			dispatch(setSelectedBarberId(barberId))
		},
		[dispatch]
	)

	const selectService = useCallback(
		(serviceId: string | null) => {
			dispatch(setSelectedServiceId(serviceId))
		},
		[dispatch]
	)

	const clearSelection = useCallback(() => {
		dispatch(clearBookingSelection())
	}, [dispatch])

	return {
		// State
		bookings,
		upcomingBookings,
		pastBookings,
		selectedDate,
		selectedTimeSlot,
		selectedBarberId,
		selectedServiceId,
		availableSlots,
		isLoading,
		error,
		// Fetch operations
		loadCustomerBookings,
		loadBusinessBookings,
		loadAvailableSlots,
		// Booking operations
		createBooking,
		cancelBooking,
		confirmBooking,
		completeBooking,
		// Selection operations
		selectDate,
		selectTimeSlot,
		selectBarber,
		selectService,
		clearSelection,
	}
}

