import React, { useState, useEffect } from 'react';
import {
	AreaSelect,
	Button,
	DeliveryWindow,
	DeliveryWindowSelect,
	Dialog,
	DialogContent,
	Label,
	LocationList,
	OrgType,
	RadioGroup,
	RadioGroupItem,
	defaultOrg,
	getOrgTypeTagColor,
	toast,
	useCreateOrg,
} from 'ui';

interface NewOrgDialogProps {
	isDialogOpen: boolean;
	handleCloseDialog: () => void;
}

export const NewOrgDialog: React.FC<NewOrgDialogProps> = ({
	isDialogOpen,
	handleCloseDialog,
}) => {
	const [newOrg, setNewOrg] = useState({
		...defaultOrg,
		name: '',
		org_type: OrgType.RECIPIENT,
		admin_email: '',
	});
	const [emailError, setEmailError] = useState('');

	const [selectedAreaId, setSelectedAreaId] = useState<string>();
	const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow>();

	const excludedDomains = [
		"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
		"icloud.com", "aol.com", "zoho.com", "mail.com"
	];

	useEffect(() => {
		if (selectedWindow && selectedWindow.id) {
			setNewOrg((prevOrg) => ({ ...prevOrg, delivery_window_id: selectedWindow.id }));
		}
	}, [selectedWindow]);

	useEffect(() => {
		// Real-time validation of admin_email
		const emailDomain = newOrg.admin_email.split('@')[1];
		if (newOrg.org_type === OrgType.RECIPIENT && excludedDomains.includes(emailDomain)) {
			setEmailError('The provided admin email domain is not allowed.');
		} else {
			setEmailError('');
		}
	}, [newOrg.admin_email, newOrg.org_type]);

	const createColorfullOrgMutation = useCreateOrg({
		onSuccess: () => {
			handleCloseDialog();
			toast({
				title: 'Org Created',
				description: 'Your new org has been created',
				duration: 5000,
			});
		},
		onError: (error) => {
			toast({
				title: 'Error Creating Org',
				description: error.message,
				duration: 5000,
			});
		},
	});

	const handleAreaChange = (areaId: string) => {
		setSelectedAreaId(areaId);
	};

	const handleCreateOrg = async () => {
		if (emailError) {
			toast({
				title: 'Invalid Email',
				description: emailError,
				duration: 5000,
			});
			return;
		}
		
		if (!newOrg.locations || newOrg.locations.length === 0 || !newOrg.locations.some(location => location.area_id)) {
			toast({
				title: 'Invalid Location',
				description: 'Please add at least one location with an area defined.',
				duration: 5000,
			});
			return;
		}


		const org = { ...newOrg };
		createColorfullOrgMutation.mutate(org);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewOrg({ ...newOrg, [e.target.name]: e.target.value });
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
			<DialogContent
				className='overflow-y-auto'
				title='Create Org'
				style={{ maxHeight: '90vh' }}
			>
				<div className='text-2xl underline p-2'>Create Org</div>
				<div className='flex flex-col gap-y-4 p-4'>
					<Label className="flex items-center">
						Organization Name <span className="text-red-500 ml-1">*</span>
					</Label>
					<input
						type='text'
						name='name'
						value={newOrg.name}
						onChange={handleInputChange}
						placeholder='Organization Name'
						required
						className={`p-2 border rounded mb-4 ${newOrg.name ? 'border-gray-300' : 'border-red-500'}`}
						aria-required="true"
					/>

					<Label>
						Org Type -{' '}
						<span className='text-primary-spinach-green font-righteous'>
							{newOrg.org_type}
						</span>
					</Label>
					<RadioGroup
						className='flex'
						value={newOrg.org_type}
						onValueChange={(value) =>
							handleInputChange({
								target: { name: 'org_type', value: value } as any, // Casting to any to satisfy the event type
							} as React.ChangeEvent<HTMLInputElement>)
						}
					>
						<RadioGroupItem
							value={OrgType.RECIPIENT}
							className='bg-primary-spinach-green disabled:opacity-50'
						/>
						<Label className="text-primary-spinach-green font-righteous">
							Recipient
						</Label>
						<RadioGroupItem
							value={OrgType.RESTAURANT}
							className='bg-primary-spinach-green disabled:opacity-50'
						/>
						<Label className="text-primary-spinach-green font-righteous">
							Restaurant
						</Label>
						<RadioGroupItem
							value={OrgType.COURIER}
							className='bg-primary-spinach-green disabled:opacity-50'
						/>
						<Label className="text-primary-spinach-green font-righteous">
							Courier
						</Label>
						<RadioGroupItem
							value={OrgType.PARTNER}
							className='bg-primary-spinach-green disabled:opacity-50'
						/>
						<Label className="text-primary-spinach-green font-righteous">
							Partner
						</Label>
					</RadioGroup>
					<span
						className={`px-2 py-1 rounded mt-5 ${getOrgTypeTagColor(
							newOrg.org_type,
						)}`}
					>
						{newOrg.org_type}
					</span>
					{newOrg.org_type === OrgType.RECIPIENT && (
						<div>
							<AreaSelect
								selectedAreaId={selectedAreaId}
								onChange={(areaId) => handleAreaChange(areaId)}
								selectTriggerTextOverride='Select Area For Delivery Windows'
							/>
							<DeliveryWindowSelect
								area_id={selectedAreaId}
								onWindowSelect={setSelectedWindow}
							/>
						</div>
					)}
					<Label className="flex items-center">
						Admin Email <span className="text-red-500 ml-1">*</span>
					</Label>
					<input
						type='email'
						name='admin_email'
						value={newOrg.admin_email}
						onChange={handleInputChange}
						placeholder='Admin Email'
						required
						className={`p-2 border rounded mb-4 ${emailError || !newOrg.admin_email ? 'border-red-500' : 'border-gray-300'}`}
						aria-required="true"
					/>
					{emailError && <div className="text-red-500 text-sm">{emailError}</div>}
					<LocationList locations={newOrg?.locations ?? []} onLocationsChange={(locations) => {
						setNewOrg({ ...newOrg, locations });
					}} />
					<Button
						className='bg-primary-spinach-green text-primary-off-white'
						onClick={handleCreateOrg}
						disabled={!!emailError}
					>
						Create Org
					</Button>
					<Button
						className='bg-primary-almost-black/40 text-primary-off-white'
						onClick={handleCloseDialog}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};