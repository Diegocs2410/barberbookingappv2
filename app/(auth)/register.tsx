import React, { useState } from 'react'
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../src/hooks'
import { Button, Input } from '../../src/components/ui'
import { colors, spacing } from '../../src/constants/theme'

const registerSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterScreen() {
	const { signUp, isLoading, error } = useAuth()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await signUp(data.email, data.password, data.name)
			router.replace('/(auth)/role-select')
		} catch (err) {
			console.error('Registration error:', err)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<Text style={styles.logo}>✂️</Text>
						<Text style={styles.title}>Create Account</Text>
						<Text style={styles.subtitle}>Join BarberBooking today</Text>
					</View>

					<View style={styles.form}>
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<Input
								label="Full Name"
								value={value}
								onChangeText={onChange}
								placeholder="John Doe"
								autoCapitalize="words"
								error={errors.name?.message ?? ''}
							/>
						)}
					/>

					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<Input
								label="Email"
								value={value}
								onChangeText={onChange}
								placeholder="your@email.com"
								keyboardType="email-address"
								autoCapitalize="none"
								error={errors.email?.message ?? ''}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								label="Password"
								value={value}
								onChangeText={onChange}
								placeholder="Create a password"
								secureTextEntry
								textContentType="oneTimeCode"
								autoComplete="off"
								error={errors.password?.message ?? ''}
							/>
						)}
					/>

					<Controller
						control={control}
						name="confirmPassword"
						render={({ field: { onChange, value } }) => (
							<Input
								label="Confirm Password"
								value={value}
								onChangeText={onChange}
								placeholder="Confirm your password"
								secureTextEntry
								textContentType="oneTimeCode"
								autoComplete="off"
								error={errors.confirmPassword?.message ?? ''}
							/>
						)}
					/>

						{error && <Text style={styles.error}>{error}</Text>}

						<View style={styles.buttonContainer}>
							<Button
								onPress={handleSubmit(onSubmit)}
								loading={isLoading}
								disabled={isLoading}
							>
								Create Account
							</Button>
						</View>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Already have an account?</Text>
							<Link href="/(auth)/login" asChild>
								<Text style={styles.link}>Sign In</Text>
							</Link>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: spacing.xl,
	},
	header: {
		alignItems: 'center',
		marginBottom: spacing.xxl,
	},
	logo: {
		fontSize: 64,
		marginBottom: spacing.md,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	form: {
		width: '100%',
	},
	buttonContainer: {
		marginTop: spacing.lg,
	},
	error: {
		color: colors.error,
		textAlign: 'center',
		marginTop: spacing.sm,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: spacing.xl,
		gap: spacing.xs,
	},
	footerText: {
		color: colors.textSecondary,
		fontSize: 14,
	},
	link: {
		color: colors.accent,
		fontSize: 14,
		fontWeight: '600',
	},
})

