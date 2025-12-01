import React, { useEffect, useState } from 'react'
import {
	View,
	StyleSheet,
	FlatList,
	Pressable,
	Alert,
	Modal,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
} from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth, useBusiness, useThemeColors, useTranslation } from '../../../src/hooks'
import { Card, Button, Input, Avatar, LoadingScreen } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
import { Barber, User } from '../../../src/types'

/**
 * Pantalla de gestión de barberos para el owner del negocio
 * Permite agregar, editar, vincular y desvincular barberos
 */
export default function BarbersScreen() {
	const { user } = useAuth()
	const { colors } = useThemeColors()
	const { t } = useTranslation()
	const {
		currentBusiness,
		barbers,
		isLoading,
		loadOwnerBusiness,
		loadBarbers,
		addBarber,
		updateBarber,
		removeBarber,
		findUserByEmail,
		linkBarber,
		unlinkBarber,
	} = useBusiness()

	const [modalVisible, setModalVisible] = useState(false)
	const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const [foundUser, setFoundUser] = useState<User | null>(null)
	const [searchedEmail, setSearchedEmail] = useState('')

	// Schema con traducciones
	const barberSchema = z.object({
		name: z.string().min(2, t('owner.barbers.errors.nameRequired')),
		email: z.string().email(t('auth.login.errors.invalidEmail')).optional().or(z.literal('')),
		specialties: z.string().optional(),
	})

	type BarberFormData = z.infer<typeof barberSchema>

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<BarberFormData>({
		resolver: zodResolver(barberSchema),
		defaultValues: {
			name: '',
			email: '',
			specialties: '',
		},
	})

	const emailValue = watch('email')

	useEffect(() => {
		if (user?.id) {
			loadOwnerBusiness(user.id)
		}
	}, [user?.id])

	useEffect(() => {
		if (currentBusiness?.id) {
			loadBarbers(currentBusiness.id)
		}
	}, [currentBusiness?.id])

	// Buscar usuario cuando cambia el email
	useEffect(() => {
		const searchUser = async () => {
			if (!emailValue || emailValue.length < 5 || !emailValue.includes('@')) {
				setFoundUser(null)
				setSearchedEmail('')
				return
			}

			// Evitar búsquedas repetidas del mismo email
			if (emailValue === searchedEmail) return

			setIsSearching(true)
			try {
				const user = await findUserByEmail(emailValue)
				setFoundUser(user)
				setSearchedEmail(emailValue)
			} catch (error) {
				console.error('Error al buscar usuario:', error)
				setFoundUser(null)
			} finally {
				setIsSearching(false)
			}
		}

		const timeoutId = setTimeout(searchUser, 500)
		return () => clearTimeout(timeoutId)
	}, [emailValue, searchedEmail, findUserByEmail])

	const openAddModal = () => {
		setEditingBarber(null)
		setFoundUser(null)
		setSearchedEmail('')
		reset({
			name: '',
			email: '',
			specialties: '',
		})
		setModalVisible(true)
	}

	const openEditModal = (barber: Barber) => {
		setEditingBarber(barber)
		setFoundUser(null)
		setSearchedEmail('')
		reset({
			name: barber.name,
			email: barber.email || '',
			specialties: barber.specialties.join(', '),
		})
		setModalVisible(true)
	}

	const handleDelete = (barber: Barber) => {
		Alert.alert(
			t('owner.barbers.deleteBarber'),
			t('owner.barbers.deleteConfirm'),
			[
				{ text: t('common.cancel'), style: 'cancel' },
				{
					text: t('common.delete'),
					style: 'destructive',
					onPress: async () => {
						if (currentBusiness?.id) {
							await removeBarber(currentBusiness.id, barber.id)
						}
					},
				},
			]
		)
	}

	const handleUnlink = (barber: Barber) => {
		Alert.alert(
			t('owner.barbers.unlinkBarber'),
			t('owner.barbers.unlinkConfirm'),
			[
				{ text: t('common.cancel'), style: 'cancel' },
				{
					text: t('common.confirm'),
					onPress: async () => {
						if (currentBusiness?.id) {
							try {
								await unlinkBarber(currentBusiness.id, barber.id)
								loadBarbers(currentBusiness.id)
							} catch (error) {
								Alert.alert(t('common.error'), t('owner.barbers.unlinkError'))
							}
						}
					},
				},
			]
		)
	}

	const onSubmit = async (data: BarberFormData) => {
		if (!currentBusiness?.id) return

		setIsSubmitting(true)
		try {
			const specialties = data.specialties
				? data.specialties.split(',').map((s) => s.trim()).filter(Boolean)
				: []

			if (editingBarber) {
				await updateBarber(currentBusiness.id, editingBarber.id, {
					name: data.name,
					email: data.email || undefined,
					specialties,
				})
			} else {
				// Crear el barbero
				const newBarber = await addBarber(currentBusiness.id, {
					userId: foundUser?.id || '',
					name: data.name,
					email: data.email || undefined,
					specialties,
				})

				// Si encontramos un usuario, preguntar si desea vincularlo
				if (foundUser && newBarber) {
					Alert.alert(
						t('owner.barbers.linkBarber'),
						t('owner.barbers.linkConfirm', { name: foundUser.name }),
						[
							{ text: t('common.no'), style: 'cancel' },
							{
								text: t('common.yes'),
								onPress: async () => {
									try {
										await linkBarber(currentBusiness.id, newBarber.id, foundUser.id)
										loadBarbers(currentBusiness.id)
									} catch (error) {
										Alert.alert(t('common.error'), t('owner.barbers.linkError'))
									}
								},
							},
						]
					)
				}
			}

			setModalVisible(false)
			reset()
			setFoundUser(null)
			setSearchedEmail('')
		} catch (error) {
			Alert.alert(t('common.error'), t('owner.barbers.saveError'))
		} finally {
			setIsSubmitting(false)
		}
	}

	const renderBarber = ({ item }: { item: Barber }) => (
		<Card style={styles.barberCard}>
			<View style={styles.barberContent}>
				<Avatar source={item.photoUrl} name={item.name} size="medium" />
				<View style={styles.barberInfo}>
					<View style={styles.barberNameRow}>
						<Text style={[styles.barberName, { color: colors.textPrimary }]}>{item.name}</Text>
						{item.isLinked ? (
							<View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
								<Ionicons name="checkmark-circle" size={12} color={colors.success} />
								<Text style={[styles.statusText, { color: colors.success }]}>
									{t('owner.barbers.linked')}
								</Text>
							</View>
						) : (
							<View style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}>
								<Ionicons name="time-outline" size={12} color={colors.warning} />
								<Text style={[styles.statusText, { color: colors.warning }]}>
									{t('owner.barbers.pending')}
								</Text>
							</View>
						)}
					</View>
					{item.email && (
						<Text style={[styles.barberEmail, { color: colors.textMuted }]}>
							{item.email}
						</Text>
					)}
					{item.specialties.length > 0 && (
						<Text style={[styles.barberSpecialties, { color: colors.textSecondary }]}>
							{item.specialties.join(' • ')}
						</Text>
					)}
				</View>
				<View style={styles.barberActions}>
					{item.isLinked && (
						<Pressable
							style={styles.iconButton}
							onPress={() => handleUnlink(item)}
						>
							<Ionicons name="unlink-outline" size={18} color={colors.warning} />
						</Pressable>
					)}
					<Pressable
						style={styles.iconButton}
						onPress={() => openEditModal(item)}
					>
						<Ionicons name="pencil" size={18} color={colors.textPrimary} />
					</Pressable>
					<Pressable
						style={styles.iconButton}
						onPress={() => handleDelete(item)}
					>
						<Ionicons name="trash-outline" size={18} color={colors.error} />
					</Pressable>
				</View>
			</View>
		</Card>
	)

	if (isLoading && barbers.length === 0) {
		return <LoadingScreen message={t('common.loading')} />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
					{t('owner.barbers.title')}
				</Text>
				<Pressable onPress={openAddModal} style={styles.addButton}>
					<Ionicons name="add" size={24} color={colors.textPrimary} />
				</Pressable>
			</View>

			<FlatList
				data={barbers}
				renderItem={renderBarber}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceVariant }]}>
							<Ionicons
								name="people-outline"
								size={40}
								color={colors.textMuted}
							/>
						</View>
						<Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
							{t('owner.barbers.noBarbers')}
						</Text>
						<Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
							{t('owner.barbers.addFirstBarber')}
						</Text>
						<Button onPress={openAddModal} style={styles.emptyButton}>
							{t('owner.barbers.addBarber')}
						</Button>
					</View>
				}
			/>

			{/* Add/Edit Modal */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setModalVisible(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={[styles.modalContainer, { backgroundColor: colors.background }]}
				>
					<SafeAreaView style={styles.modalContent}>
						<View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
							<Pressable onPress={() => setModalVisible(false)}>
								<Text style={[styles.cancelText, { color: colors.textPrimary }]}>
									{t('common.cancel')}
								</Text>
							</Pressable>
							<Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
								{editingBarber ? t('owner.barbers.editBarber') : t('owner.barbers.addBarber')}
							</Text>
							<View style={{ width: 50 }} />
						</View>

						<View style={styles.form}>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, value } }) => (
									<Input
										label={t('owner.barbers.barberName')}
										value={value}
										onChangeText={onChange}
										placeholder={t('owner.barbers.namePlaceholder')}
										error={errors.name?.message ?? ''}
									/>
								)}
							/>

							<Controller
								control={control}
								name="email"
								render={({ field: { onChange, value } }) => (
									<View>
										<Input
											label={t('owner.barbers.barberEmail')}
											value={value || ''}
											onChangeText={onChange}
											placeholder="correo@ejemplo.com"
											keyboardType="email-address"
											autoCapitalize="none"
											error={errors.email?.message ?? ''}
										/>
										{isSearching && (
											<View style={styles.searchingContainer}>
												<ActivityIndicator size="small" color={colors.primary} />
												<Text style={[styles.searchingText, { color: colors.textMuted }]}>
													{t('owner.barbers.searchingUser')}
												</Text>
											</View>
										)}
										{!isSearching && foundUser && !editingBarber && (
											<View style={[styles.userFoundContainer, { backgroundColor: colors.success + '15' }]}>
												<Ionicons name="checkmark-circle" size={18} color={colors.success} />
												<Text style={[styles.userFoundText, { color: colors.success }]}>
													{t('owner.barbers.userFound', { name: foundUser.name })}
												</Text>
											</View>
										)}
										{!isSearching && !foundUser && searchedEmail && !editingBarber && (
											<View style={[styles.userNotFoundContainer, { backgroundColor: colors.surfaceVariant }]}>
												<Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
												<Text style={[styles.userNotFoundText, { color: colors.textMuted }]}>
													{t('owner.barbers.userNotFound')}
												</Text>
											</View>
										)}
									</View>
								)}
							/>

							<Controller
								control={control}
								name="specialties"
								render={({ field: { onChange, value } }) => (
									<Input
										label={t('owner.barbers.specialties')}
										value={value || ''}
										onChangeText={onChange}
										placeholder={t('owner.barbers.specialtiesPlaceholder')}
									/>
								)}
							/>

							<Text style={[styles.hint, { color: colors.textMuted }]}>
								{t('owner.barbers.specialtiesHint')}
							</Text>

							<Button
								onPress={handleSubmit(onSubmit)}
								loading={isSubmitting}
								style={styles.submitButton}
							>
								{editingBarber ? t('common.save') : t('owner.barbers.addBarber')}
							</Button>
						</View>
					</SafeAreaView>
				</KeyboardAvoidingView>
			</Modal>
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
		fontSize: 18,
		fontWeight: '600',
	},
	addButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listContent: {
		padding: spacing.xl,
		paddingBottom: spacing.xxl,
	},
	barberCard: {
		marginBottom: spacing.md,
	},
	barberContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	barberInfo: {
		flex: 1,
	},
	barberNameRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		flexWrap: 'wrap',
	},
	barberName: {
		fontSize: 16,
		fontWeight: '600',
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: borderRadius.full,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
	barberEmail: {
		fontSize: 12,
		marginTop: 2,
	},
	barberSpecialties: {
		fontSize: 13,
		marginTop: spacing.xs,
	},
	barberActions: {
		flexDirection: 'row',
		gap: spacing.sm,
	},
	iconButton: {
		padding: spacing.xs,
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
		textAlign: 'center',
		paddingHorizontal: spacing.xl,
	},
	emptyButton: {
		marginTop: spacing.xl,
	},
	modalContainer: {
		flex: 1,
	},
	modalContent: {
		flex: 1,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
	},
	cancelText: {
		fontSize: 16,
		fontWeight: '500',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	form: {
		padding: spacing.xl,
	},
	hint: {
		fontSize: 12,
		marginTop: -spacing.sm,
		marginBottom: spacing.md,
		fontWeight: '500',
	},
	submitButton: {
		marginTop: spacing.lg,
	},
	searchingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginTop: spacing.xs,
		marginBottom: spacing.sm,
	},
	searchingText: {
		fontSize: 13,
	},
	userFoundContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		padding: spacing.sm,
		borderRadius: borderRadius.md,
		marginTop: spacing.xs,
		marginBottom: spacing.sm,
	},
	userFoundText: {
		fontSize: 13,
		fontWeight: '500',
		flex: 1,
	},
	userNotFoundContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		padding: spacing.sm,
		borderRadius: borderRadius.md,
		marginTop: spacing.xs,
		marginBottom: spacing.sm,
	},
	userNotFoundText: {
		fontSize: 13,
		flex: 1,
	},
})
