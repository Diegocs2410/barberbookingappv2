import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	Pressable,
	Image,
} from 'react-native'
import { Text, Searchbar } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useTranslation, useThemeColors } from '../../../src/hooks'
import { LoadingScreen, HeroImage, Avatar } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
import { HERO_IMAGES, getBusinessCoverImage } from '../../../src/constants/images'
import { Business } from '../../../src/types'

export default function DiscoverScreen() {
	const { businesses, isLoading, error, loadAllBusinesses } = useBusiness()
	const { t } = useTranslation()
	const { colors } = useThemeColors()
	const [searchQuery, setSearchQuery] = useState('')
	const [refreshing, setRefreshing] = useState(false)

	useEffect(() => {
		// Always try to load, the slice handles caching
		loadAllBusinesses().catch((err) => {
			console.error('Error loading businesses:', err)
		})
	}, [loadAllBusinesses])

	const onRefresh = async () => {
		setRefreshing(true)
		await loadAllBusinesses()
		setRefreshing(false)
	}

	const filteredBusinesses = businesses.filter(
		(business) =>
			business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			business.address.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleBusinessPress = (business: Business) => {
		router.push(`/(app)/(customer)/business/${business.id}`)
	}

	const renderBusiness = ({ item, index }: { item: Business; index: number }) => {
		// Usar la imagen de portada del negocio o una imagen mock basada en el índice
		const coverImage = item.coverImageUrl || getBusinessCoverImage(index)

		return (
			<Pressable
				style={({ pressed }) => [
					styles.businessCard,
					{ backgroundColor: colors.surface },
					pressed && styles.businessCardPressed,
				]}
				onPress={() => handleBusinessPress(item)}
			>
				{/* Cover Image */}
				<View style={styles.coverImageContainer}>
					<Image
						source={{ uri: coverImage }}
						style={styles.coverImage}
						resizeMode="cover"
					/>
					{/* Logo overlay */}
					<View style={[styles.logoOverlay, { backgroundColor: colors.surface }]}>
						<Avatar source={item.logoUrl} name={item.name} size="small" />
					</View>
				</View>

				{/* Business Info */}
				<View style={styles.businessInfo}>
					<Text style={[styles.businessName, { color: colors.textPrimary }]} numberOfLines={1}>
						{item.name}
					</Text>
					<View style={styles.locationRow}>
						<Ionicons
							name="location-outline"
							size={14}
							color={colors.textSecondary}
						/>
						<Text style={[styles.businessAddress, { color: colors.textSecondary }]} numberOfLines={1}>
							{item.address}
						</Text>
					</View>
					{item.description && (
						<Text style={[styles.businessDescription, { color: colors.textMuted }]} numberOfLines={2}>
							{item.description}
						</Text>
					)}
				</View>
			</Pressable>
		)
	}

	// Only show loading on first load when no businesses exist and no error
	if (isLoading && businesses.length === 0 && !refreshing && !error) {
		return <LoadingScreen message={t('common.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<FlatList
				data={filteredBusinesses}
				renderItem={renderBusiness}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.primary}
					/>
				}
				ListHeaderComponent={
					<View>
						{/* Hero Banner */}
						<HeroImage
							source={HERO_IMAGES.customerHome}
							height={180}
							overlayOpacity={0.5}
						>
							<View style={styles.heroContent}>
								<Text style={styles.heroTitle}>{t('customer.home.title')}</Text>
								<Text style={styles.heroSubtitle}>{t('customer.home.subtitle')}</Text>
							</View>
						</HeroImage>

						{/* Search Bar */}
						<View style={styles.searchContainer}>
							<Searchbar
								placeholder={t('customer.home.searchPlaceholder')}
								onChangeText={setSearchQuery}
								value={searchQuery}
								style={[styles.searchbar, { backgroundColor: colors.surface, borderColor: colors.border }]}
								inputStyle={[styles.searchInput, { color: colors.textPrimary }]}
								iconColor={colors.textSecondary}
								placeholderTextColor={colors.textMuted}
							/>
						</View>

						{/* Section Title */}
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
								{t('customer.home.nearbyBarbers')}
							</Text>
						</View>
					</View>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceVariant }]}>
							<Ionicons
								name="storefront-outline"
								size={48}
								color={colors.textMuted}
							/>
						</View>
						<Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('customer.home.noBusinesses')}</Text>
						<Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
							{searchQuery
								? t('common.noResults')
								: t('customer.home.businessesWillAppear')}
						</Text>
					</View>
				}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContent: {
		paddingBottom: spacing.xxl,
	},
	heroContent: {
		paddingBottom: spacing.sm,
	},
	heroTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: '#ffffff',
		letterSpacing: -0.5,
		marginBottom: spacing.xs,
	},
	heroSubtitle: {
		fontSize: 15,
		color: 'rgba(255, 255, 255, 0.9)',
	},
	searchContainer: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.lg,
		paddingBottom: spacing.md,
	},
	searchbar: {
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		elevation: 0,
		shadowOpacity: 0,
	},
	searchInput: {},
	sectionHeader: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.md,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
	},
	businessCard: {
		marginHorizontal: spacing.xl,
		marginBottom: spacing.lg,
		borderRadius: borderRadius.xl,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	businessCardPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.98 }],
	},
	coverImageContainer: {
		position: 'relative',
		height: 160,
		width: '100%',
	},
	coverImage: {
		width: '100%',
		height: '100%',
	},
	logoOverlay: {
		position: 'absolute',
		bottom: -20,
		left: spacing.md,
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	businessInfo: {
		padding: spacing.md,
		paddingTop: spacing.xl + spacing.xs,
	},
	businessName: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.xs,
	},
	locationRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	businessAddress: {
		fontSize: 14,
		flex: 1,
	},
	businessDescription: {
		fontSize: 13,
		marginTop: spacing.sm,
		lineHeight: 18,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: spacing.xxl * 2,
	},
	emptyIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginTop: spacing.sm,
	},
	emptySubtitle: {
		fontSize: 14,
		marginTop: spacing.xs,
	},
})
