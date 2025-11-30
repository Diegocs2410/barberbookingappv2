import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
	Timestamp,
	addDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { Booking, BookingStatus, TimeSlot } from '../types'
import { BOOKING_CONFIG } from '../constants/config'

/**
 * Creates a new booking
 */
export async function createBooking(
	data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Booking> {
	const bookingRef = await addDoc(collection(db, 'bookings'), {
		...data,
		dateTime: Timestamp.fromDate(data.dateTime),
		status: 'pending' as BookingStatus,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	})

	return {
		id: bookingRef.id,
		...data,
		status: 'pending',
		createdAt: new Date(),
		updatedAt: new Date(),
	}
}

/**
 * Gets a booking by ID
 */
export async function getBooking(bookingId: string): Promise<Booking | null> {
	const bookingDoc = await getDoc(doc(db, 'bookings', bookingId))
	
	if (!bookingDoc.exists()) return null

	const data = bookingDoc.data()
	return {
		id: bookingDoc.id,
		businessId: data.businessId,
		barberId: data.barberId,
		customerId: data.customerId,
		serviceId: data.serviceId,
		dateTime: data.dateTime?.toDate() || new Date(),
		duration: data.duration,
		status: data.status,
		notes: data.notes,
		createdAt: data.createdAt?.toDate() || new Date(),
		updatedAt: data.updatedAt?.toDate() || new Date(),
	}
}

/**
 * Gets bookings for a customer
 */
export async function getCustomerBookings(customerId: string): Promise<Booking[]> {
	const q = query(
		collection(db, 'bookings'),
		where('customerId', '==', customerId),
		orderBy('dateTime', 'desc')
	)
	
	const snapshot = await getDocs(q)
	
	return snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			businessId: data.businessId,
			barberId: data.barberId,
			customerId: data.customerId,
			serviceId: data.serviceId,
			dateTime: data.dateTime?.toDate() || new Date(),
			duration: data.duration,
			status: data.status,
			notes: data.notes,
			createdAt: data.createdAt?.toDate() || new Date(),
			updatedAt: data.updatedAt?.toDate() || new Date(),
		}
	})
}

/**
 * Gets bookings for a business
 */
export async function getBusinessBookings(
	businessId: string,
	date?: Date
): Promise<Booking[]> {
	let q = query(
		collection(db, 'bookings'),
		where('businessId', '==', businessId),
		orderBy('dateTime', 'asc')
	)

	// If date is provided, filter by that date
	if (date) {
		const startOfDay = new Date(date)
		startOfDay.setHours(0, 0, 0, 0)
		
		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)

		q = query(
			collection(db, 'bookings'),
			where('businessId', '==', businessId),
			where('dateTime', '>=', Timestamp.fromDate(startOfDay)),
			where('dateTime', '<=', Timestamp.fromDate(endOfDay)),
			orderBy('dateTime', 'asc')
		)
	}
	
	const snapshot = await getDocs(q)
	
	return snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			businessId: data.businessId,
			barberId: data.barberId,
			customerId: data.customerId,
			serviceId: data.serviceId,
			dateTime: data.dateTime?.toDate() || new Date(),
			duration: data.duration,
			status: data.status,
			notes: data.notes,
			createdAt: data.createdAt?.toDate() || new Date(),
			updatedAt: data.updatedAt?.toDate() || new Date(),
		}
	})
}

/**
 * Gets bookings for a barber on a specific date
 */
export async function getBarberBookings(
	barberId: string,
	date: Date
): Promise<Booking[]> {
	const startOfDay = new Date(date)
	startOfDay.setHours(0, 0, 0, 0)
	
	const endOfDay = new Date(date)
	endOfDay.setHours(23, 59, 59, 999)

	const q = query(
		collection(db, 'bookings'),
		where('barberId', '==', barberId),
		where('dateTime', '>=', Timestamp.fromDate(startOfDay)),
		where('dateTime', '<=', Timestamp.fromDate(endOfDay)),
		where('status', 'in', ['pending', 'confirmed']),
		orderBy('dateTime', 'asc')
	)
	
	const snapshot = await getDocs(q)
	
	return snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			businessId: data.businessId,
			barberId: data.barberId,
			customerId: data.customerId,
			serviceId: data.serviceId,
			dateTime: data.dateTime?.toDate() || new Date(),
			duration: data.duration,
			status: data.status,
			notes: data.notes,
			createdAt: data.createdAt?.toDate() || new Date(),
			updatedAt: data.updatedAt?.toDate() || new Date(),
		}
	})
}

/**
 * Updates booking status
 */
export async function updateBookingStatus(
	bookingId: string,
	status: BookingStatus
): Promise<void> {
	await updateDoc(doc(db, 'bookings', bookingId), {
		status,
		updatedAt: serverTimestamp(),
	})
}

/**
 * Cancels a booking
 */
export async function cancelBooking(bookingId: string): Promise<void> {
	await updateBookingStatus(bookingId, 'cancelled')
}

/**
 * Confirms a booking
 */
export async function confirmBooking(bookingId: string): Promise<void> {
	await updateBookingStatus(bookingId, 'confirmed')
}

/**
 * Completes a booking
 */
export async function completeBooking(bookingId: string): Promise<void> {
	await updateBookingStatus(bookingId, 'completed')
}

/**
 * Generates available time slots for a barber on a specific date
 */
export async function getAvailableTimeSlots(
	barberId: string,
	businessId: string,
	date: Date,
	serviceDuration: number,
	workingHours: { start: string; end: string; isOpen: boolean }
): Promise<TimeSlot[]> {
	if (!workingHours.isOpen) {
		return []
	}

	const slots: TimeSlot[] = []
	const existingBookings = await getBarberBookings(barberId, date)
	
	const [startHour, startMinute] = workingHours.start.split(':').map(Number)
	const [endHour, endMinute] = workingHours.end.split(':').map(Number)
	
	const slotDuration = BOOKING_CONFIG.slotDurationMinutes
	
	// Generate all possible slots
	let currentHour = startHour
	let currentMinute = startMinute
	
	while (
		currentHour < endHour ||
		(currentHour === endHour && currentMinute < endMinute)
	) {
		const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
		
		// Check if slot is available
		const slotStart = new Date(date)
		slotStart.setHours(currentHour, currentMinute, 0, 0)
		
		const slotEnd = new Date(slotStart)
		slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration)
		
		// Check if slot overlaps with any existing booking
		const isBooked = existingBookings.some((booking) => {
			const bookingStart = booking.dateTime
			const bookingEnd = new Date(bookingStart)
			bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.duration)
			
			// Check for overlap
			return slotStart < bookingEnd && slotEnd > bookingStart
		})
		
		// Check if slot is in the past
		const now = new Date()
		const minBookingTime = new Date(now)
		minBookingTime.setHours(
			minBookingTime.getHours() + BOOKING_CONFIG.minAdvanceBookingHours
		)
		
		const isPast = slotStart < minBookingTime
		
		slots.push({
			time: timeString,
			available: !isBooked && !isPast,
		})
		
		// Move to next slot
		currentMinute += slotDuration
		if (currentMinute >= 60) {
			currentHour += Math.floor(currentMinute / 60)
			currentMinute = currentMinute % 60
		}
	}
	
	return slots
}

