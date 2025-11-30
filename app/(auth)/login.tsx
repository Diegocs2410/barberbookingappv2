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

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		email: z.string().email(t('auth.login.errors.invalidEmail')),
		password: z.string().min(6, t('auth.login.errors.invalidPassword')),
	})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginScreen() {
	const { signIn, isLoading, error } = useAuth()
	const { t } = useTranslation()
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
					<Text style={styles.title}>BarberBooking</Text>
					<Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
				</View>

				<View style={styles.form}>
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

					{error && <Text style={styles.error}>{error}</Text>}

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
						<Text style={styles.footerText}>{t('auth.login.noAccount')}</Text>
						<Link href="/(auth)/register" asChild>
							<Text style={styles.link}>{t('auth.login.signUp')}</Text>
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

