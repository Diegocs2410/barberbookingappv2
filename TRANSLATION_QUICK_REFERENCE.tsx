/**
 * Quick Reference: Using Translations in BarberBooking App
 * 
 * This file provides quick examples for developers
 */

import { useTranslation } from './src/hooks'

// ============================================================================
// BASIC USAGE
// ============================================================================

function ExampleComponent() {
	const { t, locale, setLocale } = useTranslation()

	return (
		<View>
			{/* Simple translation */}
			<Text>{t('common.loading')}</Text>
			
			{/* Translation with context */}
			<Text>{t('auth.login.title')}</Text>
			
			{/* Show current language */}
			<Text>Current: {locale}</Text>
			
			{/* Change language */}
			<Button onPress={() => setLocale('es')}>🇨🇴 Español</Button>
			<Button onPress={() => setLocale('en')}>🇺🇸 English</Button>
		</View>
	)
}

// ============================================================================
// FORM VALIDATION WITH TRANSLATIONS
// ============================================================================

import { z } from 'zod'

// Create schema factory that takes translation function
const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		email: z.string().email(t('auth.login.errors.invalidEmail')),
		password: z.string().min(6, t('auth.login.errors.invalidPassword')),
	})

// Use in component
function LoginForm() {
	const { t } = useTranslation()
	const schema = createLoginSchema(t) // Schema will have translated messages
	
	// ... use with react-hook-form
}

// ============================================================================
// COMMON TRANSLATION KEYS
// ============================================================================

// Common
t('common.loading')          // "Cargando..." / "Loading..."
t('common.error')            // "Error" / "Error"
t('common.success')          // "Éxito" / "Success"
t('common.cancel')           // "Cancelar" / "Cancel"
t('common.confirm')          // "Confirmar" / "Confirm"
t('common.save')             // "Guardar" / "Save"

// Auth
t('auth.login.title')        // "Iniciar Sesión" / "Sign In"
t('auth.register.title')     // "Crear Cuenta" / "Create Account"
t('auth.logout')             // "Cerrar Sesión" / "Sign Out"

// Customer
t('customer.home.title')     // "Encuentra tu Barbería" / "Find Your Barbershop"
t('customer.booking.title')  // "Confirmar Reserva" / "Confirm Booking"

// Owner
t('owner.dashboard.title')   // "Panel de Control" / "Dashboard"
t('owner.services.title')    // "Servicios" / "Services"

// Profile
t('profile.title')           // "Perfil" / "Profile"
t('profile.editProfile')     // "Editar Perfil" / "Edit Profile"

// ============================================================================
// CONDITIONAL RENDERING BASED ON LANGUAGE
// ============================================================================

function ConditionalExample() {
	const { isSpanish, isEnglish } = useTranslation()

	return (
		<View>
			{isSpanish && <Text>Contenido solo en español</Text>}
			{isEnglish && <Text>Content only in English</Text>}
		</View>
	)
}

// ============================================================================
// LANGUAGE SELECTOR COMPONENT
// ============================================================================

import { LanguageSelector } from './src/components/language-selector'

function SettingsScreen() {
	return (
		<View>
			<Text>Choose your language:</Text>
			<LanguageSelector />
		</View>
	)
}

// ============================================================================
// ADDING NEW TRANSLATIONS
// ============================================================================

/**
 * Step 1: Add to src/i18n/locales/es.ts
 */
export default {
	// ... existing translations
	myFeature: {
		title: 'Mi Nueva Función',
		description: 'Esta es una nueva función',
		button: 'Hacer algo',
	},
}

/**
 * Step 2: Add to src/i18n/locales/en.ts
 */
export default {
	// ... existing translations
	myFeature: {
		title: 'My New Feature',
		description: 'This is a new feature',
		button: 'Do something',
	},
}

/**
 * Step 3: Use in component
 */
function MyNewFeature() {
	const { t } = useTranslation()

	return (
		<View>
			<Text>{t('myFeature.title')}</Text>
			<Text>{t('myFeature.description')}</Text>
			<Button>{t('myFeature.button')}</Button>
		</View>
	)
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

// ✅ DO: Use descriptive keys
t('customer.booking.confirmButton')

// ❌ DON'T: Use generic keys
t('btn1')

// ✅ DO: Keep translations in sync
// Both es.ts and en.ts should have the same structure

// ✅ DO: Use translation for all user-facing text
<Text>{t('common.welcome')}</Text>

// ❌ DON'T: Hardcode text
<Text>Welcome</Text>

// ✅ DO: Create schema factories for validation
const createSchema = (t) => z.object({ ... })

// ❌ DON'T: Hardcode validation messages
z.string().email('Invalid email')

// ============================================================================
// DEBUGGING
// ============================================================================

function DebugTranslations() {
	const { t, locale } = useTranslation()

	console.log('Current locale:', locale)
	console.log('Translation:', t('common.loading'))

	return (
		<View>
			<Text>Locale: {locale}</Text>
			<Text>Test: {t('common.loading')}</Text>
		</View>
	)
}

export {}

