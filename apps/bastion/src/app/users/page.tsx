'use client'
import { useState } from 'react';
import { Org, OrgSelect, User, UserForm, UserTable, UserType, toast, useCreateUser } from 'ui';

export default function UserListPage() {
    const [org, setOrg] = useState<Org>();

    const { mutate: createUser } = useCreateUser({
        onSuccess: () => {
            toast({
                title: 'User added successfully',
                duration: 5000,
            });
        },
        onError: () => {
            toast({
                title: 'Error adding user',
                duration: 5000,
            });
        },
    });

    const handleAddUser = (newUser: User, userType?: string) => {
        if (userType === UserType.PARTNER) {
            createUser({ user: newUser, userType: userType});
        } else {
            createUser({ user: newUser});
        }
    };


    return (
        <div className="m-8">
            <UserForm
                className='mb-4'
                onSubmit={(newUser, userType) => { handleAddUser(newUser, userType) }}
            />

            <div className='bg-purple-100 rounded-lg p-2 border-black border-2 mb-4'>
                <OrgSelect onChange={(org) => {
                    setOrg(org);
                }} />
                <UserTable orgClerkId={org?.external_id ?? ''} subtitle={`${org?.name} Users`} />
            </div>
            <div className='border-black border-2 rounded-lg mb-4'>
                <UserTable subtitle='All Users' />
            </div>

        </div>
    );
};

