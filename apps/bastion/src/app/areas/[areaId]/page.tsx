'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
	Button,
	CodeBlock,
	GoogleAddressInput,
	Org,
	OrgSelect,
	PageTitleDisplay,
	Section,
	toast,
	useGetArea,
	useUpdateArea
} from 'ui';
import { OrgScheduleCard } from './org-schedule-card';
import { AreaSchedulerComponent } from './scheduler-status';
import { TimeInputs } from './time-inputs';


export default function AreaPage() {
	const params = useParams();
	const areaId = params.areaId as string;
	const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
	const { data: area } = useGetArea(areaId);
	const { mutate: updateArea } = useUpdateArea({
		onSuccess: () => {
			toast({
				title: 'Area Updated',
				description: 'The area has been successfully updated.',
				duration: 3000,
			});
		},
		onError: (error) => {
			console.error('Error updating area:', error);
			toast({
				title: 'Error',
				description: 'Failed to update the area.',
				duration: 3000,
			});
		},
	});



	const handleOrgChange = (org: Org) => {
		setSelectedOrg(org);
	};

	/**
	 * Adding an org to the schedule is the beginning of that orgs storeSchedule record.
	 * We add the store ids to the storeSchedule keys and the days of the week to the storeSchedule values
	 * 
	 * Saying that the store is available on those days for this org.
	 */
	const handleAddToSchedule = () => {
		if (area?.schedule?.organizations.some(org => org.orgId === selectedOrg?.id)) {
			alert('This organization is already added.');
			return;
		}

		area?.schedule?.organizations.push({
			orgId: selectedOrg?.id ?? '',
			store_schedule: {
				schedules: {},
				brand_schedules: {},
			},
		});

		updateArea({
			areaId: area?.id ?? '', area: {
				...area,
				schedule: {
					...area?.schedule,
					organizations: [...(area?.schedule?.organizations ?? [])],
				},
			}
		});
	}

	const handleUpdateKitchenAddress = (newAddress: string) => {
		updateArea({
			areaId: area?.id ?? '', area: {
				...area,
				kitchen_address: newAddress,
			}
		});
	}
	// set new coordinates
	return (
		<div className='rounded-lg space-y-6 mt-12 border-2 border-black m-2 p-2'>
		  <PageTitleDisplay overrideTitle='Area Schedule Setter' additionalText={area?.name} />
		  <div>kitchen address: </div><CodeBlock>{area?.kitchen_address ?? 'N/A'}</CodeBlock>
		  <div className='mb-4'>
				<GoogleAddressInput
					address={area?.kitchen_address ?? ''}
					className='mb-2'
					onChange={(details) => {
						handleUpdateKitchenAddress(details.address)
					}}
				/>
			</div>
	  
		  <div className='flex'>
			<Section title={`Scheduler - ${area?.name}`} className='w-1/2'>
			  <AreaSchedulerComponent area={area ?? {}} />
			</Section>
	  
			<Section title={`Area Times - ${area?.name}`} className='w-1/2'>
			  <TimeInputs area={area ?? {}} />
			</Section>
		  </div>
	  
		  <Section expanded={true} title={`Schedule - ${area?.name}`}>
			<div className='grid grid-cols-2 gap-4 mt-2'>
			  <div>
				<OrgSelect onChange={handleOrgChange} />
				<Button className='mt-2' onClick={handleAddToSchedule}>Add to Schedule</Button>
			  </div>
			  <div className='border-black border-2 shadow-2xl rounded-lg'>
				{area?.schedule?.organizations?.map((orgSchedule) => (
				  <OrgScheduleCard
					key={orgSchedule.orgId}
					orgSchedule={orgSchedule}
					area={area}
				  />
				))}
			  </div>
			</div>
		  </Section>
		</div>
	  );
}