import React from 'react'
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemeColors } from '../../hooks'

/**
 * Props para el componente HeroImage
 */
interface Props {
	/** URL de la imagen o recurso local */
	source: string | ImageSourcePropType
	/** Altura del hero (por defecto 200) */
	height?: number
	/** Contenido a mostrar sobre la imagen */
	children?: React.ReactNode
	/** Estilo adicional para el contenedor */
	style?: object
	/** Si debe mostrar overlay oscuro */
	overlay?: boolean
	/** Intensidad del overlay (0-1) */
	overlayOpacity?: number
	/** Mostrar gradiente inferior para transición al fondo */
	showBottomGradient?: boolean
}

/**
 * Componente HeroImage - Banner con imagen de fondo y overlay
 * Reutilizable para headers de pantallas con contenido superpuesto
 */
export function HeroImage({
	source,
	height = 200,
	children,
	style,
	overlay = true,
	overlayOpacity = 0.4,
	showBottomGradient = true,
}: Props) {
	const { colors } = useThemeColors()

	const imageSource = typeof source === 'string' ? { uri: source } : source

	return (
		<View style={[styles.container, { height }, style]}>
			<Image
				source={imageSource}
				style={styles.image}
				resizeMode="cover"
			/>
			{/* Overlay oscuro sobre la imagen */}
			{overlay && (
				<LinearGradient
					colors={[
						`rgba(0, 0, 0, ${overlayOpacity * 0.6})`,
						`rgba(0, 0, 0, ${overlayOpacity})`,
					]}
					style={styles.overlay}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				/>
			)}
			{/* Gradiente de transición hacia el fondo */}
			{showBottomGradient && (
				<LinearGradient
					colors={[
						'transparent',
						`${colors.background}40`,
						`${colors.background}80`,
						`${colors.background}CC`,
						colors.background,
					]}
					locations={[0, 0.3, 0.5, 0.7, 1]}
					style={styles.bottomGradient}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				/>
			)}
			{children && <View style={styles.content}>{children}</View>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: '100%',
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	bottomGradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 80,
	},
	content: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
	},
})
