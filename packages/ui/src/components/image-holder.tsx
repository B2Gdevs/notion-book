'use client'

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'; // Adjust the import path as necessary
import { cn } from '..';

interface ImageHolderProps {
  imageUrl: string | null;
  onImageUrlChange?: (url: string) => void;
  className?: string;
}

export const ImageHolder: React.FC<ImageHolderProps> = ({ imageUrl, onImageUrlChange, className }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onImageUrlChange) {
      onImageUrlChange(inputUrl);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-64 h-64 flex flex-col items-center justify-center space-y-4 relative rounded-lg border-2 border-dashed mt-2 cursor-pointer">
          {imageUrl ? (
            <img src={imageUrl} className="w-full h-full object-cover rounded-lg" alt="Uploaded" />
          ) : (
            <div className="text-gray-500">
              <p>No image selected</p>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className={cn("flex flex-col items-center justify-center", className)}>
          <input
            type="text"
            placeholder="Enter image URL"
            value={inputUrl}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded-lg mb-4"
          />
          <button type="submit" className="border border-gray-300 p-2 rounded-lg">Update Image</button>
        </form>
      </DialogContent>
    </Dialog>
  );
};