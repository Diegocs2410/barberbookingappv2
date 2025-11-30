export const APP_CONFIG = {
	name: 'BarberBooking',
	version: '1.0.0',
	defaultLocale: 'en',
}

export const BOOKING_CONFIG = {
	minAdvanceBookingHours: 1, // Minimum hours in advance to book
	maxAdvanceBookingDays: 30, // Maximum days in advance to book
	slotDurationMinutes: 30, // Time slot duration
	cancellationWindowHours: 2, // Hours before appointment to allow cancellation
}

export const SUBSCRIPTION_PLANS = {
	trial: {
		name: 'Trial',
		durationDays: 14,
		maxBarbers: 2,
		maxBookingsPerMonth: 50,
	},
	basic: {
		name: 'Basic',
		priceMonthly: 29.99,
		maxBarbers: 5,
		maxBookingsPerMonth: 200,
	},
	pro: {
		name: 'Pro',
		priceMonthly: 59.99,
		maxBarbers: 15,
		maxBookingsPerMonth: -1, // unlimited
	},
	enterprise: {
		name: 'Enterprise',
		priceMonthly: 99.99,
		maxBarbers: -1, // unlimited
		maxBookingsPerMonth: -1, // unlimited
	},
}

