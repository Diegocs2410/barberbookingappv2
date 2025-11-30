import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

// Color palette inspired by modern barbershop aesthetics
export const colors = {
	// Primary - Deep navy/midnight
	primary: '#1a1a2e',
	primaryLight: '#16213e',
	primaryDark: '#0f0f1a',

	// Accent - Vibrant coral/red
	accent: '#e94560',
	accentLight: '#ff6b6b',
	accentDark: '#c73e54',

	// Secondary - Gold/amber
	secondary: '#f4a261',
	secondaryLight: '#f4c088',
	secondaryDark: '#e07b3d',

	// Neutrals
	background: '#0f0f1a',
	surface: '#1a1a2e',
	surfaceVariant: '#252542',
	card: '#1e1e36',

	// Text
	textPrimary: '#ffffff',
	textSecondary: '#a0a0b2',
	textMuted: '#6b6b7d',

	// Status
	success: '#2ecc71',
	warning: '#f39c12',
	error: '#e74c3c',
	info: '#3498db',

	// Borders
	border: '#2a2a4a',
	borderLight: '#3a3a5a',
}

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
}

export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
}

export const typography = {
	fontFamily: {
		regular: 'System',
		medium: 'System',
		bold: 'System',
	},
	fontSize: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
		xxxl: 32,
	},
}

export const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: colors.accent,
		primaryContainer: colors.primaryLight,
		secondary: colors.secondary,
		secondaryContainer: colors.secondaryDark,
		tertiary: colors.accent,
		tertiaryContainer: colors.accentDark,
		surface: colors.surface,
		surfaceVariant: colors.surfaceVariant,
		background: colors.background,
		error: colors.error,
		errorContainer: colors.error,
		onPrimary: colors.textPrimary,
		onPrimaryContainer: colors.textPrimary,
		onSecondary: colors.primary,
		onSecondaryContainer: colors.textPrimary,
		onTertiary: colors.textPrimary,
		onTertiaryContainer: colors.textPrimary,
		onSurface: colors.textPrimary,
		onSurfaceVariant: colors.textSecondary,
		onError: colors.textPrimary,
		onErrorContainer: colors.textPrimary,
		onBackground: colors.textPrimary,
		outline: colors.border,
		outlineVariant: colors.borderLight,
		shadow: '#000000',
		scrim: '#000000',
		inverseSurface: colors.textPrimary,
		inverseOnSurface: colors.primary,
		inversePrimary: colors.accentDark,
		elevation: {
			level0: 'transparent',
			level1: colors.surface,
			level2: colors.surfaceVariant,
			level3: colors.card,
			level4: colors.card,
			level5: colors.card,
		},
	},
}

export const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: colors.primary,
		primaryContainer: '#e8e8f0',
		secondary: colors.secondary,
		secondaryContainer: '#fff4e6',
		tertiary: colors.accent,
		tertiaryContainer: '#ffe8ec',
		surface: '#ffffff',
		surfaceVariant: '#f5f5f8',
		background: '#fafafa',
		error: colors.error,
		onPrimary: '#ffffff',
		onPrimaryContainer: colors.primary,
		onSecondary: colors.primary,
		onSecondaryContainer: colors.secondaryDark,
		onTertiary: '#ffffff',
		onTertiaryContainer: colors.accentDark,
		onSurface: colors.primary,
		onSurfaceVariant: colors.textMuted,
		onBackground: colors.primary,
		outline: '#d0d0d8',
		outlineVariant: '#e0e0e8',
	},
}

