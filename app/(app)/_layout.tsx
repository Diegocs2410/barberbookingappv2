import React from 'react'
import { useColorScheme } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../src/constants/theme'
import { useAuth, useTranslation } from '../../src/hooks'

export default function AppLayout() {
	const { user } = useAuth()
	const { t } = useTranslation()
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const isOwner = user?.role === 'owner' || user?.role === 'barber'

	// Dynamic colors based on theme
	const tabBarColors = {
		background: isDarkMode ? '#0a0a0a' : colors.surface,
		border: isDarkMode ? '#222222' : colors.border,
		active: isDarkMode ? '#ffffff' : colors.primary,
		inactive: isDarkMode ? '#666666' : colors.textMuted,
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: tabBarColors.background,
					borderTopColor: tabBarColors.border,
					borderTopWidth: 1,
					height: 85,
					paddingBottom: 25,
					paddingTop: 10,
				},
				tabBarActiveTintColor: tabBarColors.active,
				tabBarInactiveTintColor: tabBarColors.inactive,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
			}}
		>
			{/* Customer screens */}
			<Tabs.Screen
				name="(customer)"
				options={{
					title: t('tabs.discover'),
					href: isOwner ? null : undefined,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="my-bookings"
				options={{
					title: t('tabs.bookings'),
					href: isOwner ? null : undefined,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" size={size} color={color} />
					),
				}}
			/>

			{/* Owner screens */}
			<Tabs.Screen
				name="(owner)"
				options={{
					title: t('tabs.dashboard'),
					href: !isOwner ? null : undefined,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="grid-outline" size={size} color={color} />
					),
				}}
			/>

			{/* Shared screens */}
			<Tabs.Screen
				name="profile"
				options={{
					title: t('tabs.profile'),
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
