export type UserRole = 'customer' | 'barber' | 'owner'

export interface User {
	id: string
	email: string
	name: string
	phone?: string
	photoUrl?: string | null
	role: UserRole
	businessId?: string
	createdAt: Date
	updatedAt: Date
}

export interface AuthState {
	user: User | null
	isLoading: boolean
	isAuthenticated: boolean
	error: string | null
}

