'use client'

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button, Dialog, DialogContent, PageTitleDisplay, User, UserCsvImporter, UserForm, UserTable, toast, useCreateUser, useGetOrgGroupById, useGetOrgsByQuery } from 'ui';

const UsersPage = () => {
  const params = useParams();
  const orgClerkId = params.id as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: orgs } = useGetOrgsByQuery({page: 1, pageSize: 1, externalId: orgClerkId});
  const org = orgs?.[0];
  const { data: orgGroup } = useGetOrgGroupById(org?.org_group_id ?? '');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // This function creates user in db/cache/storage
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      toast({
        title: 'User added successfully',
        duration: 3000,
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: 'Error adding user',
        duration: 3000,
      });
    },
  });

  const handleAddUser = (newUser: User) => {
    createUserMutation.mutate({ user: newUser });
  };

  return (
    <div>
      <PageTitleDisplay additionalText={org?.name ?? ''} overrideTitle='Users' />

      <div className='flex justify-start items-center gap-2'>
        <Button
          onClick={handleOpenDialog}
          className='m-2 lg:m-4'>Add User</Button>
        <UserCsvImporter
          orgId={org?.id ?? ''}
        />
      </div>
      {/* Render UserTable only if id is available */}
      <UserTable
        noTitle={true}
        isInVangaurd={true}
        orgClerkId={orgClerkId}
        getUserPath={(user) => {
          return (`/accounts/${orgClerkId}/users/${user.id}`)
        }}
      />
      <Dialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent isSticky={true}>
          <UserForm
            className='my-4 mx-2'
            onSubmit={(newUser) => handleAddUser(newUser)}
            onCancel={handleCloseDialog}
            isInVangaurd={true}
            initialData={{
              name: '',
              email: '',
              org_id: org?.id ?? '', // Set the user's org_id to the current org's id
              work_address: org?.locations?.[0]?.address ?? '',
            }}
            orgGroup={orgGroup}
            excludeFields={['work_address_select']}
            disableFields={['org_select']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;