'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionedInput, Brand, Category, CodeBlock, ConfirmationDialog, Item, Label, MenusMetricBar, ModifierGroup, Photo, Store, StoreStates, TitleComponent, useMenuDataFromStoreId } from "ui";

interface StoreCardProps {
    store: Store;
    brand?: Brand;
    onDelete: (storeId: string) => void;
};

export const StoreCard: React.FC<StoreCardProps> = ({ store, onDelete, brand }) => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<string | null>(null);

    const menuItems = [
        { name: 'edit', label: 'Edit Store' },
        { name: 'delete', label: 'Delete' }
    ];

    const handleMenuClick = (buttonName: string) => {
        switch (buttonName) {
            case 'edit':
                if (store.id) {
                    router.push(`/stores/${store.id}`);
                }
                break;
            case 'delete':
                openConfirmDeleteDialog(store.id ?? '');
                break;
            default:
                console.error('Unknown action');
        }
    };

    const {
        menus,
        items,
        categories,
        modifierGroups,
        photos
    } = useMenuDataFromStoreId(store?.id ?? '');


    const openConfirmDeleteDialog = (storeId: string) => {
        setStoreToDelete(storeId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        if (storeToDelete) {
            onDelete(storeToDelete);
            setIsDialogOpen(false);
            setStoreToDelete(null); // Reset after deletion
        }
    };


    return (
        <TitleComponent
            leftTitle='Store'
            centerTitle={brand?.name}
            rightTitle={store?.id}
            menuItems={menuItems}
            onMenuItemClick={handleMenuClick}
            menuPosition="bottom-right"
        >
            <div className="m-2">
                <div className="flex mt-2 rounded-lg items-center">
                    <Label className="font-righteous text-black">Status</Label>
                    <CodeBlock className={` ${store?.store_state === StoreStates.OPEN ? 'text-green-500' : 'text-red-500'}`}>
                        {store?.store_state ?? 'Unknown status'}
                    </CodeBlock>
                </div>
                <MenusMetricBar
                    menus={menus}
                    categories={categories as Record<string, Category>}
                    modifierGroups={modifierGroups as Record<string, ModifierGroup>}
                    items={items as Record<string, Item>}
                    photos={photos as Record<string, Photo>}
                />
                <ActionedInput label="Name" value={store?.name ?? 'Not connected'} id="storeName" disabled={true} />
                <ActionedInput label="Brand Name" value={brand?.name ?? 'Not connected'} id="brandName" disabled={true} />
                <ActionedInput label="Store ID" value={store?.id ?? 'Not connected'} id="store-id" disabled={true} />
                <ActionedInput label="Otter ID" value={store?.otter_id ?? 'Not connected'} id="otter-id" disabled={true} />

                <ConfirmationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onConfirm={confirmDelete} message="Are you sure you want to delete this store?" />
            </div>
        </TitleComponent>
    );
};