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
import { useAuth, useBusiness } from '../../../src/hooks'
import { Card, Button, Input, LoadingScreen } from '../../../src/components/ui'
import { colors, spacing, borderRadius } from '../../../src/constants/theme'
import { Service } from '../../../src/types'

const serviceSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	description: z.string().optional(),
	duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: 'Duration must be a positive number',
	}),
	price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
		message: 'Price must be a valid number',
	}),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function ServicesScreen() {
	const { user } = useAuth()
	const {
		currentBusiness,
		services,
		isLoading,
		loadOwnerBusiness,
		loadServices,
		addService,
		updateService,
		removeService,
	} = useBusiness()

	const [modalVisible, setModalVisible] = useState(false)
	const [editingService, setEditingService] = useState<Service | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ServiceFormData>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: '',
			description: '',
			duration: '30',
			price: '25',
		},
	})

	useEffect(() => {
		if (user?.id) {
			loadOwnerBusiness(user.id)
		}
	}, [user?.id])

	useEffect(() => {
		if (currentBusiness?.id) {
			loadServices(currentBusiness.id)
		}
	}, [currentBusiness?.id])

	const openAddModal = () => {
		setEditingService(null)
		reset({
			name: '',
			description: '',
			duration: '30',
			price: '25',
		})
		setModalVisible(true)
	}

	const openEditModal = (service: Service) => {
		setEditingService(service)
		reset({
			name: service.name,
			description: service.description || '',
			duration: String(service.duration),
			price: String(service.price),
		})
		setModalVisible(true)
	}

	const handleDelete = (service: Service) => {
		Alert.alert(
			'Delete Service',
			`Are you sure you want to delete "${service.name}"?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						if (currentBusiness?.id) {
							await removeService(currentBusiness.id, service.id)
						}
					},
				},
			]
		)
	}

	const onSubmit = async (data: ServiceFormData) => {
		if (!currentBusiness?.id) return

		setIsSubmitting(true)
		try {
			const serviceData = {
				name: data.name,
				description: data.description,
				duration: Number(data.duration),
				price: Number(data.price),
			}

			if (editingService) {
				await updateService(currentBusiness.id, editingService.id, serviceData)
			} else {
				await addService(currentBusiness.id, serviceData)
			}

			setModalVisible(false)
			reset()
		} catch (error) {
			Alert.alert('Error', 'Failed to save service')
		} finally {
			setIsSubmitting(false)
		}
	}

	const renderService = ({ item }: { item: Service }) => (
		<Card style={styles.serviceCard}>
			<View style={styles.serviceContent}>
				<View style={styles.serviceInfo}>
					<Text style={styles.serviceName}>{item.name}</Text>
					{item.description && (
						<Text style={styles.serviceDescription}>{item.description}</Text>
					)}
					<View style={styles.serviceMeta}>
						<View style={styles.metaItem}>
							<Ionicons
								name="time-outline"
								size={14}
								color={colors.textSecondary}
							/>
							<Text style={styles.metaText}>{item.duration} min</Text>
						</View>
					</View>
				</View>
				<View style={styles.serviceRight}>
					<Text style={styles.servicePrice}>${item.price}</Text>
					<View style={styles.serviceActions}>
						<Pressable
							style={styles.iconButton}
							onPress={() => openEditModal(item)}
						>
							<Ionicons name="pencil" size={18} color={colors.accent} />
						</Pressable>
						<Pressable
							style={styles.iconButton}
							onPress={() => handleDelete(item)}
						>
							<Ionicons name="trash-outline" size={18} color={colors.error} />
						</Pressable>
					</View>
				</View>
			</View>
		</Card>
	)

	if (isLoading && services.length === 0) {
		return <LoadingScreen message="Loading services..." />
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
				</Pressable>
				<Text style={styles.headerTitle}>Services</Text>
				<Pressable onPress={openAddModal} style={styles.addButton}>
					<Ionicons name="add" size={24} color={colors.accent} />
				</Pressable>
			</View>

			<FlatList
				data={services}
				renderItem={renderService}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Ionicons
							name="cut-outline"
							size={64}
							color={colors.textMuted}
						/>
						<Text style={styles.emptyTitle}>No services yet</Text>
						<Text style={styles.emptySubtitle}>
							Add your first service to start accepting bookings
						</Text>
						<Button onPress={openAddModal} style={styles.emptyButton}>
							Add Service
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
					style={styles.modalContainer}
				>
					<SafeAreaView style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Pressable onPress={() => setModalVisible(false)}>
								<Text style={styles.cancelText}>Cancel</Text>
							</Pressable>
							<Text style={styles.modalTitle}>
								{editingService ? 'Edit Service' : 'Add Service'}
							</Text>
							<View style={{ width: 50 }} />
						</View>

						<View style={styles.form}>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, value } }) => (
									<Input
										label="Service Name"
										value={value}
										onChangeText={onChange}
										placeholder="e.g., Classic Haircut"
										error={errors.name?.message ?? ''}
									/>
								)}
							/>

							<Controller
								control={control}
								name="description"
								render={({ field: { onChange, value } }) => (
									<Input
										label="Description (optional)"
										value={value || ''}
										onChangeText={onChange}
										placeholder="Brief description of the service"
										multiline
										numberOfLines={2}
									/>
								)}
							/>

							<View style={styles.row}>
								<View style={styles.halfInput}>
									<Controller
										control={control}
										name="duration"
										render={({ field: { onChange, value } }) => (
											<Input
												label="Duration (min)"
												value={value}
												onChangeText={onChange}
												placeholder="30"
												keyboardType="numeric"
												error={errors.duration?.message ?? ''}
											/>
										)}
									/>
								</View>
								<View style={styles.halfInput}>
									<Controller
										control={control}
										name="price"
										render={({ field: { onChange, value } }) => (
											<Input
												label="Price ($)"
												value={value}
												onChangeText={onChange}
												placeholder="25"
												keyboardType="numeric"
												error={errors.price?.message ?? ''}
											/>
										)}
									/>
								</View>
							</View>

							<Button
								onPress={handleSubmit(onSubmit)}
								loading={isSubmitting}
								style={styles.submitButton}
							>
								{editingService ? 'Save Changes' : 'Add Service'}
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
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
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
	serviceCard: {
		marginBottom: spacing.md,
	},
	serviceContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	serviceRight: {
		alignItems: 'flex-end',
	},
	servicePrice: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.accent,
	},
	serviceActions: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.sm,
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
		textAlign: 'center',
		paddingHorizontal: spacing.xl,
	},
	emptyButton: {
		marginTop: spacing.xl,
	},
	modalContainer: {
		flex: 1,
		backgroundColor: colors.background,
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
		borderBottomColor: colors.border,
	},
	cancelText: {
		fontSize: 16,
		color: colors.accent,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	form: {
		padding: spacing.xl,
	},
	row: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	halfInput: {
		flex: 1,
	},
	submitButton: {
		marginTop: spacing.lg,
	},
})

