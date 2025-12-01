import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	updateProfile,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithCredential,
	User as FirebaseUser,
} from 'firebase/auth'
import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	serverTimestamp,
} from 'firebase/firestore'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { auth, db } from './firebase'
import { User, UserRole } from '../types'

WebBrowser.maybeCompleteAuthSession()

/**
 * Creates a new user account with email and password
 */
export async function signUp(
	email: string,
	password: string,
	name: string
): Promise<User> {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password)
	const { user: firebaseUser } = userCredential

	// Update display name
	await updateProfile(firebaseUser, { displayName: name })

	// Create user document in Firestore (without role initially)
	const userData: Omit<User, 'id'> = {
		email: firebaseUser.email!,
		name,
		phone: '',
		photoUrl: firebaseUser.photoURL || null,
		role: 'customer', // Default role, will be updated after role selection
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	// Prepare data for Firestore (exclude undefined values)
	const firestoreData: Record<string, unknown> = {
		email: userData.email,
		name: userData.name,
		phone: userData.phone,
		role: userData.role,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	}
	
	// Only add photoUrl if it exists
	if (firebaseUser.photoURL) {
		firestoreData.photoUrl = firebaseUser.photoURL
	}

	await setDoc(doc(db, 'users', firebaseUser.uid), firestoreData)

	return { id: firebaseUser.uid, ...userData }
}

/**
 * Signs in a user with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
	const userCredential = await signInWithEmailAndPassword(auth, email, password)
	const { user: firebaseUser } = userCredential

	// Get user data from Firestore
	const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

	if (!userDoc.exists()) {
		throw new Error('User data not found')
	}

	const userData = userDoc.data()
	return {
		id: firebaseUser.uid,
		email: userData.email,
		name: userData.name,
		phone: userData.phone,
		photoUrl: userData.photoUrl,
		role: userData.role,
		businessId: userData.businessId,
		createdAt: userData.createdAt?.toDate() || new Date(),
		updatedAt: userData.updatedAt?.toDate() || new Date(),
	}
}

/**
 * Signs in or signs up a user with Google
 */
export async function signInWithGoogle(idToken: string): Promise<User> {
	// Create a Google credential with the token
	const credential = GoogleAuthProvider.credential(idToken)
	
	// Sign in with the credential
	const userCredential = await signInWithCredential(auth, credential)
	const { user: firebaseUser } = userCredential

	// Check if user already exists in Firestore
	const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

	if (userDoc.exists()) {
		// Existing user - return user data
		const userData = userDoc.data()
		return {
			id: firebaseUser.uid,
			email: userData.email,
			name: userData.name,
			phone: userData.phone || '',
			photoUrl: userData.photoUrl || firebaseUser.photoURL || null,
			role: userData.role,
			businessId: userData.businessId,
			createdAt: userData.createdAt?.toDate() || new Date(),
			updatedAt: userData.updatedAt?.toDate() || new Date(),
		}
	} else {
		// New user - create user document
		const userData: Omit<User, 'id'> = {
			email: firebaseUser.email!,
			name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
			phone: '',
			photoUrl: firebaseUser.photoURL || null,
			role: 'customer', // Default role, will be updated after role selection
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		// Prepare data for Firestore
		const firestoreData: Record<string, unknown> = {
			email: userData.email,
			name: userData.name,
			phone: userData.phone,
			role: userData.role,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		}
		
		// Add photoUrl if exists
		if (firebaseUser.photoURL) {
			firestoreData.photoUrl = firebaseUser.photoURL
		}

		await setDoc(doc(db, 'users', firebaseUser.uid), firestoreData)

		return { id: firebaseUser.uid, ...userData }
	}
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
	await firebaseSignOut(auth)
}

/**
 * Gets the current user data from Firestore
 */
export async function getCurrentUser(): Promise<User | null> {
	const firebaseUser = auth.currentUser
	if (!firebaseUser) return null

	const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
	if (!userDoc.exists()) return null

	const userData = userDoc.data()
	return {
		id: firebaseUser.uid,
		email: userData.email,
		name: userData.name,
		phone: userData.phone,
		photoUrl: userData.photoUrl,
		role: userData.role,
		businessId: userData.businessId,
		createdAt: userData.createdAt?.toDate() || new Date(),
		updatedAt: userData.updatedAt?.toDate() || new Date(),
	}
}

/**
 * Updates the user's role after registration
 */
export async function updateUserRole(
	userId: string,
	role: UserRole,
	businessId?: string
): Promise<void> {
	const updateData: Record<string, unknown> = {
		role,
		updatedAt: serverTimestamp(),
	}

	if (businessId) {
		updateData.businessId = businessId
	}

	await updateDoc(doc(db, 'users', userId), updateData)
}

/**
 * Updates user profile information
 */
export async function updateUserProfile(
	userId: string,
	data: Partial<Pick<User, 'name' | 'phone' | 'photoUrl'>>
): Promise<void> {
	await updateDoc(doc(db, 'users', userId), {
		...data,
		updatedAt: serverTimestamp(),
	})

	// Also update Firebase Auth profile if name changed
	if (data.name && auth.currentUser) {
		await updateProfile(auth.currentUser, { displayName: data.name })
	}
}

/**
 * Sends a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
	await sendPasswordResetEmail(auth, email)
}

/**
 * Subscribes to auth state changes
 */
export function onAuthChange(
	callback: (user: FirebaseUser | null) => void
): () => void {
	return onAuthStateChanged(auth, callback)
}

/**
 * Migra usuarios con rol 'barber' a 'customer'
 * Esta función se usa una sola vez para migrar datos existentes
 */
export async function migrateBarberUsersToCustomers(): Promise<number> {
	const { collection, query, where, getDocs, updateDoc, doc: docRef, serverTimestamp: srvTimestamp } = await import('firebase/firestore')
	
	const q = query(
		collection(db, 'users'),
		where('role', '==', 'barber')
	)
	
	const snapshot = await getDocs(q)
	
	if (snapshot.empty) {
		console.log('No hay usuarios con rol barber para migrar')
		return 0
	}

	let migratedCount = 0
	
	for (const userDoc of snapshot.docs) {
		try {
			await updateDoc(docRef(db, 'users', userDoc.id), {
				role: 'customer',
				businessId: null,
				updatedAt: srvTimestamp(),
			})
			migratedCount++
			console.log(`Usuario migrado: ${userDoc.id}`)
		} catch (error) {
			console.error(`Error al migrar usuario ${userDoc.id}:`, error)
		}
	}

	console.log(`Migración completada: ${migratedCount} usuarios migrados`)
	return migratedCount
}

