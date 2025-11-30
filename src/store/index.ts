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
			// Disable serializable check - we use Date objects throughout
			// which are safe but not serializable by Redux's strict standards
			serializableCheck: false,
		}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

