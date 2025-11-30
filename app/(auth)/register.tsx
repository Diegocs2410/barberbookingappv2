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
import { useAuth, useTranslation } from '../../src/hooks'
import { Button, Input } from '../../src/components/ui'
import { colors, spacing } from '../../src/constants/theme'

const createRegisterSchema = (t: (key: string) => string) =>
	z
		.object({
			name: z.string().min(2, t('auth.register.errors.nameRequired')),
			email: z.string().email(t('auth.register.errors.invalidEmail')),
			password: z.string().min(6, t('auth.register.errors.passwordTooShort')),
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('auth.register.errors.passwordMismatch'),
			path: ['confirmPassword'],
		})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterScreen() {
	const { signUp, isLoading, error } = useAuth()
	const { t } = useTranslation()

	const registerSchema = createRegisterSchema(t)

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
					<Text style={styles.title}>{t('auth.register.title')}</Text>
					<Text style={styles.subtitle}>{t('auth.register.subtitle')}</Text>
				</View>

				<View style={styles.form}>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, value } }) => (
						<Input
							label={t('common.name')}
							value={value}
							onChangeText={onChange}
							placeholder={t('auth.register.namePlaceholder')}
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
							label={t('common.email')}
							value={value}
							onChangeText={onChange}
							placeholder={t('auth.register.emailPlaceholder')}
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
							label={t('common.password')}
							value={value}
							onChangeText={onChange}
							placeholder={t('auth.register.passwordPlaceholder')}
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
							label={t('auth.register.confirmPasswordPlaceholder')}
							value={value}
							onChangeText={onChange}
							placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
							{t('auth.register.registerButton')}
						</Button>
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>{t('auth.register.haveAccount')}</Text>
						<Link href="/(auth)/login" asChild>
							<Text style={styles.link}>{t('auth.register.login')}</Text>
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

