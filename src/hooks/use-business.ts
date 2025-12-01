import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
	fetchAllBusinesses,
	fetchBusiness,
	fetchOwnerBusiness,
	createBusiness as createBusinessAction,
	updateBusiness as updateBusinessAction,
	fetchBarbers,
	addBarber as addBarberAction,
	updateBarber as updateBarberAction,
	deleteBarber as deleteBarberAction,
	linkBarber as linkBarberAction,
	unlinkBarber as unlinkBarberAction,
	fetchServices,
	addService as addServiceAction,
	updateService as updateServiceAction,
	deleteService as deleteServiceAction,
	setCurrentBusiness,
} from '../store/slices/business-slice'
import { Business, Barber, Service, User } from '../types'
import * as businessService from '../services/business-service'

export function useBusiness() {
	const dispatch = useAppDispatch()
	const { businesses, currentBusiness, barbers, services, isLoading, error } =
		useAppSelector((state) => state.business)

	// Business operations
	const loadAllBusinesses = useCallback(async () => {
		return dispatch(fetchAllBusinesses()).unwrap()
	}, [dispatch])

	const loadBusiness = useCallback(
		async (businessId: string) => {
			return dispatch(fetchBusiness(businessId)).unwrap()
		},
		[dispatch]
	)

	const loadOwnerBusiness = useCallback(
		async (ownerId: string) => {
			return dispatch(fetchOwnerBusiness(ownerId)).unwrap()
		},
		[dispatch]
	)

	const createBusiness = useCallback(
		async (
			ownerId: string,
			data: Pick<Business, 'name' | 'address' | 'phone' | 'description'>
		) => {
			return dispatch(createBusinessAction({ ownerId, data })).unwrap()
		},
		[dispatch]
	)

	const updateBusiness = useCallback(
		async (
			businessId: string,
			data: Partial<Omit<Business, 'id' | 'ownerId' | 'createdAt'>>
		) => {
			return dispatch(updateBusinessAction({ businessId, data })).unwrap()
		},
		[dispatch]
	)

	const selectBusiness = useCallback(
		(business: Business | null) => {
			dispatch(setCurrentBusiness(business))
		},
		[dispatch]
	)

	// Barber operations
	const loadBarbers = useCallback(
		async (businessId: string) => {
			return dispatch(fetchBarbers(businessId)).unwrap()
		},
		[dispatch]
	)

	// Buscar usuario por email
	const findUserByEmail = useCallback(
		async (email: string): Promise<User | null> => {
			return businessService.findUserByEmail(email)
		},
		[]
	)

	// Buscar barbero pendiente por email
	const findPendingBarberByEmail = useCallback(
		async (email: string) => {
			return businessService.findPendingBarberByEmail(email)
		},
		[]
	)

	const addBarber = useCallback(
		async (
			businessId: string,
			data: Pick<Barber, 'userId' | 'name' | 'specialties'> & { email?: string }
		) => {
			return dispatch(addBarberAction({ businessId, data })).unwrap()
		},
		[dispatch]
	)

	const updateBarber = useCallback(
		async (
			businessId: string,
			barberId: string,
			data: Partial<Pick<Barber, 'name' | 'photoUrl' | 'specialties' | 'isActive' | 'email'>>
		) => {
			return dispatch(
				updateBarberAction({ businessId, barberId, data })
			).unwrap()
		},
		[dispatch]
	)

	const removeBarber = useCallback(
		async (businessId: string, barberId: string) => {
			return dispatch(deleteBarberAction({ businessId, barberId })).unwrap()
		},
		[dispatch]
	)

	// Vincular barbero con usuario existente
	const linkBarber = useCallback(
		async (businessId: string, barberId: string, userId: string) => {
			return dispatch(linkBarberAction({ businessId, barberId, userId })).unwrap()
		},
		[dispatch]
	)

	// Desvincular barbero
	const unlinkBarber = useCallback(
		async (businessId: string, barberId: string) => {
			return dispatch(unlinkBarberAction({ businessId, barberId })).unwrap()
		},
		[dispatch]
	)

	// Service operations
	const loadServices = useCallback(
		async (businessId: string) => {
			return dispatch(fetchServices(businessId)).unwrap()
		},
		[dispatch]
	)

	const addService = useCallback(
		async (
			businessId: string,
			data: Pick<Service, 'name' | 'description' | 'duration' | 'price'>
		) => {
			return dispatch(addServiceAction({ businessId, data })).unwrap()
		},
		[dispatch]
	)

	const updateService = useCallback(
		async (
			businessId: string,
			serviceId: string,
			data: Partial<Pick<Service, 'name' | 'description' | 'duration' | 'price' | 'isActive'>>
		) => {
			return dispatch(
				updateServiceAction({ businessId, serviceId, data })
			).unwrap()
		},
		[dispatch]
	)

	const removeService = useCallback(
		async (businessId: string, serviceId: string) => {
			return dispatch(deleteServiceAction({ businessId, serviceId })).unwrap()
		},
		[dispatch]
	)

	return {
		// State
		businesses,
		currentBusiness,
		barbers,
		services,
		isLoading,
		error,
		// Business operations
		loadAllBusinesses,
		loadBusiness,
		loadOwnerBusiness,
		createBusiness,
		updateBusiness,
		selectBusiness,
		// Barber operations
		loadBarbers,
		addBarber,
		updateBarber,
		removeBarber,
		findUserByEmail,
		findPendingBarberByEmail,
		linkBarber,
		unlinkBarber,
		// Service operations
		loadServices,
		addService,
		updateService,
		removeService,
	}
}

