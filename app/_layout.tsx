import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import { Provider as ReduxProvider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import { store } from '../src/store'
import { darkTheme, colors } from '../src/constants/theme'
import { useAuth } from '../src/hooks'
import { LoadingScreen } from '../src/components/ui'

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync()

function RootLayoutNav() {
	const { isLoading, isAuthenticated, user } = useAuth()

	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync()
		}
	}, [isLoading])

	if (isLoading) {
		return <LoadingScreen message="Starting BarberBooking..." />
	}

	// Determine if user needs to select a role
	const needsRoleSelection = isAuthenticated && user && !user.role

	return (
		<>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
					animation: 'slide_from_right',
				}}
			>
				{!isAuthenticated ? (
					<Stack.Screen name="(auth)" />
				) : needsRoleSelection ? (
					<Stack.Screen name="(auth)/role-select" />
				) : (
					<Stack.Screen name="(app)" />
				)}
			</Stack>
		</>
	)
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<ReduxProvider store={store}>
					<PaperProvider theme={darkTheme}>
						<RootLayoutNav />
					</PaperProvider>
				</ReduxProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

