import React from 'react';
import { motion } from 'framer-motion';
import { Button, Photo } from 'ui';
import { Image, Edit2 } from 'lucide-react';  // Importing the necessary icons from lucide-react
import { useParams, useRouter } from 'next/navigation';

interface PhotoCardProps {
    photo: Photo;
    orgId?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, orgId }) => {
    const router = useRouter();
    const params = useParams();
    const orgID = orgId || params.id as string;
    const storeId = params.storeId as string;

    return (
        <motion.div
            className="m-4 p-6 bg-white rounded-xl shadow-md transform transition hover:scale-105"
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex justify-between">
                <h2 className="text-xl ">{photo.fileName}</h2>
                <span className="text-secondary-peach-orange text-xs">
                    <Image className="h-5 w-5 text-gray-700" />
                </span>
            </div>
            <img src={photo.url} alt={photo?.fileName ?? 'The photo of a food item'} className="w-full h-40 object-cover mt-4 mb-2 rounded-md" />

            <div className="flex items-center justify-between">
                <Button onClick={() => {
                    router.push(`/orgs/${orgID}/stores/${storeId}/menus/${photo.menu_id}/photos/${photo.id}`)
                }}>
                    <Edit2 className="h-5 w-5 text-gray-700" />
                    Edit Photo
                </Button>
            </div>
        </motion.div>
    );
};

export default PhotoCard;
