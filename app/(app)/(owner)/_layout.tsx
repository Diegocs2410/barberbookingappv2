import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '../../../src/constants/theme'

export default function OwnerLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: colors.background },
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen name="dashboard" />
			<Stack.Screen name="services" />
			<Stack.Screen name="barbers" />
			<Stack.Screen name="settings" />
		</Stack>
	)
}

