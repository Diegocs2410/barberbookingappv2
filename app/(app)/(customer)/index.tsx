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
import { useBusiness } from '../../../src/hooks'
import { Card, Avatar, LoadingScreen } from '../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../src/constants/theme'
import { Business } from '../../../src/types'

export default function DiscoverScreen() {
	const { businesses, isLoading, error, loadAllBusinesses } = useBusiness()
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
					<Text style={styles.businessName}>{item.name}</Text>
					<View style={styles.locationRow}>
						<Ionicons
							name="location-outline"
							size={14}
							color={colors.textSecondary}
						/>
						<Text style={styles.businessAddress} numberOfLines={1}>
							{item.address}
						</Text>
					</View>
					{item.description && (
						<Text style={styles.businessDescription} numberOfLines={2}>
							{item.description}
						</Text>
					)}
				</View>
				<Ionicons
					name="chevron-forward"
					size={20}
					color={colors.textMuted}
				/>
			</View>
		</Card>
	)

	// Only show loading on first load when no businesses exist and no error
	if (isLoading && businesses.length === 0 && !refreshing && !error) {
		return <LoadingScreen message="Finding barbershops..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.title}>Discover</Text>
				<Text style={styles.subtitle}>Find your perfect barber</Text>
			</View>

			<View style={styles.searchContainer}>
				<Searchbar
					placeholder="Search barbershops..."
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={styles.searchbar}
					inputStyle={styles.searchInput}
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
						tintColor={colors.accent}
					/>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Ionicons
							name="storefront-outline"
							size={64}
							color={colors.textMuted}
						/>
						<Text style={styles.emptyTitle}>No barbershops found</Text>
						<Text style={styles.emptySubtitle}>
							{searchQuery
								? 'Try a different search term'
								: 'Barbershops will appear here'}
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
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: colors.textPrimary,
	},
	subtitle: {
		fontSize: 16,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	searchContainer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
	},
	searchbar: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border,
	},
	searchInput: {
		color: colors.textPrimary,
	},
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
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	locationRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	businessAddress: {
		fontSize: 14,
		color: colors.textSecondary,
		flex: 1,
	},
	businessDescription: {
		fontSize: 13,
		color: colors.textMuted,
		marginTop: spacing.xs,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: spacing.xxl * 2,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		marginTop: spacing.md,
	},
	emptySubtitle: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
})

