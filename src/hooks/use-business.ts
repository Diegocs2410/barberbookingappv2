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
	fetchServices,
	addService as addServiceAction,
	updateService as updateServiceAction,
	deleteService as deleteServiceAction,
	setCurrentBusiness,
} from '../store/slices/business-slice'
import { Business, Barber, Service } from '../types'

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

	const addBarber = useCallback(
		async (
			businessId: string,
			data: Pick<Barber, 'userId' | 'name' | 'specialties'>
		) => {
			return dispatch(addBarberAction({ businessId, data })).unwrap()
		},
		[dispatch]
	)

	const updateBarber = useCallback(
		async (
			businessId: string,
			barberId: string,
			data: Partial<Pick<Barber, 'name' | 'photoUrl' | 'specialties' | 'isActive'>>
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
		// Service operations
		loadServices,
		addService,
		updateService,
		removeService,
	}
}

