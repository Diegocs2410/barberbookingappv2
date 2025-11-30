import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { colors, borderRadius } from '../../constants/theme'

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
				style={styles.input}
				outlineStyle={styles.outline}
				activeOutlineColor={colors.accent}
				outlineColor={colors.border}
				textColor={colors.textPrimary}
				placeholderTextColor={colors.textMuted}
				left={left}
				right={right}
				theme={{
					colors: {
						onSurfaceVariant: colors.textSecondary,
					},
				}}
			/>
			{error && (
				<HelperText type="error" visible style={styles.error}>
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
	input: {
		backgroundColor: colors.surface,
	},
	outline: {
		borderRadius: borderRadius.md,
	},
	error: {
		color: colors.error,
	},
})

