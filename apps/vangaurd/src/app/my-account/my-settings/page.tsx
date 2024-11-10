'use client';

import { AiSubstitutionSettingsSection, MeteorCallout, NotificationSettingsSection, PageTitleDisplay, PageWrapper, PaymentMethodsComponent, ProfileSection, SectionList, User, useGetCurrentColorfullUser } from 'ui';

export default function Page() {
	const { data: user } = useGetCurrentColorfullUser();

	return (
		<>
			<PageTitleDisplay
				overrideTitle='Home'
				additionalText='Settings'
			/>
			<PageWrapper className='bg-white mx-8 items-center justify-center'>
				<SectionList className='flex flex-col lg:grid grid-cols-2 lg:gap-12 w-full'>
					<span>
						<ProfileSection user={user ?? ({} as User)} />
					</span>
					<div className='w-full'>
						<PaymentMethodsComponent user={user ?? ({} as User)} />
						<span>
							<div className='flex flex-col lg:flex-row justify-center items-center my-8 lg:my-0 w-full h-fit'>
								<MeteorCallout
									glowIntensity='high'
									iconVariant={'secondary'}
									labelText={'AI Substitution System (Alpha)'}
									paragraphText={'Allows Colorfull to automatically substitute meals in the event of a cancellation.'}
									meteorsCount={25}

								/>
								<div className='ml-4 w-full'>
									<AiSubstitutionSettingsSection user={user ?? ({} as User)} />
								</div>
							</div>
							<NotificationSettingsSection user={user ?? ({} as User)} />
						</span>
					</div>


				</SectionList>
			</PageWrapper>
		</>
	);
}
