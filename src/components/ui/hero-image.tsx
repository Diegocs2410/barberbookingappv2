import React from 'react'
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native'

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
}: Props) {
	const imageSource = typeof source === 'string' ? { uri: source } : source

	return (
		<View style={[styles.container, { height }, style]}>
			<Image
				source={imageSource}
				style={styles.image}
				resizeMode="cover"
			/>
			{overlay && (
				<View
					style={[
						styles.overlay,
						{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
					]}
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
	content: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
	},
})
