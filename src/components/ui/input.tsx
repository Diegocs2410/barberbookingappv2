import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { useThemeColors } from '../../hooks'
import { borderRadius } from '../../constants/theme'

interface InputProps {
	label: string
	value: string | undefined
	onChangeText: (text: string) => void
	placeholder?: string
	secureTextEntry?: boolean
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
	textContentType?: 'none' | 'emailAddress' | 'password' | 'newPassword' | 'oneTimeCode' | 'name' | 'telephoneNumber'
	autoComplete?: 'off' | 'email' | 'password' | 'new-password' | 'name' | 'tel'
	error?: string | undefined
	disabled?: boolean
	multiline?: boolean
	numberOfLines?: number
	left?: React.ReactNode
	right?: React.ReactNode
}

/**
 * Componente de input reutilizable
 * Diseño limpio con estilo monocromático y soporte para temas
 */
export function Input({
	label,
	value = '',
	onChangeText,
	placeholder,
	secureTextEntry = false,
	keyboardType = 'default',
	autoCapitalize = 'none',
	textContentType,
	autoComplete,
	error,
	disabled = false,
	multiline = false,
	numberOfLines = 1,
	left,
	right,
}: InputProps) {
	const { colors } = useThemeColors()

	return (
		<View style={styles.container}>
			<TextInput
				label={label}
				value={value ?? ''}
				onChangeText={onChangeText}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				textContentType={textContentType}
				autoComplete={autoComplete}
				disabled={disabled}
				multiline={multiline}
				numberOfLines={numberOfLines}
				error={!!error}
				mode="outlined"
				style={[styles.input, { backgroundColor: colors.surface }]}
				outlineStyle={styles.outline}
				activeOutlineColor={colors.primary}
				outlineColor={colors.border}
				textColor={colors.textPrimary}
				placeholderTextColor={colors.textMuted}
				left={left}
				right={right}
				theme={{
					colors: {
						onSurfaceVariant: colors.textSecondary,
						surfaceVariant: colors.surfaceVariant,
					},
				}}
			/>
			{error && (
				<HelperText type="error" visible style={[styles.error, { color: colors.error }]}>
					{error}
				</HelperText>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 8,
	},
	input: {},
	outline: {
		borderRadius: borderRadius.lg,
		borderWidth: 1.5,
	},
	error: {
		fontSize: 12,
	},
})
