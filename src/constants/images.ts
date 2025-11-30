/**
 * Constantes de imágenes mock para la aplicación
 * Utilizamos URLs de Unsplash optimizadas para carga rápida
 */

/**
 * Imágenes hero para banners principales
 */
export const HERO_IMAGES = {
	/** Banner para el dashboard del owner - Interior de barbería elegante */
	ownerDashboard: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80',
	/** Banner para la pantalla de descubrir barberías */
	customerHome: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
	/** Imagen alternativa de barbería moderna */
	barberShopAlt: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
}

/**
 * Imágenes de portada para negocios mock
 * Array de URLs para asignar a diferentes barberías
 */
export const BUSINESS_COVER_IMAGES = [
	'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
	'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
	'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
	'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80',
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
	'https://images.unsplash.com/photo-1596362601603-cf277de31c1d?w=600&q=80',
	'https://images.unsplash.com/photo-1634302086887-13b5281d7431?w=600&q=80',
	'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
]

/**
 * Imágenes de barberos para avatares mock
 */
export const BARBER_IMAGES = [
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
	'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
	'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
	'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
]

/**
 * Obtiene una imagen de portada basada en el índice del negocio
 * Usa módulo para ciclar a través del array si hay más negocios que imágenes
 */
export function getBusinessCoverImage(index: number): string {
	return BUSINESS_COVER_IMAGES[index % BUSINESS_COVER_IMAGES.length]
}

/**
 * Obtiene una imagen de barbero basada en el índice
 */
export function getBarberImage(index: number): string {
	return BARBER_IMAGES[index % BARBER_IMAGES.length]
}

