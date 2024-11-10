'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Input,
    Label,
    PriorityGroupSelect,
    Store,
    StoreContextActions,
    StoreHoursConfigurationInput,
    StoreStateSelect,
    StoreStates,
    TitleComponent,
    toast,
    useGetStore, useUpdateStore
} from 'ui';

const StorePage = () => {
    const params = useParams();
    const storeId = params.id as string;
    const router = useRouter();

    const { data: store, isLoading, error } = useGetStore(storeId);
    const [editStore, setEditStore] = useState<Store | null>(store ?? null); // Initialize with null

    const updateStoreMutation = useUpdateStore({
        onSuccess: () => {
            toast({
                title: 'Store updated successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error updating store',
                description: error instanceof Error ? error.message : 'An error occurred',
            });
        },
    });

    useEffect(() => {
        if (store) {
            setEditStore(store); // Once the store is loaded, set it as the editStore
        }
    }, [store]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditStore((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handlePriorityGroupChange = (newGroup: number) => {
        setEditStore((prev) => (prev ? { ...prev, priority_group: newGroup } : null));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editStore) {
            updateStoreMutation.mutate(editStore);
        }
    };

    const handleStoreStateChange = (newState: string) => {
        let storeState: StoreStates;
        const storeStateEnum = StoreStates[newState as keyof typeof StoreStates];
        if (storeStateEnum) {
            storeState = storeStateEnum;
        } else {
            storeState = StoreStates.STORE_UNAVAILABLE;
        }

        setEditStore((prev) => (prev ? { ...prev, store_state: storeState } : null));
    };


    const menuItems = [
        { name: 'menus', label: 'See Menus' },
    ]

    const handleMenuClick = (buttonName: string) => {
        switch (buttonName) {
            case 'menus':
                if (store?.id) {
                    router.push(`/orgs/${store?.org_id}/stores/${store?.id}/menus`);
                }
                break;
            default:
                console.error('Unknown action');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error has occurred:</div>;
    if (!editStore) return <div>No store found or store data is still loading...</div>;

    return (
        <TitleComponent
            className='mt-4'
            leftTitle='Store'
            centerTitle={editStore.name}
            rightTitle={`${editStore.id} / Otter I`}
            menuItems={menuItems}
            onMenuItemClick={handleMenuClick}
            >
            <StoreContextActions storeId={editStore.id ?? ''} />

            <div className='flex flex-col space-y-4 mt-4'>
                <div className='bg-primary-almost-black-light rounded-xl p-2'>
                    <form onSubmit={handleSubmit}>
                        <Button type='submit'>Update Store</Button>
                        <div className='grid grid-cols-4 gap-2'>
                            <div>
                                <Label className='text-md font-righteous'>Name</Label>
                                <Input
                                    name='name'
                                    value={editStore.name ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label className='text-md font-righteous'>Status</Label>
                                <StoreStateSelect
                                    onChange={handleStoreStateChange}
                                    value={editStore.store_state as string ?? ''}
                                />
                            </div>
                            <div>
                                <Label className='text-md font-righteous'>Priority Group</Label>
                                <PriorityGroupSelect
                                    onChange={handlePriorityGroupChange}
                                    value={editStore.priority_group}
                                />
                            </div>
                           
                        </div>
                    </form>
                    <StoreHoursConfigurationInput
                        initialConfiguration={editStore.hours ?? {
                            delivery_hours: { regular_hours: [], special_hours: [] },
                            pickup_hours: { regular_hours: [], special_hours: [] },
                            timezone: 'UTC',
                        }}
                        onChange={(updatedConfiguration) => {
                            setEditStore((prev) => ({
                                ...prev!,
                                hours: updatedConfiguration,
                            }));
                        }}
                    />
                </div>
            </div>
        </TitleComponent>
    );
};

export default StorePage;