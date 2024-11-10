'use client';

import { FC } from 'react';
import { UserForm, useGetOrgGroupById } from '..';
import { useGetOrg } from '../hooks/orgHooks';
import { useUpdateUser } from '../hooks/userHooks';
import { User } from '../models/userModels';
import { Section } from './section';
import { useToast } from './ui/use-toast';

interface ProfileSectionProps {
	user: User;
}

export const ProfileSection: FC<ProfileSectionProps> = ({
	user,
}: ProfileSectionProps) => {
	// Declare state variables
	const { data: org } = useGetOrg(user?.org_id ?? '');
	const { data: orgGroup } = useGetOrgGroupById(org?.org_group_id ?? '');


	const { toast } = useToast();
	const updateUserMutation = useUpdateUser({
		onSuccess: () => {
			toast({
				title: 'User updated',
				description: 'User updated successfully',
				duration: 3000,
			});
		},
		onError: (error) => {
			toast({
				title: 'Error updating user',
				description: `Error: ${error.message}`,
				duration: 3000,
			});
		},
	});


	// Update user mutation
	const handleSave = async (user: User) => {
		updateUserMutation.mutate({ userId: user?.id ?? '', user });
	};

	return (
		<Section expanded={true} hideChevron={true} className='bg-primary-light-cyan-blue'>
			<UserForm
				initialData={user}
				onSubmit={handleSave}
				orgGroup={orgGroup}
				isInVangaurd={true}
			/>
		</Section>
	);
};
