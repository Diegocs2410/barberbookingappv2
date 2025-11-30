import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	Pressable,
} from 'react-native'
import { Text, Searchbar } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useBusiness, useTranslation, useThemeColors } from '../../../src/hooks'
import { Card, Avatar, LoadingScreen } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
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

	const renderBusiness = ({ item }: { item: Business }) => (
		<Card
			style={styles.businessCard}
			onPress={() => handleBusinessPress(item)}
			variant="elevated"
		>
			<View style={styles.businessContent}>
				<Avatar source={item.logoUrl} name={item.name} size="medium" />
				<View style={styles.businessInfo}>
					<Text style={[styles.businessName, { color: colors.textPrimary }]}>{item.name}</Text>
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
				<View style={[styles.chevronContainer, { backgroundColor: colors.surfaceVariant }]}>
					<Ionicons
						name="chevron-forward"
						size={20}
						color={colors.textMuted}
					/>
				</View>
			</View>
		</Card>
	)

	// Only show loading on first load when no businesses exist and no error
	if (isLoading && businesses.length === 0 && !refreshing && !error) {
		return <LoadingScreen message={t('common.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: colors.textPrimary }]}>{t('customer.home.title')}</Text>
				<Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('customer.home.subtitle')}</Text>
			</View>

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
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
	},
	title: {
		fontSize: 32,
		fontWeight: '700',
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 16,
		marginTop: spacing.xs,
	},
	searchContainer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
	},
	searchbar: {
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		elevation: 0,
		shadowOpacity: 0,
	},
	searchInput: {},
	listContent: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	businessCard: {
		marginBottom: spacing.md,
	},
	businessContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	businessInfo: {
		flex: 1,
	},
	businessName: {
		fontSize: 17,
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
		marginTop: spacing.xs,
		lineHeight: 18,
	},
	chevronContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
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
