'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import {
	ActionedInput,
	AreaSelectV2,
	Budget,
	BudgetDisplay,
	Button,
	Checkbox,
	ConfirmationDialog,
	DeliveryWindow,
	DeliveryWindowSelect,
	DistributionListType,
	DomainWhitelistInput,
	ImageHolder,
	Input,
	InvoicingPeriod,
	InvoicingPeriodDisplay,
	Label,
	Org,
	OrgCourierManager,
	OrgGroupSelect,
	OrgLocationComponent,
	OrgNotificationSettingsSection,
	OrgType,
	PrioritizedCourier,
	RestaurantOrderLimit,
	Separator,
	TaxEditor,
	TitleComponent,
	defaultOrg,
	useDeleteOrg,
	useGetDeliveryWindowById,
	useGetOrg,
	useToast,
	useUpdateOrg
} from 'ui';
import { ClerkAccountLabel } from '../../components/clerk-account-label';
import { OrgTypeSelector } from '../../components/org-type-selector';
import { StripeAccountLabel } from '../../components/stripe-account-label';
import { StripeOnboardingSection } from '../../components/stripe-onboarding-section';

const OrgEditor: React.FC = () => {
	const router = useRouter();
	const { toast } = useToast();
	const params = useParams();
	const orgId = (params.orgId || params.id) as string;
	const { data: orgData } = useGetOrg(orgId);

	const [org, setOrg] = useState<Org>(orgData ?? defaultOrg);

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [selectedAreaId, setSelectedAreaId] = useState<string>();
	const [selectedWindowId, setSelectedWindowId] = useState<string>();
	const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow>();

	// Function to initialize distribution list with all keys and existing data
	const getInitialDistributionList = (): Record<DistributionListType, string[]> => {
		const initialList: Partial<Record<DistributionListType, string[]>> = {};
		Object.values(DistributionListType).forEach(type => {
			initialList[type] = org?.distribution_list?.[type] || [];
		});
		return initialList as Record<DistributionListType, string[]>;
	};

	// State to hold distribution list data
	const [distributionList, setDistributionList] = useState<Record<DistributionListType, string[]>>(getInitialDistributionList);

	// Handler to update distribution list
	const handleDistributionListChange = (type: DistributionListType, value: string[]) => {
		setDistributionList(prev => ({ ...prev, [type]: value }));
	};

	const { data: originalOrgWindow } = useGetDeliveryWindowById(selectedWindowId ?? '');

	const queryClient = useQueryClient();

	useEffect(() => {
		if (orgData) {
			setOrg(orgData);
		}
	}, [orgData]);

	useEffect(() => {
		if (org) {
			setDistributionList(getInitialDistributionList());
		}
	}, [org]);


	useEffect(() => {
		if (org.delivery_window_id) {
			setSelectedWindowId(org.delivery_window_id);
		}
	}, [org]);

	useEffect(() => {
		if (selectedWindow && selectedWindow.id) {
			setSelectedWindowId(selectedWindow.id);
			setOrg((prevOrg) => ({ ...prevOrg, delivery_window_id: selectedWindow.id }));
		}
	}, [selectedWindow]);

	const updateOrgMutation = useUpdateOrg({
		onSuccess: () => {
			toast({
				title: 'Org updated',
				description: 'Org updated successfully',
				duration: 3000,
			});
			queryClient.invalidateQueries(['org', orgId]);
		},
	});

	const handleOrderLimitChange = (newLimit: number) => {
		setOrg((prevOrg) => ({ ...prevOrg, order_limit: newLimit }));
	};

	// Submit handler
	const handleSubmitDistributionList = () => {
		updateOrgMutation.mutate({
			...org,
			distribution_list: distributionList
		});
	};

	const handleSubmit = () => {
		if (org && org.id) {
			updateOrgMutation.mutate(org);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		if (name === 'colorfull_percentage') {
			setOrg((prevOrg) => ({
				...prevOrg,
				deal: {
					...prevOrg.deal,
					colorfull_percentage: parseFloat(value)
				}
			}));
		}
		else if (name === 'service_percentage') {
			setOrg((prevOrg) => ({
				...prevOrg,
				deal: {
					...prevOrg.deal,
					service_percentage: parseFloat(value)
				}
			}));
		}
		else {
			setOrg((prevOrg) => ({ ...prevOrg, [name]: value }));
		}
	};

	const handleAreaChange = (areaId: string) => {
		setSelectedAreaId(areaId);
	};

	const deleteOrgMutation = useDeleteOrg({
		onSuccess: () => {
			toast({
				title: 'Org deleted',
				description: 'Org deleted successfully',
				duration: 3000,
			});
			setIsDialogOpen(false);
			router.push('/orgs');
		},
		onError: (error) => {
			console.error('Error deleting org:', error);
			// handle error, e.g., show toast notification
			toast({
				title: 'Error deleting org',
				description: 'Error deleting org',
				duration: 3000,
			});
		},
	});

	const handleChangeOrgActiveStatus = () => {
		if (!org) {
			toast({
				title: 'Error',
				description: 'No org selected to update active status.',
				duration: 3000,
			});
			return;
		}
		const updatedOrg = { ...org, is_active: !org.is_active };
		updateOrgMutation.mutate(updatedOrg);
	}

	const handleChangeOrgInvoicingPeriod = (invoicingPeriod: InvoicingPeriod) => {
		if (!org) {
			toast({
				title: 'Error',
				description: 'No org selected to update invoicing period.',
				duration: 3000,
			});
			return;
		}
		const updatedOrg = { ...org, invoicing_period: invoicingPeriod };
		updateOrgMutation.mutate(updatedOrg);
	}

	const handleChangeOrgPreferredCouriers = (couriers: PrioritizedCourier[]) => {
		if (!org) {
			toast({
				title: 'Error',
				description: 'No org selected to update preferred couriers.',
				duration: 3000,
			});
			return;
		}
		const updatedOrg = { ...org, preferred_courier_ids: couriers };
		updateOrgMutation.mutate(updatedOrg);
	}

	const handleConfirmDelete = () => {
		deleteOrgMutation.mutate(org.id ?? '');
	};

	const isOrgRestaurant = org?.org_type === OrgType.RESTAURANT;

	return (
		<div className='p-4 flex flex-col gap-y-4'>

			<Button
				disabled={org?.org_type !== OrgType.RESTAURANT}
				onClick={() => {
					router.push(`${orgId}/stores`);
				}}
			>
				Go to stores
			</Button>
			<Button
				onClick={() => {
					router.push(`${orgId}/orders`);
				}}
			>
				{`Go to org's Orders`}
			</Button>

			<div className='flex items-center border-2 border-black rounded-lg gap-2'>
				<h2 className='text-2xl  font-righteous p-2'>Org Editor</h2>
				<Button className='' onClick={handleSubmit}>
					Save
				</Button>
				<Button
					onClick={() => setIsDialogOpen(true)}
					className=' bg-red-500 text-white '
				>
					Delete Org
				</Button>
			</div>

			<div className='grid grid-cols-2 gap-4 bg-primary-almost-black-light p-5 rounded-xl '>
				<div className='flex flex-col mb-2'>
					<ActionedInput label={'Name'}
						value={org?.name ?? ''}
						id={'name'}
						name='name'
						disabled={false}
						onChange={handleInputChange}
					/>
				</div>

				<div className='flex flex-col mb-2'>
					<ActionedInput label={'ID'} value={org?.id ?? ''} id={'id'} disabled={true} />
				</div>

				<div className='flex flex-col mb-2'>
					<StripeAccountLabel org={org}
						onChange={handleInputChange}
						type='text' />
				</div>
				<div className='flex flex-col mb-2'>
					<ClerkAccountLabel org={org} onChange={handleInputChange} />
				</div>
				<div className='flex flex-col mb-2 space-y-2'>
					<Label className='font-righteous'>Org Group:</Label>
					<OrgGroupSelect
						initialOrgGroupId={org.org_group_id}
						onChange={(orgGroup) => {
							setOrg((prevOrg) => ({ ...prevOrg, org_group_id: orgGroup.id }));
							updateOrgMutation.mutate({
								...org,
								org_group_id: orgGroup.id,
							});
						}} />
				</div>
				{isOrgRestaurant && (
					<StripeOnboardingSection org={org} />
				)}
				{isOrgRestaurant && (
					<RestaurantOrderLimit org={org} onOrderLimitChange={handleOrderLimitChange} />
				)}
				<OrgTypeSelector org={org} handleInputChange={handleInputChange} />



				<div className='flex justify-start items-center gap-2 border-2 border-black p-2 rounded-lg'>
					<div className='font-righteous'>Active Status:</div>
					<Button
						className={`py-2 px-4 font-righteous text-white text-center rounded-lg w-fit ${(org && org.is_active) ? 'bg-primary-spinach-green' : 'bg-red-500'}`}
						onClick={() => handleChangeOrgActiveStatus()}
					>
						{(org && org.is_active) ? 'Active' : 'Inactive'}
					</Button>
				</div>


				{!isOrgRestaurant && (
					<BudgetDisplay
						budget={org?.budget ?? ({} as Budget)}
						budgetSchedule={org?.budget_schedule}
						isWithStepheader={false}
					/>
				)}
				{!isOrgRestaurant && (
					<InvoicingPeriodDisplay
						org={org}
						onChange={handleChangeOrgInvoicingPeriod}
					/>
				)}
				<div>
					<h2 className='font-righteous'>Distribution List</h2>
					<div className='italic flex flex-col justify-start items-start gap-1'>
						<span>
							*Please separate multiple email addresses with commas
						</span>
						<span>
							Example: johnsmith@gmail.com, janedoe@gmail.com
						</span>
					</div>
					{Object.values(DistributionListType).map((type) => (
						<div key={type} className='flex justify-start items-center gap-2 my-1'>
							<label>{type}</label>
							<input
								type="text"
								value={distributionList[type]?.join(', ') || ''}
								onChange={(e) => handleDistributionListChange(type, e.target.value.split(',').map(item => item.trim()))}
								className='border-2 border-black rounded-lg px-2 py-1 w-full'
							/>
						</div>
					))}
					<Button onClick={handleSubmitDistributionList}>Save Distribution List</Button>
				</div>
				{!isOrgRestaurant && (
					<OrgCourierManager
						initialCouriers={org?.preferred_courier_ids ?? []}
						onSave={handleChangeOrgPreferredCouriers}
					/>
				)}
				<div>
					<AreaSelectV2
						selectedAreaId={selectedAreaId}
						onChange={(areaId) => handleAreaChange(areaId)}
						selectTriggerTextOverride='Select Area For Delivery Windows'
					/>

					{selectedAreaId ? (
						<DeliveryWindowSelect
							area_id={selectedAreaId}
							onWindowSelect={setSelectedWindow}
						/>
					) : (
						<div className='text-red-500'>Please select an area to view delivery windows</div>
					)}
					<div className='flex flex-col justify-start items-start gap-2'>
						<span>
							selectedWindow ID: {originalOrgWindow ? originalOrgWindow.id : selectedWindow?.id ?? 'Please select an area to view delivery window information'}
						</span>
						<span>
							delivery_time: {originalOrgWindow ? originalOrgWindow.delivery_time : selectedWindow?.delivery_time ?? 'Please select an area to view delivery window information'}
						</span>
					</div>
				</div>
				{!isOrgRestaurant && (
					<OrgNotificationSettingsSection
						org={org}
						isBastionView={true}
					/>
				)}
				<TitleComponent className='p-4 space-y-2 flex-col' leftTitle='Deal'>
					<TaxEditor org={org} />

					<div className='flex justify-between items-center mt-2'>
						<Label className='font-righteous'>Colorfull Percentage:</Label>
						<Input
							type="number"
							min="0"
							max="1"
							step="0.01"
							value={org?.deal?.colorfull_percentage?.toFixed(2) ?? ''}
							id={'colorfull_percentage'}
							onChange={handleInputChange}
							name='colorfull_percentage'
						/>
					</div>
					<div className='flex justify-between items-center mt-2'>
						<Label className='font-righteous'>Colorfull Delivery Fee Service Percentage:</Label>
						<Input
							type="number"
							min="0"
							max="1"
							step="0.01"
							value={org?.deal?.service_percentage?.toFixed(2) ?? ''}
							id={'service_percentage'}
							onChange={handleInputChange}
							name='service_percentage'
						/>
					</div>
					<div className='mt-2'>
						<span className='font-righteous'>Is Deal Grandfathered:</span>
						<Checkbox checked={org?.deal?.is_grandfathered ?? false} onClick={() => {
							setOrg((prevOrg) => ({
								...prevOrg,
								deal: {
									...prevOrg.deal,
									is_grandfathered: !prevOrg.deal?.is_grandfathered
								}
							}));

						}} />
					</div>
				</TitleComponent>
				<ActionedInput label={'Description'} value={org?.description ?? ''} id={'description'} onChange={handleInputChange} name='description' />

				<div className='flex items-center border-2 border-black rounded-lg p-4 space-x-4'>


					<ImageHolder imageUrl={org?.brand_image_url ?? ' '} onImageUrlChange={(url) => {
						setOrg((prevOrg) => ({ ...prevOrg, brand_image_url: url }));
						updateOrgMutation.mutate({
							...org,
							brand_image_url: url,

						});

					}} />

				</div>
				<div className='border-2 border-black rounded-lg p-4'>
					<h1 className='text-2xl'>Whitelisting</h1>
					<Separator className='my-2 bg-black' />
					<DomainWhitelistInput
						inBastion={true}
					/>
				</div>
			</div>

			<TitleComponent className='p-4 space-y-2 flex-col' leftTitle='Text Art'>
				<div className='flex flex-col mb-2'>
					<Label className='font-righteous p-2'>Text Art:</Label>
					<textarea
						className="form-textarea mt-1 block w-3/4 p-2 rounded-lg border border-gray-300 text-white bg-black"
						rows={10}
						style={{ fontFamily: 'monospace' }}
						value={org?.text_art ?? ''}
						onChange={(event) => {
							const newTextArt = event.target.value;
							setOrg((prevOrg) => ({ ...prevOrg, text_art: newTextArt }));
						}}
						placeholder="Insert text-based art here"
					/>
				</div>
			</TitleComponent>

			<OrgLocationComponent org={org} />

			<ConfirmationDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
};

export default OrgEditor;
