'use client'
// PhotoInput.tsx
import React, { useState, useEffect } from 'react';
import { Photo, useGetPhotoById } from 'ui';

interface PhotoInputProps {
  onChange: (photo: Photo) => void;
  menuId: string;
  photoId?: string;
}

const PhotoInput: React.FC<PhotoInputProps> = ({ onChange, menuId, photoId }) => {
  const [photo, setPhoto] = useState<Photo>({
    menu_id: menuId,
    fileName: '',
    contentType: '',
    url: '',
  });

  const { data: fetchedPhoto } = useGetPhotoById(photoId ?? '');

  useEffect(() => {
    if (fetchedPhoto) {
      setPhoto(fetchedPhoto);
    }
  }, [fetchedPhoto]);

  const handleInputChange = (field: keyof Photo, value: any) => {
    const updatedPhoto = { ...photo, [field]: value };
    setPhoto(updatedPhoto);
    onChange(updatedPhoto);
  };

  return (
    <div>
      <h3 className="text-xl  mb-4">Edit Photo</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">File Name</label>
        <input
          type="text"
          value={photo?.fileName ?? ''}
          onChange={(e) => handleInputChange('fileName', e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">URL</label>
        <input
          type="text"
          value={photo?.url ?? ''}
          onChange={(e) => handleInputChange('url', e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <img src={photo?.url ?? ''} alt={photo?.fileName ?? ''} width="100" />
      </div>
    </div>
  );
};

export default PhotoInput;