import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserRole, AuthState } from '../../types'
import * as authService from '../../services/auth-service'

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
}

// Async thunks
export const signUp = createAsyncThunk(
    'auth/signUp',
    async (
        { email, password, name }: { email: string; password: string; name: string },
        { rejectWithValue }
    ) => {
        try {
            const user = await authService.signUp(email, password, name)
            return user
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Sign up failed'
            return rejectWithValue(message)
        }
    }
)

export const signIn = createAsyncThunk(
    'auth/signIn',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const user = await authService.signIn(email, password)
            return user
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Sign in failed'
            return rejectWithValue(message)
        }
    }
)

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await authService.signOut()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Sign out failed'
            return rejectWithValue(message)
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.getCurrentUser()
            return user
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch user'
            return rejectWithValue(message)
        }
    }
)

export const updateRole = createAsyncThunk(
    'auth/updateRole',
    async (
        { userId, role, businessId }: { userId: string; role: UserRole; businessId?: string },
        { rejectWithValue }
    ) => {
        try {
            await authService.updateUserRole(userId, role, businessId)
            return { role, businessId }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update role'
            return rejectWithValue(message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (
        { userId, data }: { userId: string; data: Partial<Pick<User, 'name' | 'phone' | 'photoUrl'>> },
        { rejectWithValue }
    ) => {
        try {
            await authService.updateUserProfile(userId, data)
            return data
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile'
            return rejectWithValue(message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
            state.isAuthenticated = !!action.payload
            state.isLoading = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder
            .addCase(signUp.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Sign In
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Sign Out
        builder
            .addCase(signOut.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signOut.fulfilled, (state) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
            })
            .addCase(signOut.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Fetch Current User
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isAuthenticated = !!action.payload
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Update Role
        builder
            .addCase(updateRole.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.role = action.payload.role
                    if (action.payload.businessId) {
                        state.user.businessId = action.payload.businessId
                    }
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.error = action.payload as string
            })

        // Update Profile
        builder
            .addCase(updateProfile.fulfilled, (state, action) => {
                if (state.user) {
                    state.user = { ...state.user, ...action.payload }
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export const { setUser, setLoading, clearError } = authSlice.actions
export default authSlice.reducer

