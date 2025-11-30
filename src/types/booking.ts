export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
	id: string
	businessId: string
	barberId: string
	customerId: string
	serviceId: string
	dateTime: Date
	duration: number // in minutes
	status: BookingStatus
	notes?: string
	createdAt: Date
	updatedAt: Date
}

export interface TimeSlot {
	time: string // "09:00"
	available: boolean
}

export interface BookingState {
	bookings: Booking[]
	upcomingBookings: Booking[]
	pastBookings: Booking[]
	selectedDate: string | null
	selectedTimeSlot: string | null
	selectedBarberId: string | null
	selectedServiceId: string | null
	availableSlots: TimeSlot[]
	isLoading: boolean
	error: string | null
}

