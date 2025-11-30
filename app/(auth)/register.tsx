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
import { useAuth, useTranslation, useThemeColors } from '../../src/hooks'
import { Button, Input } from '../../src/components/ui'
import { GoogleSignInButton } from '../../src/components/google-sign-in-button'
import { spacing } from '../../src/constants/theme'

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

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>

export default function RegisterScreen() {
	const { signUp, signInWithGoogle, isLoading, error } = useAuth()
	const { t } = useTranslation()
	const { colors } = useThemeColors()

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

	const handleGoogleSignUp = async (idToken: string) => {
		try {
			await signInWithGoogle(idToken)
			router.replace('/(auth)/role-select')
		} catch (err) {
			console.error('Google sign up error:', err)
		}
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
						<Text style={[styles.title, { color: colors.textPrimary }]}>{t('auth.register.title')}</Text>
						<Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('auth.register.subtitle')}</Text>
					</View>

					<View style={styles.form}>
						{/* Google Sign Up Button */}
						<GoogleSignInButton
							onSuccess={handleGoogleSignUp}
							disabled={isLoading}
							mode="signup"
						/>

						{/* Divider */}
						<View style={styles.dividerContainer}>
							<View style={[styles.divider, { backgroundColor: colors.border }]} />
							<Text style={[styles.dividerText, { color: colors.textMuted }]}>{t('auth.register.orDivider')}</Text>
							<View style={[styles.divider, { backgroundColor: colors.border }]} />
						</View>

						{/* Email/Password Form */}
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

						{error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

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
							<Text style={[styles.footerText, { color: colors.textSecondary }]}>{t('auth.register.haveAccount')}</Text>
							<Link href="/(auth)/login" asChild>
								<Text style={[styles.link, { color: colors.textPrimary }]}>{t('auth.register.login')}</Text>
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
		fontSize: 28,
		fontWeight: '700',
		marginBottom: spacing.xs,
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 16,
		fontWeight: '400',
	},
	form: {
		width: '100%',
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: spacing.lg,
	},
	divider: {
		flex: 1,
		height: 1,
	},
	dividerText: {
		marginHorizontal: spacing.md,
		fontSize: 13,
		fontWeight: '500',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	buttonContainer: {
		marginTop: spacing.lg,
	},
	error: {
		textAlign: 'center',
		marginTop: spacing.sm,
		fontSize: 14,
		fontWeight: '500',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: spacing.xl,
		gap: spacing.xs,
	},
	footerText: {
		fontSize: 14,
	},
	link: {
		fontSize: 14,
		fontWeight: '600',
		textDecorationLine: 'underline',
	},
})
