import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth-slice'
import businessReducer from './slices/business-slice'
import bookingReducer from './slices/booking-slice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		business: businessReducer,
		booking: bookingReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['auth/setUser', 'booking/setBookings'],
				// Ignore these field paths in all actions
				ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.dateTime'],
				// Ignore these paths in the state
				ignoredPaths: [
					'auth.user.createdAt',
					'auth.user.updatedAt',
					'business.currentBusiness.createdAt',
					'business.currentBusiness.updatedAt',
					'booking.bookings',
				],
			},
		}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

