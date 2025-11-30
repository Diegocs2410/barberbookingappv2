import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

/**
 * Paleta de colores monocromática elegante
 * Diseño minimalista blanco y negro con acentos sutiles
 */
export const colors = {
	// Primary - Negro puro para elementos principales
	primary: '#000000',
	primaryLight: '#1a1a1a',
	primaryDark: '#000000',

	// Accent - Negro para acciones y énfasis
	accent: '#000000',
	accentLight: '#333333',
	accentDark: '#000000',

	// Secondary - Gris medio para elementos secundarios
	secondary: '#666666',
	secondaryLight: '#888888',
	secondaryDark: '#444444',

	// Neutrals - Fondos y superficies
	background: '#ffffff',
	surface: '#ffffff',
	surfaceVariant: '#f8f8f8',
	card: '#ffffff',

	// Text
	textPrimary: '#000000',
	textSecondary: '#666666',
	textMuted: '#999999',

	// Status - Colores funcionales sutiles
	success: '#22c55e',
	warning: '#f59e0b',
	error: '#ef4444',
	info: '#3b82f6',

	// Borders - Bordes sutiles
	border: '#e5e5e5',
	borderLight: '#f0f0f0',
	borderDark: '#d4d4d4',

	// Overlays
	overlay: 'rgba(0, 0, 0, 0.5)',
	shadow: 'rgba(0, 0, 0, 0.08)',
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
	xxl: 24,
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
	fontWeight: {
		regular: '400' as const,
		medium: '500' as const,
		semibold: '600' as const,
		bold: '700' as const,
	},
}

export const shadows = {
	sm: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	md: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
	},
	lg: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
}

export const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: '#ffffff',
		primaryContainer: '#1a1a1a',
		secondary: '#888888',
		secondaryContainer: '#333333',
		tertiary: '#ffffff',
		tertiaryContainer: '#1a1a1a',
		surface: '#0a0a0a',
		surfaceVariant: '#141414',
		background: '#000000',
		error: colors.error,
		errorContainer: colors.error,
		onPrimary: '#000000',
		onPrimaryContainer: '#ffffff',
		onSecondary: '#000000',
		onSecondaryContainer: '#ffffff',
		onTertiary: '#000000',
		onTertiaryContainer: '#ffffff',
		onSurface: '#ffffff',
		onSurfaceVariant: '#888888',
		onError: '#ffffff',
		onErrorContainer: '#ffffff',
		onBackground: '#ffffff',
		outline: '#333333',
		outlineVariant: '#222222',
		shadow: '#000000',
		scrim: '#000000',
		inverseSurface: '#ffffff',
		inverseOnSurface: '#000000',
		inversePrimary: '#000000',
		elevation: {
			level0: 'transparent',
			level1: '#0a0a0a',
			level2: '#141414',
			level3: '#1a1a1a',
			level4: '#222222',
			level5: '#2a2a2a',
		},
	},
}

export const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: colors.primary,
		primaryContainer: '#f5f5f5',
		secondary: colors.secondary,
		secondaryContainer: '#f0f0f0',
		tertiary: colors.primary,
		tertiaryContainer: '#f5f5f5',
		surface: colors.surface,
		surfaceVariant: colors.surfaceVariant,
		background: colors.background,
		error: colors.error,
		onPrimary: '#ffffff',
		onPrimaryContainer: colors.primary,
		onSecondary: '#ffffff',
		onSecondaryContainer: colors.secondary,
		onTertiary: '#ffffff',
		onTertiaryContainer: colors.primary,
		onSurface: colors.textPrimary,
		onSurfaceVariant: colors.textSecondary,
		onBackground: colors.textPrimary,
		outline: colors.border,
		outlineVariant: colors.borderLight,
	},
}
