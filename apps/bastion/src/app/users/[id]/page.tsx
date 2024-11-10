'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, ConfirmationDialog, NotificationSettingsSection, PaymentMethodsComponent, User, UserForm, toast, useDeleteUser, useGetUser, useUpdateUser } from 'ui';

const UserDetailPage = () => {
    const params = useParams();
    const userId = params.id as string;
    const router = useRouter();

    const { data: user, } = useGetUser(userId);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);


    useEffect(() => {
        if (user) {
            setEditUser(user);
        }
    }, [user]);

    const updateUserMutation = useUpdateUser({
        onSuccess: () => {
            toast({
                title: 'User Updated',
                description: 'The user has been updated successfully.',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Failed to update user: ${error.message}`,
                duration: 5000,
            });
        },
    });




    const handleSubmit = (user:User) => {

        if (editUser) {
            updateUserMutation.mutate({
                userId: userId,
                user: user,
            });
        }
    };

    const handleViewOrders = () => {
        router.push(`/users/${userId}/orders`);
    };


    useEffect(() => {
        if (user) {
            setEditUser(user);
        }
    }, [user]);

    const { mutate: deleteUser } = useDeleteUser({
        onSuccess: () => {
            toast({
                title: 'User Deleted',
                description: 'The user has been deleted successfully.',
                duration: 5000,
            });
            router.push('/users'); // Adjust the route as necessary
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Failed to delete user: ${error.message}`,
                duration: 5000,
            });
        },
    });

    const handleDeleteUser = () => {
        if (userId) {
            deleteUser(userId);
        }
    };


    if (!editUser) return <div>No user found or user data is still loading...</div>;

    return (
        <div className='flex flex-col space-y-4 p-5'>
            <Button onClick={handleViewOrders}>View Orders</Button>
            <Button className='bg-secondary-pink-salmon' onClick={() => setIsDeleteDialogOpen(true)}>Delete User</Button>
            <UserForm 
            initialData={editUser} 
            onSubmit={handleSubmit}
            />
            <NotificationSettingsSection user={user ?? {} as User} />
            <PaymentMethodsComponent user={user ?? ({} as User)} />
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteUser}
                message="Are you sure you want to delete this user?"
            />
        </div>
    );
};

export default UserDetailPage;

