import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useBooking } from '../../../../src/hooks'
import { Button, Card, Avatar, LoadingScreen } from '../../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../../src/constants/theme'
import { Service, Barber } from '../../../../src/types'

export default function BusinessDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const {
		currentBusiness,
		services,
		barbers,
		isLoading,
		loadBusiness,
		loadServices,
		loadBarbers,
	} = useBusiness()
	const { selectService, selectBarber, selectedServiceId, selectedBarberId } =
		useBooking()

	useEffect(() => {
		if (id) {
			loadBusiness(id)
			loadServices(id)
			loadBarbers(id)
		}
	}, [id])

	const handleServiceSelect = (service: Service) => {
		selectService(selectedServiceId === service.id ? null : service.id)
	}

	const handleBarberSelect = (barber: Barber) => {
		selectBarber(selectedBarberId === barber.id ? null : barber.id)
	}

	const handleBookNow = () => {
		if (id) {
			router.push(`/(app)/(customer)/book/${id}`)
		}
	}

	if (isLoading || !currentBusiness) {
		return <LoadingScreen message="Loading business..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={styles.headerTitle} numberOfLines={1}>
					{currentBusiness.name}
				</Text>
				<View style={styles.backButton} />
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Business Info */}
				<View style={styles.businessInfo}>
					<Avatar
						source={currentBusiness.logoUrl}
						name={currentBusiness.name}
						size="large"
					/>
					<Text style={styles.businessName}>{currentBusiness.name}</Text>
					<View style={styles.locationRow}>
						<Ionicons
							name="location-outline"
							size={16}
							color={colors.textSecondary}
						/>
						<Text style={styles.address}>{currentBusiness.address}</Text>
					</View>
					{currentBusiness.description && (
						<Text style={styles.description}>
							{currentBusiness.description}
						</Text>
					)}
				</View>

				{/* Services */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Services</Text>
					{services.length === 0 ? (
						<Text style={styles.emptyText}>No services available</Text>
					) : (
						services.map((service) => (
							<Pressable
								key={service.id}
								onPress={() => handleServiceSelect(service)}
							>
							<Card
								style={{
									...styles.serviceCard,
									...(selectedServiceId === service.id ? styles.selectedCard : {}),
								}}
								>
									<View style={styles.serviceContent}>
										<View style={styles.serviceInfo}>
											<Text style={styles.serviceName}>{service.name}</Text>
											{service.description && (
												<Text style={styles.serviceDescription}>
													{service.description}
												</Text>
											)}
											<View style={styles.serviceMeta}>
												<View style={styles.metaItem}>
													<Ionicons
														name="time-outline"
														size={14}
														color={colors.textSecondary}
													/>
													<Text style={styles.metaText}>
														{service.duration} min
													</Text>
												</View>
											</View>
										</View>
										<View style={styles.priceContainer}>
											<Text style={styles.price}>${service.price}</Text>
											{selectedServiceId === service.id && (
												<Ionicons
													name="checkmark-circle"
													size={24}
													color={colors.accent}
												/>
											)}
										</View>
									</View>
								</Card>
							</Pressable>
						))
					)}
				</View>

				{/* Barbers */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Our Barbers</Text>
					{barbers.length === 0 ? (
						<Text style={styles.emptyText}>No barbers available</Text>
					) : (
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.barbersContainer}
						>
							{barbers.map((barber) => (
								<Pressable
									key={barber.id}
									onPress={() => handleBarberSelect(barber)}
								>
									<View
										style={[
											styles.barberCard,
											selectedBarberId === barber.id && styles.selectedBarberCard,
										]}
									>
										<Avatar
											source={barber.photoUrl}
											name={barber.name}
											size="medium"
										/>
										<Text style={styles.barberName}>{barber.name}</Text>
										{barber.specialties.length > 0 && (
											<Text style={styles.barberSpecialty} numberOfLines={1}>
												{barber.specialties[0]}
											</Text>
										)}
										{selectedBarberId === barber.id && (
											<View style={styles.selectedBadge}>
												<Ionicons
													name="checkmark"
													size={12}
													color={colors.textPrimary}
												/>
											</View>
										)}
									</View>
								</Pressable>
							))}
						</ScrollView>
					)}
				</View>
			</ScrollView>

			{/* Book Now Button */}
			<View style={styles.footer}>
				<Button
					onPress={handleBookNow}
					disabled={!selectedServiceId || !selectedBarberId}
				>
					{!selectedServiceId || !selectedBarberId
						? 'Select Service & Barber'
						: 'Choose Date & Time'}
				</Button>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		textAlign: 'center',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: spacing.xxl,
	},
	businessInfo: {
		alignItems: 'center',
		padding: spacing.xl,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	businessName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.textPrimary,
		marginTop: spacing.md,
	},
	locationRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		marginTop: spacing.sm,
	},
	address: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	description: {
		fontSize: 14,
		color: colors.textMuted,
		textAlign: 'center',
		marginTop: spacing.md,
		paddingHorizontal: spacing.xl,
	},
	section: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	emptyText: {
		fontSize: 14,
		color: colors.textMuted,
	},
	serviceCard: {
		marginBottom: spacing.sm,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	selectedCard: {
		borderColor: colors.accent,
		backgroundColor: colors.surfaceVariant,
	},
	serviceContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	serviceInfo: {
		flex: 1,
	},
	serviceName: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	serviceDescription: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	serviceMeta: {
		flexDirection: 'row',
		gap: spacing.md,
		marginTop: spacing.sm,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	metaText: {
		fontSize: 12,
		color: colors.textSecondary,
	},
	priceContainer: {
		alignItems: 'flex-end',
		gap: spacing.sm,
	},
	price: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.accent,
	},
	barbersContainer: {
		gap: spacing.md,
		paddingVertical: spacing.sm,
	},
	barberCard: {
		alignItems: 'center',
		padding: spacing.md,
		backgroundColor: colors.card,
		borderRadius: borderRadius.lg,
		borderWidth: 2,
		borderColor: colors.border,
		width: 100,
	},
	selectedBarberCard: {
		borderColor: colors.accent,
		backgroundColor: colors.surfaceVariant,
	},
	barberName: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.textPrimary,
		marginTop: spacing.sm,
		textAlign: 'center',
	},
	barberSpecialty: {
		fontSize: 11,
		color: colors.textSecondary,
		marginTop: spacing.xs,
		textAlign: 'center',
	},
	selectedBadge: {
		position: 'absolute',
		top: spacing.sm,
		right: spacing.sm,
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: colors.accent,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		padding: spacing.xl,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		backgroundColor: colors.surface,
	},
})

