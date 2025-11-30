import { Redirect } from 'expo-router'
import { useAuth } from '../src/hooks'
import { LoadingScreen } from '../src/components/ui'

export default function Index() {
	const { isLoading, isAuthenticated, user } = useAuth()

	if (isLoading) {
		return <LoadingScreen />
	}

	if (!isAuthenticated) {
		return <Redirect href="/(auth)/login" />
	}

	// If authenticated but no role, redirect to role selection
	if (!user?.role || user.role === 'customer') {
		return <Redirect href="/(app)/(customer)" />
	}

	if (user.role === 'owner' || user.role === 'barber') {
		return <Redirect href="/(app)/(owner)/dashboard" />
	}

	return <Redirect href="/(auth)/login" />
}

