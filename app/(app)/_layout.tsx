import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../src/constants/theme'
import { useAuth } from '../../src/hooks'

export default function AppLayout() {
	const { user } = useAuth()
	const isOwner = user?.role === 'owner' || user?.role === 'barber'

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
					borderTopWidth: 1,
					height: 85,
					paddingBottom: 25,
					paddingTop: 10,
				},
				tabBarActiveTintColor: colors.accent,
				tabBarInactiveTintColor: colors.textMuted,
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
					title: 'Discover',
					href: isOwner ? null : undefined,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="my-bookings"
				options={{
					title: 'Bookings',
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
					title: 'Dashboard',
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
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}

