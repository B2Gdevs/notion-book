'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, Photo, toast, useCreatePhoto, useUpdatePhoto } from 'ui';
import PhotoInput from '../../../../../../../../components/photo-input';

const MenuDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const menuId = params.menuId as string;
    const photoId = params.photoId as string;
    const storeId = params.storeId as string;
    const [photo, setPhoto] = useState<Photo>({
        menu_id: menuId,
        fileName: '',
        contentType: '',
        url: '',
        is_active: true,
    });

    const createPhotoMutation = useCreatePhoto({
        onSuccess: () => {
            toast({
                title: 'Photo Created',
                description: 'New photo has been created.',
                duration: 5000,
            });
            router.push(`/orgs/${menuId}/stores/${storeId}/menus/${menuId}/photos`);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error creating photo: ${error.message}`,
                duration: 5000,
            });
        }
    });

    const updatePhotoMutation = useUpdatePhoto({
        onSuccess: () => {
            toast({
                title: 'Photo Updated',
                description: 'Photo has been updated.',
                duration: 5000,
            });
            router.push(`/orgs/${menuId}/stores/${storeId}/menus/${menuId}/photos`);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error updating photo: ${error.message}`,
                duration: 5000,
            });
        }
    });

    const save = (photo: Photo) => {
        if (photo.id) {
            updatePhotoMutation.mutate({ photoId: photo.id, photo });
        } else {
            createPhotoMutation.mutate({ menuId, photo });
        }
    };

    return (
        <div className="m-8 flex-col justify-center text-center">
            <PhotoInput onChange={(photo: Photo) => {
                setPhoto(photo);
            }} menuId={menuId} photoId={photoId} />
            <Button onClick={() => {
                if (!photo) return;
                save(photo);
            }}>Save</Button>
        </div>
    );
};

export default MenuDetail;