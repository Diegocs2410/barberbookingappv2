import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
	signUp as signUpAction,
	signIn as signInAction,
	signOut as signOutAction,
	fetchCurrentUser,
	updateRole as updateRoleAction,
	updateProfile as updateProfileAction,
	setUser,
	setLoading,
} from '../store/slices/auth-slice'
import { onAuthChange, getCurrentUser } from '../services/auth-service'
import { User, UserRole } from '../types'

export function useAuth() {
	const dispatch = useAppDispatch()
	const { user, isLoading, isAuthenticated, error } = useAppSelector(
		(state) => state.auth
	)

	// Listen to Firebase auth state changes
	useEffect(() => {
		let isMounted = true

		const unsubscribe = onAuthChange(async (firebaseUser) => {
			if (!isMounted) return
			
			if (firebaseUser) {
				try {
					const userData = await getCurrentUser()
					if (isMounted) dispatch(setUser(userData))
				} catch (err) {
					console.error('Error fetching user data:', err)
					if (isMounted) dispatch(setUser(null))
				}
			} else {
				dispatch(setUser(null))
			}
		})

		return () => {
			isMounted = false
			unsubscribe()
		}
	}, [dispatch])

	const signUp = useCallback(
		async (email: string, password: string, name: string) => {
			return dispatch(signUpAction({ email, password, name })).unwrap()
		},
		[dispatch]
	)

	const signIn = useCallback(
		async (email: string, password: string) => {
			return dispatch(signInAction({ email, password })).unwrap()
		},
		[dispatch]
	)

	const signOut = useCallback(async () => {
		return dispatch(signOutAction()).unwrap()
	}, [dispatch])

	const updateRole = useCallback(
		async (role: UserRole, businessId?: string) => {
			if (!user) throw new Error('No user logged in')
			return dispatch(
				updateRoleAction({ userId: user.id, role, businessId })
			).unwrap()
		},
		[dispatch, user]
	)

	const updateProfile = useCallback(
		async (data: Partial<Pick<User, 'name' | 'phone' | 'photoUrl'>>) => {
			if (!user) throw new Error('No user logged in')
			return dispatch(
				updateProfileAction({ userId: user.id, data })
			).unwrap()
		},
		[dispatch, user]
	)

	const refreshUser = useCallback(async () => {
		return dispatch(fetchCurrentUser()).unwrap()
	}, [dispatch])

	return {
		user,
		isLoading,
		isAuthenticated,
		error,
		signUp,
		signIn,
		signOut,
		updateRole,
		updateProfile,
		refreshUser,
	}
}

