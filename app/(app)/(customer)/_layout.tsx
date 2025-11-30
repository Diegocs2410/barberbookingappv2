import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '../../../src/constants/theme'

export default function CustomerLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: colors.background },
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="business/[id]" />
			<Stack.Screen name="book/[id]" />
		</Stack>
	)
}

