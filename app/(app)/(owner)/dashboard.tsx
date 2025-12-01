import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	ScrollView,
	RefreshControl,
	Pressable,
} from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useBusiness, useBooking, useThemeColors, useTranslation } from '../../../src/hooks'
import { Card, LoadingScreen, HeroImage } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
import { HERO_IMAGES } from '../../../src/constants/images'
import { Booking, BookingStatus } from '../../../src/types'

interface QuickAction {
	title: string
	icon: keyof typeof Ionicons.glyphMap
	route: string
}

export default function DashboardScreen() {
	const { user } = useAuth()
	const { colors, isDarkMode } = useThemeColors()
	const { t } = useTranslation()

	// Detectar si es barbero o owner
	const isBarber = user?.role === 'barber'
	const isOwner = user?.role === 'owner'

	// Acciones rápidas solo para owners
	const QUICK_ACTIONS: QuickAction[] = isOwner ? [
		{
			title: t('owner.services.title'),
			icon: 'cut-outline',
			route: '/(app)/(owner)/services',
		},
		{
			title: t('owner.barbers.title'),
			icon: 'people-outline',
			route: '/(app)/(owner)/barbers',
		},
		{
			title: t('owner.settings.title'),
			icon: 'settings-outline',
			route: '/(app)/(owner)/settings',
		},
	] : []

	const { currentBusiness, loadOwnerBusiness, loadBusiness, services, barbers, loadServices, loadBarbers } =
		useBusiness()
	const { bookings, isLoading, loadBusinessBookings, confirmBooking, completeBooking } = useBooking()

	const [refreshing, setRefreshing] = useState(false)

	const STATUS_COLORS: Record<BookingStatus, string> = {
		pending: colors.warning,
		confirmed: colors.success,
		completed: colors.info,
		cancelled: colors.error,
	}

	useEffect(() => {
		if (user?.id) {
			if (isBarber && user.businessId) {
				// Barbero: cargar el negocio por ID
				loadBusiness(user.businessId)
			} else if (isOwner) {
				// Owner: buscar su negocio
				loadOwnerBusiness(user.id)
			}
		}
	}, [user?.id, user?.businessId, isBarber, isOwner])

	useEffect(() => {
		if (currentBusiness?.id) {
			loadBusinessBookings(currentBusiness.id, new Date())
			loadServices(currentBusiness.id)
			loadBarbers(currentBusiness.id)
		}
	}, [currentBusiness?.id])

	const onRefresh = async () => {
		setRefreshing(true)
		if (currentBusiness?.id) {
			await loadBusinessBookings(currentBusiness.id, new Date())
		}
		setRefreshing(false)
	}

	// Encontrar el barberId del usuario actual (si es barbero)
	const currentBarber = isBarber 
		? barbers.find((b) => b.userId === user?.id)
		: null

	const todayBookings = bookings.filter((b) => {
		const today = new Date()
		const isToday = b.dateTime.toDateString() === today.toDateString() && b.status !== 'cancelled'
		
		// Si es barbero, solo mostrar sus citas
		if (isBarber && currentBarber) {
			return isToday && b.barberId === currentBarber.id
		}
		
		return isToday
	})

	const pendingBookings = todayBookings.filter((b) => b.status === 'pending')

	const handleConfirm = async (bookingId: string) => {
		await confirmBooking(bookingId)
	}

	const handleComplete = async (bookingId: string) => {
		await completeBooking(bookingId)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
	}

	const renderBooking = ({ item }: { item: Booking }) => {
		const barber = barbers.find((b) => b.id === item.barberId)
		const service = services.find((s) => s.id === item.serviceId)

		return (
			<Card style={styles.bookingCard}>
				<View style={styles.bookingHeader}>
					<View style={styles.timeContainer}>
						<Ionicons
							name="time-outline"
							size={16}
							color={colors.textPrimary}
						/>
						<Text style={[styles.timeText, { color: colors.textPrimary }]}>{formatTime(item.dateTime)}</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: STATUS_COLORS[item.status] },
						]}
					>
						<Text style={styles.statusText}>
							{t(`customer.myBookings.status.${item.status}`)}
						</Text>
					</View>
				</View>

				<View style={[styles.bookingDetails, { borderTopColor: colors.border }]}>
					<Text style={[styles.serviceName, { color: colors.textPrimary }]}>
						{service?.name || 'Service'}
					</Text>
					<Text style={[styles.barberName, { color: colors.textSecondary }]}>
						{t('customer.booking.barber')}: {barber?.name || 'Barber'}
					</Text>
				</View>

				{item.status === 'pending' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, { backgroundColor: colors.success }]}
							onPress={() => handleConfirm(item.id)}
						>
							<Text style={styles.actionButtonText}>{t('common.confirm')}</Text>
						</Pressable>
					</View>
				)}

				{item.status === 'confirmed' && (
					<View style={styles.bookingActions}>
						<Pressable
							style={[styles.actionButton, { backgroundColor: colors.primary }]}
							onPress={() => handleComplete(item.id)}
						>
							<Text style={[styles.actionButtonText, { color: isDarkMode ? '#000000' : '#ffffff' }]}>{t('owner.dashboard.markComplete')}</Text>
						</Pressable>
					</View>
				)}
			</Card>
		)
	}

	if (isLoading && !refreshing && !currentBusiness) {
		return <LoadingScreen message={t('common.loading')} />
	}

	if (!currentBusiness) {
		// Para barberos sin negocio vinculado, mostrar mensaje diferente
		if (isBarber) {
			return (
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
					<HeroImage
						source={HERO_IMAGES.ownerDashboard}
						height={280}
						overlayOpacity={0.5}
					>
						<View style={styles.heroSetupContent}>
							<View style={[styles.setupIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
								<Ionicons
									name="cut-outline"
									size={48}
									color="#ffffff"
								/>
							</View>
							<Text style={styles.heroSetupTitle}>{t('auth.roleSelect.barberNotLinkedTitle')}</Text>
							<Text style={styles.heroSetupSubtitle}>
								{t('auth.roleSelect.barberNotLinkedMessage')}
							</Text>
						</View>
					</HeroImage>
				</SafeAreaView>
			)
		}

		// Para owners sin negocio, mostrar setup
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
				<HeroImage
					source={HERO_IMAGES.ownerDashboard}
					height={280}
					overlayOpacity={0.5}
				>
					<View style={styles.heroSetupContent}>
						<View style={[styles.setupIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
							<Ionicons
								name="storefront-outline"
								size={48}
								color="#ffffff"
							/>
						</View>
						<Text style={styles.heroSetupTitle}>{t('owner.dashboard.setupBusiness')}</Text>
						<Text style={styles.heroSetupSubtitle}>
							{t('owner.dashboard.setupDescription')}
						</Text>
					</View>
				</HeroImage>
				<View style={styles.setupButtonContainer}>
					<Pressable
						style={[styles.setupButton, { backgroundColor: colors.primary }]}
						onPress={() => router.push('/(app)/(owner)/settings')}
					>
						<Text style={[styles.setupButtonText, { color: isDarkMode ? '#000000' : '#ffffff' }]}>{t('owner.dashboard.getStarted')}</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		)
	}

	// Obtener imagen de portada del negocio o usar la imagen por defecto
	const heroImageSource = currentBusiness.coverImageUrl || HERO_IMAGES.ownerDashboard

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={colors.primary}
					/>
				}
			>
				{/* Hero Banner */}
				<HeroImage
					source={heroImageSource}
					height={200}
					overlayOpacity={0.45}
				>
					<View style={styles.heroContent}>
						<Text style={styles.heroGreeting}>
							{t('owner.dashboard.welcome')}, {user?.name?.split(' ')[0]}!
						</Text>
						<Text style={styles.heroBusinessName}>{currentBusiness.name}</Text>
					</View>
				</HeroImage>

				{/* Stats Cards */}
				<View style={styles.statsRow}>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<View style={[styles.statIconContainer, { backgroundColor: colors.primary + '20' }]}>
							<Ionicons name="calendar" size={20} color={colors.primary} />
						</View>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{todayBookings.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('owner.dashboard.todayAppointments')}</Text>
					</View>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<View style={[styles.statIconContainer, { backgroundColor: colors.warning + '20' }]}>
							<Ionicons name="hourglass" size={20} color={colors.warning} />
						</View>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{pendingBookings.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('customer.myBookings.status.pending')}</Text>
					</View>
					<View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
						<View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
							<Ionicons name="cut" size={20} color={colors.success} />
						</View>
						<Text style={[styles.statNumber, { color: colors.textPrimary }]}>{services.length}</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('owner.services.title')}</Text>
					</View>
				</View>

				{/* Quick Actions - Solo para owners */}
				{QUICK_ACTIONS.length > 0 && (
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('owner.dashboard.quickActions')}</Text>
						<View style={styles.actionsGrid}>
							{QUICK_ACTIONS.map((action) => (
								<Pressable
									key={action.title}
									style={({ pressed }) => [
										styles.actionCard,
										{ backgroundColor: colors.surface, borderColor: colors.border },
										pressed && styles.actionCardPressed,
									]}
									onPress={() => router.push(action.route as any)}
								>
									<View style={[styles.actionIcon, { backgroundColor: colors.surfaceVariant }]}>
										<Ionicons
											name={action.icon}
											size={24}
											color={colors.textPrimary}
										/>
									</View>
									<Text style={[styles.actionTitle, { color: colors.textPrimary }]}>{action.title}</Text>
								</Pressable>
							))}
						</View>
					</View>
				)}

				{/* Today's Schedule */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('owner.dashboard.todaySchedule')}</Text>
					{todayBookings.length === 0 ? (
						<Card style={styles.emptyCard}>
							<View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceVariant }]}>
								<Ionicons
									name="calendar-outline"
									size={32}
									color={colors.textMuted}
								/>
							</View>
							<Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('owner.dashboard.noAppointments')}</Text>
						</Card>
					) : (
						todayBookings.map((booking) => (
							<View key={booking.id}>
								{renderBooking({ item: booking })}
							</View>
						))
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: spacing.xxl,
	},
	heroContent: {
		paddingBottom: spacing.md,
	},
	heroGreeting: {
		fontSize: 16,
		fontWeight: '500',
		color: 'rgba(255, 255, 255, 0.9)',
		marginBottom: spacing.xs,
	},
	heroBusinessName: {
		fontSize: 28,
		fontWeight: '700',
		color: '#ffffff',
		letterSpacing: -0.5,
	},
	heroSetupContent: {
		alignItems: 'center',
		paddingBottom: spacing.lg,
	},
	heroSetupTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#ffffff',
		marginTop: spacing.md,
		textAlign: 'center',
	},
	heroSetupSubtitle: {
		fontSize: 15,
		color: 'rgba(255, 255, 255, 0.85)',
		marginTop: spacing.sm,
		textAlign: 'center',
		paddingHorizontal: spacing.xl,
		lineHeight: 22,
	},
	setupButtonContainer: {
		padding: spacing.xl,
		paddingTop: spacing.lg,
	},
	statsRow: {
		flexDirection: 'row',
		gap: spacing.sm,
		paddingHorizontal: spacing.xl,
		marginTop: spacing.lg,
		marginBottom: spacing.xl,
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: borderRadius.xl,
		borderWidth: 1,
	},
	statIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: '700',
	},
	statLabel: {
		fontSize: 10,
		marginTop: spacing.xs,
		textAlign: 'center',
		fontWeight: '500',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},
	section: {
		paddingHorizontal: spacing.xl,
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: spacing.md,
	},
	actionsGrid: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	actionCard: {
		flex: 1,
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: borderRadius.xl,
		borderWidth: 1,
	},
	actionCardPressed: {
		opacity: 0.7,
		transform: [{ scale: 0.98 }],
	},
	actionIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	actionTitle: {
		fontSize: 13,
		fontWeight: '600',
	},
	bookingCard: {
		marginBottom: spacing.sm,
	},
	bookingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	timeText: {
		fontSize: 16,
		fontWeight: '600',
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.sm,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#ffffff',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},
	bookingDetails: {
		borderTopWidth: 1,
		paddingTop: spacing.sm,
	},
	serviceName: {
		fontSize: 16,
		fontWeight: '500',
	},
	barberName: {
		fontSize: 14,
		marginTop: spacing.xs,
	},
	bookingActions: {
		marginTop: spacing.md,
		flexDirection: 'row',
		gap: spacing.sm,
	},
	actionButton: {
		flex: 1,
		paddingVertical: spacing.sm,
		borderRadius: borderRadius.lg,
		alignItems: 'center',
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff',
	},
	emptyCard: {
		alignItems: 'center',
		padding: spacing.xl,
	},
	emptyIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	emptyText: {
		fontSize: 14,
		fontWeight: '500',
	},
	setupIconContainer: {
		width: 96,
		height: 96,
		borderRadius: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	setupButton: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.lg,
		alignItems: 'center',
	},
	setupButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
})
