import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useBooking, useThemeColors, useTranslation } from '../../../../src/hooks'
import { Button, Card, Avatar, LoadingScreen } from '../../../../src/components/ui'
import { spacing, borderRadius } from '../../../../src/constants/theme'
import { Service, Barber } from '../../../../src/types'

export default function BusinessDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { colors, isDarkMode } = useThemeColors()
	const { t } = useTranslation()
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
		return <LoadingScreen message={t('common.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
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
				<View style={[styles.businessInfo, { borderBottomColor: colors.border }]}>
					<Avatar
						source={currentBusiness.logoUrl}
						name={currentBusiness.name}
						size="large"
					/>
					<Text style={[styles.businessName, { color: colors.textPrimary }]}>{currentBusiness.name}</Text>
					<View style={styles.locationRow}>
						<Ionicons
							name="location-outline"
							size={16}
							color={colors.textSecondary}
						/>
						<Text style={[styles.address, { color: colors.textSecondary }]}>{currentBusiness.address}</Text>
					</View>
					{currentBusiness.description && (
						<Text style={[styles.description, { color: colors.textMuted }]}>
							{currentBusiness.description}
						</Text>
					)}
				</View>

				{/* Services */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('customer.business.services')}</Text>
					{services.length === 0 ? (
						<Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('customer.business.noServices')}</Text>
					) : (
						services.map((service) => (
							<Pressable
								key={service.id}
								onPress={() => handleServiceSelect(service)}
							>
								<Card
									style={[
										styles.serviceCard,
										{
											borderColor: selectedServiceId === service.id ? colors.primary : colors.border,
											backgroundColor: selectedServiceId === service.id ? colors.surfaceVariant : colors.card,
										},
									]}
								>
									<View style={styles.serviceContent}>
										<View style={styles.serviceInfo}>
											<Text style={[styles.serviceName, { color: colors.textPrimary }]}>{service.name}</Text>
											{service.description && (
												<Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>
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
													<Text style={[styles.metaText, { color: colors.textSecondary }]}>
														{service.duration} min
													</Text>
												</View>
											</View>
										</View>
										<View style={styles.priceContainer}>
											<Text style={[styles.price, { color: colors.textPrimary }]}>${service.price}</Text>
											{selectedServiceId === service.id && (
												<Ionicons
													name="checkmark-circle"
													size={24}
													color={colors.primary}
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
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('customer.business.barbers')}</Text>
					{barbers.length === 0 ? (
						<Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('customer.business.noBarbers')}</Text>
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
											{
												borderColor: selectedBarberId === barber.id ? colors.primary : colors.border,
												backgroundColor: selectedBarberId === barber.id ? colors.surfaceVariant : colors.card,
											},
										]}
									>
										<Avatar
											source={barber.photoUrl}
											name={barber.name}
											size="medium"
										/>
										<Text style={[styles.barberName, { color: colors.textPrimary }]}>{barber.name}</Text>
										{barber.specialties.length > 0 && (
											<Text style={[styles.barberSpecialty, { color: colors.textSecondary }]} numberOfLines={1}>
												{barber.specialties[0]}
											</Text>
										)}
										{selectedBarberId === barber.id && (
											<View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
												<Ionicons
													name="checkmark"
													size={12}
													color={isDarkMode ? '#000000' : '#ffffff'}
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
			<View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
				<Button
					onPress={handleBookNow}
					disabled={!selectedServiceId || !selectedBarberId}
				>
					{!selectedServiceId || !selectedBarberId
						? t('customer.business.selectServiceBarber')
						: t('customer.business.chooseDateTime')}
				</Button>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
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
	},
	businessName: {
		fontSize: 24,
		fontWeight: '700',
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
	},
	description: {
		fontSize: 14,
		textAlign: 'center',
		marginTop: spacing.md,
		paddingHorizontal: spacing.xl,
		lineHeight: 20,
	},
	section: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: spacing.md,
	},
	emptyText: {
		fontSize: 14,
	},
	serviceCard: {
		marginBottom: spacing.sm,
		borderWidth: 1.5,
		borderRadius: borderRadius.xl,
		padding: spacing.md,
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
	},
	serviceDescription: {
		fontSize: 13,
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
		fontWeight: '500',
	},
	priceContainer: {
		alignItems: 'flex-end',
		gap: spacing.sm,
	},
	price: {
		fontSize: 20,
		fontWeight: '700',
	},
	barbersContainer: {
		gap: spacing.md,
		paddingVertical: spacing.sm,
	},
	barberCard: {
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: borderRadius.xl,
		borderWidth: 1.5,
		width: 100,
	},
	barberName: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: spacing.sm,
		textAlign: 'center',
	},
	barberSpecialty: {
		fontSize: 11,
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
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		padding: spacing.xl,
		borderTopWidth: 1,
	},
})
