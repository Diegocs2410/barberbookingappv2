import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

// Configure notification handling
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
})

/**
 * Registers for push notifications and returns the Expo push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
	let token: string | null = null

	if (!Device.isDevice) {
		console.log('Push notifications require a physical device')
		return null
	}

	// Check existing permissions
	const { status: existingStatus } = await Notifications.getPermissionsAsync()
	let finalStatus = existingStatus

	// Request permissions if not granted
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync()
		finalStatus = status
	}

	if (finalStatus !== 'granted') {
		console.log('Push notification permissions not granted')
		return null
	}

	// Get the Expo push token
	try {
		const projectId = Constants.expoConfig?.extra?.eas?.projectId
		const pushToken = await Notifications.getExpoPushTokenAsync({
			projectId,
		})
		token = pushToken.data
	} catch (error) {
		console.error('Error getting push token:', error)
		return null
	}

	// Configure Android channel
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'Default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#e94560',
		})

		await Notifications.setNotificationChannelAsync('bookings', {
			name: 'Booking Notifications',
			importance: Notifications.AndroidImportance.HIGH,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#e94560',
		})
	}

	return token
}

/**
 * Saves the push token to the user's document in Firestore
 */
export async function savePushToken(
	userId: string,
	token: string
): Promise<void> {
	await updateDoc(doc(db, 'users', userId), {
		pushToken: token,
	})
}

/**
 * Schedules a local notification
 */
export async function scheduleLocalNotification(
	title: string,
	body: string,
	trigger: Notifications.NotificationTriggerInput,
	data?: Record<string, unknown>
): Promise<string> {
	const id = await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			data,
			sound: true,
		},
		trigger,
	})

	return id
}

/**
 * Schedules a booking reminder notification
 */
export async function scheduleBookingReminder(
	bookingId: string,
	bookingDateTime: Date,
	businessName: string,
	serviceName: string
): Promise<string[]> {
	const notificationIds: string[] = []

	// 24 hour reminder
	const reminder24h = new Date(bookingDateTime)
	reminder24h.setHours(reminder24h.getHours() - 24)

	if (reminder24h > new Date()) {
		const id = await scheduleLocalNotification(
			'Appointment Tomorrow',
			`Don't forget your ${serviceName} at ${businessName} tomorrow!`,
			{ date: reminder24h } as Notifications.NotificationTriggerInput,
			{ bookingId, type: 'reminder_24h' }
		)
		notificationIds.push(id)
	}

	// 1 hour reminder
	const reminder1h = new Date(bookingDateTime)
	reminder1h.setHours(reminder1h.getHours() - 1)

	if (reminder1h > new Date()) {
		const id = await scheduleLocalNotification(
			'Appointment in 1 Hour',
			`Your ${serviceName} at ${businessName} is coming up soon!`,
			{ date: reminder1h } as Notifications.NotificationTriggerInput,
			{ bookingId, type: 'reminder_1h' }
		)
		notificationIds.push(id)
	}

	return notificationIds
}

/**
 * Cancels scheduled notifications
 */
export async function cancelScheduledNotifications(
	notificationIds: string[]
): Promise<void> {
	await Promise.all(
		notificationIds.map((id) =>
			Notifications.cancelScheduledNotificationAsync(id)
		)
	)
}

/**
 * Adds a notification listener
 */
export function addNotificationReceivedListener(
	callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
	return Notifications.addNotificationReceivedListener(callback)
}

/**
 * Adds a notification response listener (when user taps notification)
 */
export function addNotificationResponseListener(
	callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
	return Notifications.addNotificationResponseReceivedListener(callback)
}

