import { useColorScheme } from 'react-native'
import { colors as lightColors } from '../constants/theme'

/**
 * Colores para el modo oscuro
 * Paleta monocromática elegante invertida
 */
const darkColors = {
	// Primary - Blanco para elementos principales en dark mode
	primary: '#ffffff',
	primaryLight: '#f0f0f0',
	primaryDark: '#e5e5e5',

	// Accent - Blanco para acciones y énfasis
	accent: '#ffffff',
	accentLight: '#f0f0f0',
	accentDark: '#e5e5e5',

	// Secondary - Gris claro para elementos secundarios
	secondary: '#999999',
	secondaryLight: '#aaaaaa',
	secondaryDark: '#888888',

	// Neutrals - Fondos y superficies oscuros
	background: '#000000',
	surface: '#0a0a0a',
	surfaceVariant: '#141414',
	card: '#0a0a0a',

	// Text
	textPrimary: '#ffffff',
	textSecondary: '#999999',
	textMuted: '#666666',

	// Status - Colores funcionales (mismos que light)
	success: '#22c55e',
	warning: '#f59e0b',
	error: '#ef4444',
	info: '#3b82f6',

	// Borders - Bordes sutiles oscuros
	border: '#222222',
	borderLight: '#333333',
	borderDark: '#1a1a1a',

	// Overlays
	overlay: 'rgba(255, 255, 255, 0.1)',
	shadow: 'rgba(0, 0, 0, 0.3)',
}

/**
 * Hook para obtener colores según el tema del dispositivo
 * @returns Objeto con colores del tema actual y booleano isDarkMode
 */
export function useThemeColors() {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	return {
		colors: isDarkMode ? darkColors : lightColors,
		isDarkMode,
	}
}

export { lightColors, darkColors }

