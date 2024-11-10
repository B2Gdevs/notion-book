'use client'
import React, { useState } from 'react';
import {
  Photo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  useGetPhotosByMenu
} from 'ui'; // Adjust the imports as needed based on your actual setup

interface PhotoSelectProps {
  menuId: string;
  onSelect?: (selectedPhoto: Photo) => void;
}

const PhotoSelect: React.FC<PhotoSelectProps> = ({
  menuId,
  onSelect,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const {data:fetchPhotos} = useGetPhotosByMenu(menuId);


  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    if (onSelect) {
      onSelect(photo);
    }
  };

  return (
    <Select
      value={selectedPhoto?.id || ''} // Assuming the Photo has an 'id' property
      onValueChange={(value: any) => {
        const photo = fetchPhotos?.find((p) => p.id === value);
        if (photo) {
          handleSelectPhoto(photo);
        }
      }}
    >
      <SelectTrigger>
        {selectedPhoto?.fileName || 'Select a photo'}
      </SelectTrigger>
      <SelectContent>
        {fetchPhotos
          ?.sort((a, b) => (a?.fileName ?? '').localeCompare(b?.fileName ?? ''))
          .map((photo) => (
            <SelectItem key={photo.id} value={photo?.id ?? ''}>
              {photo.fileName}
            </SelectItem>
          ))}
      </SelectContent>

    </Select>
  );
};

export default PhotoSelect;
