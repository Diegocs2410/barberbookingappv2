import { initializeApp, getApps, getApp } from 'firebase/app'
// @ts-expect-error - getReactNativePersistence exists in firebase/auth but types are not updated
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Firebase configuration from environment variables
const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Auth with React Native persistence
let auth: ReturnType<typeof getAuth>
try {
	auth = initializeAuth(app, {
		persistence: getReactNativePersistence(ReactNativeAsyncStorage)
	})
} catch (error) {
	// Auth already initialized (happens on hot reload)
	auth = getAuth(app)
}

// Initialize Firestore
const db = getFirestore(app)

// Initialize Storage
const storage = getStorage(app)

export { app, auth, db, storage }

