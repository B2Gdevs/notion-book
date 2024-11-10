'use client';
import { useParams } from 'next/navigation';
import {
	Button,
	Org,
	OrgLocationComponent,
	OrgType,
	PaymentMethodsComponent,
	RestaurantOrderLimit,
	SectionList,
	toast,
	useGetOrgsByQuery,
	useUpdateOrg
} from 'ui';
import { OtterIntegrationSection } from '../../../components/integrations-section';
import { PageTitleDisplay } from 'ui';
import { PageWrapper } from 'ui';
import { BrandsAndStoresSection } from './brands-stores-section';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

export default function Page() {
	const params = useParams();
	const queryClient = useQueryClient();
	const orgClerkId = (params.orgId || params.id) as string;
	const { data: orgs } = useGetOrgsByQuery({
		externalId: orgClerkId,
	});
	const org = orgs?.[0] as Org;
	const orgId = org?.id as string;
	const [stateOrg, setOrg] = useState<Org>(org);


	const handleOrderLimitChange = (newLimit: number) => {
		setOrg((prevOrg) => ({ ...prevOrg, order_limit: newLimit }));
	};
	
	useEffect(() => {
		if (org) {
			setOrg(org);
		}
	}, [org]);

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


	const handleSubmit = () => {
		if (org && org.id) {
			updateOrgMutation.mutate(stateOrg);
		}
	};

	const isOrgRestaurant = org?.org_type === OrgType.RESTAURANT;
	return (
		<>
			<PageTitleDisplay additionalText={org?.name} />

			<PageWrapper className='bg-white w-full'>

				<SectionList className='flex flex-col w-full'>
					{isOrgRestaurant && (
						<>
							<OtterIntegrationSection
								org={org}
							/>
							<BrandsAndStoresSection />
							<div className='w-full md:w-1/2 p-4 border-4 rounded-lg my-2 border-secondary-peach-orange'>
								<RestaurantOrderLimit
									org={stateOrg}
									onOrderLimitChange={handleOrderLimitChange}
									isShowingDescription={true}
								/>
								<Button className='' onClick={handleSubmit}>
									Save
								</Button>
							</div>

						</>
					)}

					{!isOrgRestaurant && (
						<>
							<OrgLocationComponent org={org} />
							<PaymentMethodsComponent org={org ?? ({} as Org)} />
						</>
					)}

				</SectionList>
			</PageWrapper>
		</>

	);
}
