export interface WorkingHours {
	start: string // "09:00"
	end: string // "18:00"
	isOpen: boolean
}

export interface WeeklySchedule {
	monday: WorkingHours
	tuesday: WorkingHours
	wednesday: WorkingHours
	thursday: WorkingHours
	friday: WorkingHours
	saturday: WorkingHours
	sunday: WorkingHours
}

export interface Business {
	id: string
	name: string
	address: string
	phone: string
	logoUrl?: string | null
	description?: string
	ownerId: string
	subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled'
	workingHours: WeeklySchedule
	createdAt: Date
	updatedAt: Date
}

export interface Barber {
	id: string
	userId: string
	businessId: string
	name: string
	photoUrl?: string | null
	specialties: string[]
	isActive: boolean
	createdAt: Date
}

export interface Service {
	id: string
	businessId: string
	name: string
	description?: string
	duration: number // in minutes
	price: number
	isActive: boolean
	createdAt: Date
}

export interface BusinessState {
	businesses: Business[]
	currentBusiness: Business | null
	barbers: Barber[]
	services: Service[]
	isLoading: boolean
	error: string | null
}

