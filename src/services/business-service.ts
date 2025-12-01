import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
	addDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { Business, Barber, Service, WeeklySchedule, User } from '../types'

const DEFAULT_WORKING_HOURS: WeeklySchedule = {
	monday: { start: '09:00', end: '18:00', isOpen: true },
	tuesday: { start: '09:00', end: '18:00', isOpen: true },
	wednesday: { start: '09:00', end: '18:00', isOpen: true },
	thursday: { start: '09:00', end: '18:00', isOpen: true },
	friday: { start: '09:00', end: '18:00', isOpen: true },
	saturday: { start: '09:00', end: '15:00', isOpen: true },
	sunday: { start: '00:00', end: '00:00', isOpen: false },
}

// ============= BUSINESS OPERATIONS =============

/**
 * Creates a new business
 */
export async function createBusiness(
	ownerId: string,
	data: Pick<Business, 'name' | 'address' | 'phone' | 'description'>
): Promise<Business> {
	const businessRef = doc(collection(db, 'businesses'))
	
	const businessData: Omit<Business, 'id'> = {
		...data,
		logoUrl: null,
		ownerId,
		subscriptionStatus: 'trial',
		workingHours: DEFAULT_WORKING_HOURS,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	// Prepare Firestore data (exclude undefined values)
	const firestoreData: Record<string, unknown> = {
		name: data.name,
		address: data.address,
		phone: data.phone,
		description: data.description,
		ownerId,
		subscriptionStatus: 'trial',
		workingHours: DEFAULT_WORKING_HOURS,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	}

	await setDoc(businessRef, firestoreData)

	return { id: businessRef.id, ...businessData }
}

/**
 * Gets a business by ID
 */
export async function getBusiness(businessId: string): Promise<Business | null> {
	const businessDoc = await getDoc(doc(db, 'businesses', businessId))
	
	if (!businessDoc.exists()) return null

	const data = businessDoc.data()
	return {
		id: businessDoc.id,
		name: data.name,
		address: data.address,
		phone: data.phone,
		logoUrl: data.logoUrl,
		description: data.description,
		ownerId: data.ownerId,
		subscriptionStatus: data.subscriptionStatus,
		workingHours: data.workingHours,
		createdAt: data.createdAt?.toDate() || new Date(),
		updatedAt: data.updatedAt?.toDate() || new Date(),
	}
}

/**
 * Gets all businesses (for customer discovery)
 */
export async function getAllBusinesses(): Promise<Business[]> {
	// Simple query without composite index requirement
	const q = query(
		collection(db, 'businesses'),
		where('subscriptionStatus', 'in', ['active', 'trial'])
	)
	
	const snapshot = await getDocs(q)
	
	const businesses = snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			name: data.name,
			address: data.address,
			phone: data.phone,
			logoUrl: data.logoUrl,
			description: data.description,
			ownerId: data.ownerId,
			subscriptionStatus: data.subscriptionStatus,
			workingHours: data.workingHours,
			createdAt: data.createdAt?.toDate() || new Date(),
			updatedAt: data.updatedAt?.toDate() || new Date(),
		}
	})
	
	// Sort by name in JavaScript (avoids needing composite index)
	return businesses.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Gets business by owner ID
 */
export async function getBusinessByOwner(ownerId: string): Promise<Business | null> {
	const q = query(
		collection(db, 'businesses'),
		where('ownerId', '==', ownerId)
	)
	
	const snapshot = await getDocs(q)
	
	if (snapshot.empty) return null

	const doc = snapshot.docs[0]
	const data = doc.data()
	return {
		id: doc.id,
		name: data.name,
		address: data.address,
		phone: data.phone,
		logoUrl: data.logoUrl,
		description: data.description,
		ownerId: data.ownerId,
		subscriptionStatus: data.subscriptionStatus,
		workingHours: data.workingHours,
		createdAt: data.createdAt?.toDate() || new Date(),
		updatedAt: data.updatedAt?.toDate() || new Date(),
	}
}

/**
 * Updates a business
 */
export async function updateBusiness(
	businessId: string,
	data: Partial<Omit<Business, 'id' | 'ownerId' | 'createdAt'>>
): Promise<void> {
	await updateDoc(doc(db, 'businesses', businessId), {
		...data,
		updatedAt: serverTimestamp(),
	})
}

// ============= USER OPERATIONS =============

/**
 * Busca un usuario por email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
	const q = query(
		collection(db, 'users'),
		where('email', '==', email.toLowerCase().trim())
	)
	
	const snapshot = await getDocs(q)
	
	if (snapshot.empty) return null

	const userDoc = snapshot.docs[0]
	const data = userDoc.data()
	return {
		id: userDoc.id,
		email: data.email,
		name: data.name,
		phone: data.phone,
		photoUrl: data.photoUrl,
		role: data.role,
		businessId: data.businessId,
		createdAt: data.createdAt?.toDate() || new Date(),
		updatedAt: data.updatedAt?.toDate() || new Date(),
	}
}

// ============= BARBER OPERATIONS =============

/**
 * Busca un barbero pendiente de vinculación por email en todas las barberías
 * @returns El barbero y el businessId si existe, null si no
 */
export async function findPendingBarberByEmail(
	email: string
): Promise<{ barber: Barber; businessId: string } | null> {
	// Primero obtener todas las barberías activas
	const businessesQuery = query(
		collection(db, 'businesses'),
		where('subscriptionStatus', 'in', ['active', 'trial'])
	)
	
	const businessesSnapshot = await getDocs(businessesQuery)
	
	// Buscar en cada barbería si hay un barbero con ese email pendiente
	for (const businessDoc of businessesSnapshot.docs) {
		const barbersQuery = query(
			collection(db, 'businesses', businessDoc.id, 'barbers'),
			where('email', '==', email.toLowerCase().trim()),
			where('isLinked', '==', false),
			where('isActive', '==', true)
		)
		
		const barbersSnapshot = await getDocs(barbersQuery)
		
		if (!barbersSnapshot.empty) {
			const barberDoc = barbersSnapshot.docs[0]
			const data = barberDoc.data()
			
			return {
				barber: {
					id: barberDoc.id,
					businessId: businessDoc.id,
					userId: data.userId || '',
					name: data.name,
					email: data.email,
					photoUrl: data.photoUrl,
					specialties: data.specialties || [],
					isActive: data.isActive,
					isLinked: data.isLinked || false,
					createdAt: data.createdAt?.toDate() || new Date(),
				},
				businessId: businessDoc.id,
			}
		}
	}
	
	return null
}

/**
 * Adds a barber to a business
 */
export async function addBarber(
	businessId: string,
	data: Pick<Barber, 'userId' | 'name' | 'specialties'> & { email?: string }
): Promise<Barber> {
	const barberRef = await addDoc(
		collection(db, 'businesses', businessId, 'barbers'),
		{
			userId: data.userId || '',
			name: data.name,
			email: data.email?.toLowerCase().trim() || '',
			specialties: data.specialties,
			businessId,
			isActive: true,
			isLinked: !!data.userId,
			createdAt: serverTimestamp(),
		}
	)

	return {
		id: barberRef.id,
		businessId,
		userId: data.userId || '',
		name: data.name,
		email: data.email?.toLowerCase().trim(),
		specialties: data.specialties,
		isActive: true,
		isLinked: !!data.userId,
		createdAt: new Date(),
	}
}

/**
 * Gets all barbers for a business
 */
export async function getBarbers(businessId: string): Promise<Barber[]> {
	const q = query(
		collection(db, 'businesses', businessId, 'barbers'),
		where('isActive', '==', true)
	)
	
	const snapshot = await getDocs(q)
	
	return snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			businessId: data.businessId,
			userId: data.userId || '',
			name: data.name,
			email: data.email,
			photoUrl: data.photoUrl,
			specialties: data.specialties || [],
			isActive: data.isActive,
			isLinked: data.isLinked || false,
			createdAt: data.createdAt?.toDate() || new Date(),
		}
	})
}

/**
 * Updates a barber
 */
export async function updateBarber(
	businessId: string,
	barberId: string,
	data: Partial<Pick<Barber, 'name' | 'photoUrl' | 'specialties' | 'isActive' | 'email'>>
): Promise<void> {
	const updateData: Record<string, unknown> = { ...data }
	if (data.email) {
		updateData.email = data.email.toLowerCase().trim()
	}
	await updateDoc(doc(db, 'businesses', businessId, 'barbers', barberId), updateData)
}

/**
 * Vincula un barbero con un usuario existente
 */
export async function linkBarberToUser(
	businessId: string,
	barberId: string,
	userId: string
): Promise<void> {
	// Actualizar el documento del barbero
	await updateDoc(doc(db, 'businesses', businessId, 'barbers', barberId), {
		userId,
		isLinked: true,
	})

	// Actualizar el rol del usuario a barbero y asignar el businessId
	await updateDoc(doc(db, 'users', userId), {
		role: 'barber',
		businessId,
		updatedAt: serverTimestamp(),
	})
}

/**
 * Desvincula un barbero de su cuenta de usuario
 */
export async function unlinkBarber(
	businessId: string,
	barberId: string
): Promise<void> {
	// Obtener el barbero para saber el userId
	const barberDoc = await getDoc(doc(db, 'businesses', businessId, 'barbers', barberId))
	
	if (!barberDoc.exists()) {
		throw new Error('Barbero no encontrado')
	}

	const barberData = barberDoc.data()
	const userId = barberData.userId

	// Actualizar el documento del barbero
	await updateDoc(doc(db, 'businesses', businessId, 'barbers', barberId), {
		userId: '',
		isLinked: false,
	})

	// Si había un usuario vinculado, revertir su rol a customer
	if (userId) {
		await updateDoc(doc(db, 'users', userId), {
			role: 'customer',
			businessId: null,
			updatedAt: serverTimestamp(),
		})
	}
}

/**
 * Deletes (deactivates) a barber and unlinks the user if linked
 */
export async function deleteBarber(
	businessId: string,
	barberId: string
): Promise<void> {
	// Obtener el barbero para verificar si está vinculado
	const barberDoc = await getDoc(doc(db, 'businesses', businessId, 'barbers', barberId))
	
	if (barberDoc.exists()) {
		const barberData = barberDoc.data()
		
		// Si está vinculado a un usuario, revertir su rol
		if (barberData.isLinked && barberData.userId) {
			await updateDoc(doc(db, 'users', barberData.userId), {
				role: 'customer',
				businessId: null,
				updatedAt: serverTimestamp(),
			})
		}
	}

	// Desactivar el barbero
	await updateDoc(doc(db, 'businesses', businessId, 'barbers', barberId), {
		isActive: false,
		isLinked: false,
		userId: '',
	})
}

// ============= SERVICE OPERATIONS =============

/**
 * Adds a service to a business
 */
export async function addService(
	businessId: string,
	data: Pick<Service, 'name' | 'description' | 'duration' | 'price'>
): Promise<Service> {
	const serviceRef = await addDoc(
		collection(db, 'businesses', businessId, 'services'),
		{
			...data,
			businessId,
			isActive: true,
			createdAt: serverTimestamp(),
		}
	)

	return {
		id: serviceRef.id,
		businessId,
		...data,
		isActive: true,
		createdAt: new Date(),
	}
}

/**
 * Gets all services for a business
 */
export async function getServices(businessId: string): Promise<Service[]> {
	const q = query(
		collection(db, 'businesses', businessId, 'services'),
		where('isActive', '==', true)
	)
	
	const snapshot = await getDocs(q)
	
	return snapshot.docs.map((doc) => {
		const data = doc.data()
		return {
			id: doc.id,
			businessId: data.businessId,
			name: data.name,
			description: data.description,
			duration: data.duration,
			price: data.price,
			isActive: data.isActive,
			createdAt: data.createdAt?.toDate() || new Date(),
		}
	})
}

/**
 * Updates a service
 */
export async function updateService(
	businessId: string,
	serviceId: string,
	data: Partial<Pick<Service, 'name' | 'description' | 'duration' | 'price' | 'isActive'>>
): Promise<void> {
	await updateDoc(doc(db, 'businesses', businessId, 'services', serviceId), data)
}

/**
 * Deletes (deactivates) a service
 */
export async function deleteService(
	businessId: string,
	serviceId: string
): Promise<void> {
	await updateDoc(doc(db, 'businesses', businessId, 'services', serviceId), {
		isActive: false,
	})
}

