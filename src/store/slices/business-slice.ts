import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Business, Barber, Service, BusinessState } from '../../types'
import * as businessService from '../../services/business-service'

const initialState: BusinessState = {
	businesses: [],
	currentBusiness: null,
	barbers: [],
	services: [],
	isLoading: false,
	error: null,
}

// Async thunks for businesses
export const fetchAllBusinesses = createAsyncThunk(
	'business/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			const businesses = await businessService.getAllBusinesses()
			return businesses
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch businesses'
			return rejectWithValue(message)
		}
	}
)

export const fetchBusiness = createAsyncThunk(
	'business/fetchOne',
	async (businessId: string, { rejectWithValue }) => {
		try {
			const business = await businessService.getBusiness(businessId)
			return business
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch business'
			return rejectWithValue(message)
		}
	}
)

export const fetchOwnerBusiness = createAsyncThunk(
	'business/fetchOwnerBusiness',
	async (ownerId: string, { rejectWithValue }) => {
		try {
			const business = await businessService.getBusinessByOwner(ownerId)
			return business
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch business'
			return rejectWithValue(message)
		}
	}
)

export const createBusiness = createAsyncThunk(
	'business/create',
	async (
		{ ownerId, data }: { ownerId: string; data: Pick<Business, 'name' | 'address' | 'phone' | 'description'> },
		{ rejectWithValue }
	) => {
		try {
			const business = await businessService.createBusiness(ownerId, data)
			return business
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create business'
			return rejectWithValue(message)
		}
	}
)

export const updateBusiness = createAsyncThunk(
	'business/update',
	async (
		{ businessId, data }: { businessId: string; data: Partial<Omit<Business, 'id' | 'ownerId' | 'createdAt'>> },
		{ rejectWithValue }
	) => {
		try {
			await businessService.updateBusiness(businessId, data)
			return { businessId, data }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update business'
			return rejectWithValue(message)
		}
	}
)

// Async thunks for barbers
export const fetchBarbers = createAsyncThunk(
	'business/fetchBarbers',
	async (businessId: string, { rejectWithValue }) => {
		try {
			const barbers = await businessService.getBarbers(businessId)
			return barbers
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch barbers'
			return rejectWithValue(message)
		}
	}
)

export const addBarber = createAsyncThunk(
	'business/addBarber',
	async (
		{ businessId, data }: { businessId: string; data: Pick<Barber, 'userId' | 'name' | 'specialties'> & { email?: string } },
		{ rejectWithValue }
	) => {
		try {
			const barber = await businessService.addBarber(businessId, data)
			return barber
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to add barber'
			return rejectWithValue(message)
		}
	}
)

export const updateBarber = createAsyncThunk(
	'business/updateBarber',
	async (
		{ businessId, barberId, data }: { businessId: string; barberId: string; data: Partial<Pick<Barber, 'name' | 'photoUrl' | 'specialties' | 'isActive' | 'email'>> },
		{ rejectWithValue }
	) => {
		try {
			await businessService.updateBarber(businessId, barberId, data)
			return { barberId, data }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update barber'
			return rejectWithValue(message)
		}
	}
)

export const linkBarber = createAsyncThunk(
	'business/linkBarber',
	async (
		{ businessId, barberId, userId }: { businessId: string; barberId: string; userId: string },
		{ rejectWithValue }
	) => {
		try {
			await businessService.linkBarberToUser(businessId, barberId, userId)
			return { barberId, userId }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to link barber'
			return rejectWithValue(message)
		}
	}
)

export const unlinkBarber = createAsyncThunk(
	'business/unlinkBarber',
	async (
		{ businessId, barberId }: { businessId: string; barberId: string },
		{ rejectWithValue }
	) => {
		try {
			await businessService.unlinkBarber(businessId, barberId)
			return { barberId }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to unlink barber'
			return rejectWithValue(message)
		}
	}
)

export const deleteBarber = createAsyncThunk(
	'business/deleteBarber',
	async (
		{ businessId, barberId }: { businessId: string; barberId: string },
		{ rejectWithValue }
	) => {
		try {
			await businessService.deleteBarber(businessId, barberId)
			return barberId
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to delete barber'
			return rejectWithValue(message)
		}
	}
)

// Async thunks for services
export const fetchServices = createAsyncThunk(
	'business/fetchServices',
	async (businessId: string, { rejectWithValue }) => {
		try {
			const services = await businessService.getServices(businessId)
			return services
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to fetch services'
			return rejectWithValue(message)
		}
	}
)

export const addService = createAsyncThunk(
	'business/addService',
	async (
		{ businessId, data }: { businessId: string; data: Pick<Service, 'name' | 'description' | 'duration' | 'price'> },
		{ rejectWithValue }
	) => {
		try {
			const service = await businessService.addService(businessId, data)
			return service
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to add service'
			return rejectWithValue(message)
		}
	}
)

export const updateService = createAsyncThunk(
	'business/updateService',
	async (
		{ businessId, serviceId, data }: { businessId: string; serviceId: string; data: Partial<Pick<Service, 'name' | 'description' | 'duration' | 'price' | 'isActive'>> },
		{ rejectWithValue }
	) => {
		try {
			await businessService.updateService(businessId, serviceId, data)
			return { serviceId, data }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update service'
			return rejectWithValue(message)
		}
	}
)

export const deleteService = createAsyncThunk(
	'business/deleteService',
	async (
		{ businessId, serviceId }: { businessId: string; serviceId: string },
		{ rejectWithValue }
	) => {
		try {
			await businessService.deleteService(businessId, serviceId)
			return serviceId
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to delete service'
			return rejectWithValue(message)
		}
	}
)

const businessSlice = createSlice({
	name: 'business',
	initialState,
	reducers: {
		setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
			state.currentBusiness = action.payload
		},
		clearBusinessState: (state) => {
			state.businesses = []
			state.currentBusiness = null
			state.barbers = []
			state.services = []
			state.error = null
		},
		clearError: (state) => {
			state.error = null
		},
	},
	extraReducers: (builder) => {
		// Fetch all businesses
		builder
			.addCase(fetchAllBusinesses.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchAllBusinesses.fulfilled, (state, action) => {
				state.isLoading = false
				state.businesses = action.payload
			})
			.addCase(fetchAllBusinesses.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Fetch single business
		builder
			.addCase(fetchBusiness.pending, (state) => {
				state.isLoading = true
			})
			.addCase(fetchBusiness.fulfilled, (state, action) => {
				state.isLoading = false
				state.currentBusiness = action.payload
			})
			.addCase(fetchBusiness.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Fetch owner business
		builder
			.addCase(fetchOwnerBusiness.fulfilled, (state, action) => {
				state.currentBusiness = action.payload
			})

		// Create business
		builder
			.addCase(createBusiness.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createBusiness.fulfilled, (state, action) => {
				state.isLoading = false
				state.currentBusiness = action.payload
				state.businesses.push(action.payload)
			})
			.addCase(createBusiness.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Update business
		builder.addCase(updateBusiness.fulfilled, (state, action) => {
			if (state.currentBusiness?.id === action.payload.businessId) {
				state.currentBusiness = { ...state.currentBusiness, ...action.payload.data }
			}
		})

		// Fetch barbers
		builder
			.addCase(fetchBarbers.pending, (state) => {
				state.isLoading = true
			})
			.addCase(fetchBarbers.fulfilled, (state, action) => {
				state.isLoading = false
				state.barbers = action.payload
			})
			.addCase(fetchBarbers.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Add barber
		builder.addCase(addBarber.fulfilled, (state, action) => {
			state.barbers.push(action.payload)
		})

		// Update barber
		builder.addCase(updateBarber.fulfilled, (state, action) => {
			const index = state.barbers.findIndex((b) => b.id === action.payload.barberId)
			if (index !== -1) {
				state.barbers[index] = { ...state.barbers[index], ...action.payload.data }
			}
		})

		// Delete barber
		builder.addCase(deleteBarber.fulfilled, (state, action) => {
			state.barbers = state.barbers.filter((b) => b.id !== action.payload)
		})

		// Link barber
		builder.addCase(linkBarber.fulfilled, (state, action) => {
			const index = state.barbers.findIndex((b) => b.id === action.payload.barberId)
			if (index !== -1) {
				state.barbers[index] = {
					...state.barbers[index],
					userId: action.payload.userId,
					isLinked: true,
				}
			}
		})

		// Unlink barber
		builder.addCase(unlinkBarber.fulfilled, (state, action) => {
			const index = state.barbers.findIndex((b) => b.id === action.payload.barberId)
			if (index !== -1) {
				state.barbers[index] = {
					...state.barbers[index],
					userId: '',
					isLinked: false,
				}
			}
		})

		// Fetch services
		builder
			.addCase(fetchServices.pending, (state) => {
				state.isLoading = true
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.isLoading = false
				state.services = action.payload
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Add service
		builder.addCase(addService.fulfilled, (state, action) => {
			state.services.push(action.payload)
		})

		// Update service
		builder.addCase(updateService.fulfilled, (state, action) => {
			const index = state.services.findIndex((s) => s.id === action.payload.serviceId)
			if (index !== -1) {
				state.services[index] = { ...state.services[index], ...action.payload.data }
			}
		})

		// Delete service
		builder.addCase(deleteService.fulfilled, (state, action) => {
			state.services = state.services.filter((s) => s.id !== action.payload)
		})
	},
})

export const { setCurrentBusiness, clearBusinessState, clearError } = businessSlice.actions
export default businessSlice.reducer

