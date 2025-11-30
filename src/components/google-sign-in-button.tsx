import React from 'react'
import { StyleSheet, Pressable, Alert, Platform } from 'react-native'
import { Text } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'
import { useThemeColors, useTranslation } from '../hooks'
import { spacing, borderRadius } from '../constants/theme'

WebBrowser.maybeCompleteAuthSession()

/**
 * Props para el botón de Google Sign-In
 */
interface Props {
	onSuccess: (idToken: string) => void
	onError?: (error: string) => void
	disabled?: boolean
	mode?: 'signin' | 'signup'
}

/**
 * Botón de Google Sign-In/Sign-Up
 * Siempre visible, muestra alerta si no está configurado
 */
export function GoogleSignInButton({
	onSuccess,
	onError,
	disabled = false,
	mode = 'signin'
}: Props) {
	const { t } = useTranslation()
	const { colors } = useThemeColors()

	// Obtener el Client ID según la plataforma
	const clientId = Platform.select({
		ios: Constants.expoConfig?.extra?.googleClientIdIos,
		android: Constants.expoConfig?.extra?.googleClientIdAndroid,
		web: Constants.expoConfig?.extra?.googleClientIdWeb,
	})

	// Verificar si las credenciales están configuradas
	const isConfigured = Boolean(clientId)

	// Configure Google OAuth - usar clientId vacío si no está configurado
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
		isConfigured ? { clientId } : { clientId: 'not-configured' }
	)

	React.useEffect(() => {
		if (response?.type === 'success') {
			const { id_token } = response.params
			onSuccess(id_token)
		} else if (response?.type === 'error') {
			const errorMessage = mode === 'signin'
				? t('auth.login.errors.googleFailed')
				: t('auth.register.errors.googleFailed')

			onError?.(errorMessage)
			Alert.alert(t('common.error'), errorMessage)
		}
	}, [response, onSuccess, onError, t, mode])

	const handlePress = () => {
		if (!isConfigured) {
			// Mostrar alerta informativa si no está configurado
			Alert.alert(
				'Google Sign-In',
				'Google authentication is not configured yet. Please use email/password.',
				[{ text: 'OK' }]
			)
			return
		}
		promptAsync()
	}

	const buttonText = mode === 'signin'
		? t('auth.login.googleButton')
		: t('auth.register.googleButton')

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				{
					backgroundColor: colors.surface,
					borderColor: colors.border,
				},
				pressed && [styles.pressed, { backgroundColor: colors.surfaceVariant }],
				disabled && styles.disabled,
			]}
			onPress={handlePress}
			disabled={disabled || !request}
		>
			<Ionicons name="logo-google" size={20} color={colors.textPrimary} />
			<Text style={[styles.text, { color: colors.textPrimary }]}>{buttonText}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		borderRadius: borderRadius.lg,
		borderWidth: 1.5,
		gap: spacing.sm,
	},
	pressed: {
		transform: [{ scale: 0.98 }],
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		fontSize: 16,
		fontWeight: '600',
	},
})
