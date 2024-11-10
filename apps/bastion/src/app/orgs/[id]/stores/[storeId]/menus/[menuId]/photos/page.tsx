'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, Progress, useDeletePhoto, useGetPhotosByMenu } from 'ui';
import PhotoList from '../../../../../../../components/photo-list';

const StoreComponent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const storeId = params.storeId as string;
  const menuId = params.menuId as string;
  const [deleteProgress, setDeleteProgress] = useState(0);


  const { data: photos, refetch } = useGetPhotosByMenu(menuId);
  const deletePhoto = useDeletePhoto({
    onSuccess: () => {
      setDeleteProgress((prevProgress) => prevProgress + 1);
    },
  });

  const clearAllPhotos = () => {
    if (window.confirm('Are you sure you want to delete ALL photos?')) {
      photos?.forEach((photo) => {
        deletePhoto.mutate(photo?.id ?? '');
      });
    }
  };

  const totalPhotos = photos?.length || 0;
  const deletePercentage = totalPhotos > 0 ? (deleteProgress / totalPhotos) * 100 : 0;

  // Reset progress after all photos have been deleted
  if (deleteProgress === totalPhotos && totalPhotos !== 0) {
    setDeleteProgress(0);
    refetch(); // Refetch photos after deletion
  }

  return (
    <div>
      <div className='flex space-x-2'>
        <Button onClick={() => router.push(`/orgs/${orgId}/stores/${storeId}/menus/${menuId}/photos/new`)}>
          Add A Photo
        </Button>
        <Button className='bg-secondary-pink-salmon' onClick={clearAllPhotos} disabled={deleteProgress > 0}>
          Clear All Photos
        </Button>
      </div>
      {deleteProgress > 0 && (
        <>
          <Progress value={deletePercentage} className="my-4" />
          <div>Deleting photos: {deleteProgress} of {totalPhotos}</div>
        </>
      )}
      <PhotoList storeId={storeId} />
    </div>
  );
};

export default StoreComponent;