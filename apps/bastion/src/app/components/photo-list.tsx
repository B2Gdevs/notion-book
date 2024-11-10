'use client';
import React from 'react';
import { Photo, useMenuDataFromStoreId } from 'ui'; // Assuming StoreClient is the correct client
import PhotoCard from './photo-card';

interface PhotoListProps {
  storeId: string;
}

const PhotoList: React.FC<PhotoListProps> = ({ storeId }) => {

  const {
    photos,
  } = useMenuDataFromStoreId(storeId);


  return (
    <div>
      <h3 className='font-righteous text-2xl border-b-2 border-black'>Photos</h3>
      {Object.values(photos ?? {}).length === 0 ? (
        <div>No photos available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(photos ?? {}).map((photo: Photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoList;
