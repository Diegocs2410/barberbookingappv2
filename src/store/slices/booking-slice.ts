import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Booking, BookingState, TimeSlot } from '../../types'
import * as bookingService from '../../services/booking-service'

const initialState: BookingState = {
	bookings: [],
	upcomingBookings: [],
	pastBookings: [],
	selectedDate: null,
	selectedTimeSlot: null,
	selectedBarberId: null,
	selectedServiceId: null,
	availableSlots: [],
	isLoading: false,
	error: null,
}

// Helper to categorize bookings
function categorizeBookings(bookings: Booking[]) {
	const now = new Date()
	const upcoming: Booking[] = []
	const past: Booking[] = []

	bookings.forEach((booking) => {
		if (booking.dateTime > now && booking.status !== 'cancelled') {
			upcoming.push(booking)
		} else {
			past.push(booking)
		}
	})

	return { upcoming, past }
}

// Async thunks
export const fetchCustomerBookings = createAsyncThunk(
	'booking/fetchCustomerBookings',
	async (customerId: string, { rejectWithValue }) => {
		try {
			const bookings = await bookingService.getCustomerBookings(customerId)
			return bookings
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch bookings'
			return rejectWithValue(message)
		}
	}
)

export const fetchBusinessBookings = createAsyncThunk(
	'booking/fetchBusinessBookings',
	async ({ businessId, date }: { businessId: string; date?: Date }, { rejectWithValue }) => {
		try {
			const bookings = await bookingService.getBusinessBookings(businessId, date)
			return bookings
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch bookings'
			return rejectWithValue(message)
		}
	}
)

export const fetchAvailableSlots = createAsyncThunk(
	'booking/fetchAvailableSlots',
	async (
		{
			barberId,
			businessId,
			date,
			serviceDuration,
			workingHours,
		}: {
			barberId: string
			businessId: string
			date: Date
			serviceDuration: number
			workingHours: { start: string; end: string; isOpen: boolean }
		},
		{ rejectWithValue }
	) => {
		try {
			const slots = await bookingService.getAvailableTimeSlots(
				barberId,
				businessId,
				date,
				serviceDuration,
				workingHours
			)
			return slots
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch available slots'
			return rejectWithValue(message)
		}
	}
)

export const createBooking = createAsyncThunk(
	'booking/create',
	async (
		data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
		{ rejectWithValue }
	) => {
		try {
			const booking = await bookingService.createBooking(data)
			return booking
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create booking'
			return rejectWithValue(message)
		}
	}
)

export const cancelBooking = createAsyncThunk(
	'booking/cancel',
	async (bookingId: string, { rejectWithValue }) => {
		try {
			await bookingService.cancelBooking(bookingId)
			return bookingId
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to cancel booking'
			return rejectWithValue(message)
		}
	}
)

export const confirmBooking = createAsyncThunk(
	'booking/confirm',
	async (bookingId: string, { rejectWithValue }) => {
		try {
			await bookingService.confirmBooking(bookingId)
			return bookingId
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to confirm booking'
			return rejectWithValue(message)
		}
	}
)

export const completeBooking = createAsyncThunk(
	'booking/complete',
	async (bookingId: string, { rejectWithValue }) => {
		try {
			await bookingService.completeBooking(bookingId)
			return bookingId
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to complete booking'
			return rejectWithValue(message)
		}
	}
)

const bookingSlice = createSlice({
	name: 'booking',
	initialState,
	reducers: {
		setSelectedDate: (state, action: PayloadAction<string | null>) => {
			state.selectedDate = action.payload
			state.selectedTimeSlot = null // Reset time slot when date changes
		},
		setSelectedTimeSlot: (state, action: PayloadAction<string | null>) => {
			state.selectedTimeSlot = action.payload
		},
		setSelectedBarberId: (state, action: PayloadAction<string | null>) => {
			state.selectedBarberId = action.payload
			state.selectedTimeSlot = null // Reset when barber changes
			state.availableSlots = []
		},
		setSelectedServiceId: (state, action: PayloadAction<string | null>) => {
			state.selectedServiceId = action.payload
		},
		clearBookingSelection: (state) => {
			state.selectedDate = null
			state.selectedTimeSlot = null
			state.selectedBarberId = null
			state.selectedServiceId = null
			state.availableSlots = []
		},
		clearError: (state) => {
			state.error = null
		},
	},
	extraReducers: (builder) => {
		// Fetch customer bookings
		builder
			.addCase(fetchCustomerBookings.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchCustomerBookings.fulfilled, (state, action) => {
				state.isLoading = false
				state.bookings = action.payload
				const { upcoming, past } = categorizeBookings(action.payload)
				state.upcomingBookings = upcoming
				state.pastBookings = past
			})
			.addCase(fetchCustomerBookings.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Fetch business bookings
		builder
			.addCase(fetchBusinessBookings.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchBusinessBookings.fulfilled, (state, action) => {
				state.isLoading = false
				state.bookings = action.payload
			})
			.addCase(fetchBusinessBookings.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Fetch available slots
		builder
			.addCase(fetchAvailableSlots.pending, (state) => {
				state.isLoading = true
			})
			.addCase(fetchAvailableSlots.fulfilled, (state, action) => {
				state.isLoading = false
				state.availableSlots = action.payload
			})
			.addCase(fetchAvailableSlots.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Create booking
		builder
			.addCase(createBooking.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createBooking.fulfilled, (state, action) => {
				state.isLoading = false
				state.bookings.unshift(action.payload)
				state.upcomingBookings.unshift(action.payload)
				// Clear selection after successful booking
				state.selectedDate = null
				state.selectedTimeSlot = null
				state.selectedBarberId = null
				state.selectedServiceId = null
				state.availableSlots = []
			})
			.addCase(createBooking.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Cancel booking
		builder.addCase(cancelBooking.fulfilled, (state, action) => {
			const booking = state.bookings.find((b) => b.id === action.payload)
			if (booking) {
				booking.status = 'cancelled'
			}
			state.upcomingBookings = state.upcomingBookings.filter(
				(b) => b.id !== action.payload
			)
		})

		// Confirm booking
		builder.addCase(confirmBooking.fulfilled, (state, action) => {
			const booking = state.bookings.find((b) => b.id === action.payload)
			if (booking) {
				booking.status = 'confirmed'
			}
			const upcomingBooking = state.upcomingBookings.find(
				(b) => b.id === action.payload
			)
			if (upcomingBooking) {
				upcomingBooking.status = 'confirmed'
			}
		})

		// Complete booking
		builder.addCase(completeBooking.fulfilled, (state, action) => {
			const booking = state.bookings.find((b) => b.id === action.payload)
			if (booking) {
				booking.status = 'completed'
			}
		})
	},
})

export const {
	setSelectedDate,
	setSelectedTimeSlot,
	setSelectedBarberId,
	setSelectedServiceId,
	clearBookingSelection,
	clearError,
} = bookingSlice.actions

export default bookingSlice.reducer

