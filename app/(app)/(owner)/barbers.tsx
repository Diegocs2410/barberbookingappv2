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
} from 'react-native'
import { Text } from 'react-native-paper'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth, useBusiness, useThemeColors } from '../../../src/hooks'
import { Card, Button, Input, Avatar, LoadingScreen } from '../../../src/components/ui'
import { spacing, borderRadius } from '../../../src/constants/theme'
import { Barber } from '../../../src/types'

const barberSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	specialties: z.string().optional(),
})

type BarberFormData = z.infer<typeof barberSchema>

export default function BarbersScreen() {
	const { user } = useAuth()
	const { colors } = useThemeColors()
	const {
		currentBusiness,
		barbers,
		isLoading,
		loadOwnerBusiness,
		loadBarbers,
		addBarber,
		updateBarber,
		removeBarber,
	} = useBusiness()

	const [modalVisible, setModalVisible] = useState(false)
	const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BarberFormData>({
		resolver: zodResolver(barberSchema),
		defaultValues: {
			name: '',
			specialties: '',
		},
	})

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

	const openAddModal = () => {
		setEditingBarber(null)
		reset({
			name: '',
			specialties: '',
		})
		setModalVisible(true)
	}

	const openEditModal = (barber: Barber) => {
		setEditingBarber(barber)
		reset({
			name: barber.name,
			specialties: barber.specialties.join(', '),
		})
		setModalVisible(true)
	}

	const handleDelete = (barber: Barber) => {
		Alert.alert(
			'Remove Barber',
			`Are you sure you want to remove "${barber.name}"?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
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
					specialties,
				})
			} else {
				await addBarber(currentBusiness.id, {
					userId: '', // Will be linked later
					name: data.name,
					specialties,
				})
			}

			setModalVisible(false)
			reset()
		} catch (error) {
			Alert.alert('Error', 'Failed to save barber')
		} finally {
			setIsSubmitting(false)
		}
	}

	const renderBarber = ({ item }: { item: Barber }) => (
		<Card style={styles.barberCard}>
			<View style={styles.barberContent}>
				<Avatar source={item.photoUrl} name={item.name} size="medium" />
				<View style={styles.barberInfo}>
					<Text style={[styles.barberName, { color: colors.textPrimary }]}>{item.name}</Text>
					{item.specialties.length > 0 && (
						<Text style={[styles.barberSpecialties, { color: colors.textSecondary }]}>
							{item.specialties.join(' • ')}
						</Text>
					)}
				</View>
				<View style={styles.barberActions}>
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
		return <LoadingScreen message="Loading barbers..." />
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Barbers</Text>
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
						<Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No barbers yet</Text>
						<Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
							Add barbers to your team to start accepting bookings
						</Text>
						<Button onPress={openAddModal} style={styles.emptyButton}>
							Add Barber
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
								<Text style={[styles.cancelText, { color: colors.textPrimary }]}>Cancel</Text>
							</Pressable>
							<Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
								{editingBarber ? 'Edit Barber' : 'Add Barber'}
							</Text>
							<View style={{ width: 50 }} />
						</View>

						<View style={styles.form}>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, value } }) => (
									<Input
										label="Barber Name"
										value={value}
										onChangeText={onChange}
										placeholder="Full name"
										error={errors.name?.message ?? ''}
									/>
								)}
							/>

							<Controller
								control={control}
								name="specialties"
								render={({ field: { onChange, value } }) => (
									<Input
										label="Specialties (optional)"
										value={value || ''}
										onChangeText={onChange}
										placeholder="e.g., Fades, Beard Trims, Hot Towel Shaves"
									/>
								)}
							/>

							<Text style={[styles.hint, { color: colors.textMuted }]}>
								Separate specialties with commas
							</Text>

							<Button
								onPress={handleSubmit(onSubmit)}
								loading={isSubmitting}
								style={styles.submitButton}
							>
								{editingBarber ? 'Save Changes' : 'Add Barber'}
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
	barberName: {
		fontSize: 16,
		fontWeight: '600',
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
})
