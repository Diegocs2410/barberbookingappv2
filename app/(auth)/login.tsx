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

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		email: z.string().email(t('auth.login.errors.invalidEmail')),
		password: z.string().min(6, t('auth.login.errors.invalidPassword')),
	})

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>

export default function LoginScreen() {
	const { signIn, signInWithGoogle, isLoading, error } = useAuth()
	const { t } = useTranslation()
	const { colors } = useThemeColors()
	const [showPassword, setShowPassword] = useState(false)

	const loginSchema = createLoginSchema(t)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = async (data: LoginFormData) => {
		try {
			await signIn(data.email, data.password)
			router.replace('/')
		} catch (err) {
			// Error is handled by the hook
			console.error('Login error:', err)
		}
	}

	const handleGoogleSignIn = async (idToken: string) => {
		try {
			const user = await signInWithGoogle(idToken)
			// Check if user needs to select role
			if (!user.role || user.role === 'customer') {
				router.replace('/(auth)/role-select')
			} else {
				router.replace('/')
			}
		} catch (err) {
			console.error('Google sign in error:', err)
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
						<Text style={[styles.title, { color: colors.textPrimary }]}>BarberBooking</Text>
						<Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('auth.login.subtitle')}</Text>
					</View>

					<View style={styles.form}>
						{/* Google Sign In Button */}
						<GoogleSignInButton
							onSuccess={handleGoogleSignIn}
							disabled={isLoading}
							mode="signin"
						/>

						{/* Divider */}
						<View style={styles.dividerContainer}>
							<View style={[styles.divider, { backgroundColor: colors.border }]} />
							<Text style={[styles.dividerText, { color: colors.textMuted }]}>{t('auth.login.orDivider')}</Text>
							<View style={[styles.divider, { backgroundColor: colors.border }]} />
						</View>

						{/* Email/Password Form */}
						<Controller
							control={control}
							name="email"
							render={({ field: { onChange, value } }) => (
								<Input
									label={t('common.email')}
									value={value}
									onChangeText={onChange}
									placeholder={t('auth.login.emailPlaceholder')}
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
									placeholder={t('auth.login.passwordPlaceholder')}
									secureTextEntry={!showPassword}
									textContentType="oneTimeCode"
									autoComplete="off"
									error={errors.password?.message ?? ''}
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
								{t('auth.login.loginButton')}
							</Button>
						</View>

						<View style={styles.footer}>
							<Text style={[styles.footerText, { color: colors.textSecondary }]}>{t('auth.login.noAccount')}</Text>
							<Link href="/(auth)/register" asChild>
								<Text style={[styles.link, { color: colors.textPrimary }]}>{t('auth.login.signUp')}</Text>
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
		fontSize: 32,
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
