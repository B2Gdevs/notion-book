'use client'

import React from 'react';
import { Area, CodeBlock, toast, useDeleteArea, Button } from 'ui';
import { ConfirmationDialog } from 'ui';
import { Trash2 } from 'lucide-react';

interface AreaCardProps {
    area: Area;
    setSelectedArea: (area: Area) => void;
}

export const AreaCard: React.FC<AreaCardProps> = ({ area, setSelectedArea }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { mutate: deleteArea } = useDeleteArea({
        onSuccess: () => {
            toast({
                title: 'Area Deleted',
                description: 'The area has been successfully deleted.',
                duration: 3000,
            });
        },
        onError: (error) => {
            console.error('Error deleting area:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the area.',
                duration: 3000,
            });
        },
    });

    const handleDelete = () => {
        deleteArea(area?.id ?? '');
        setIsDialogOpen(false);
    };

    return (
        <>
            <div
                onClick={() => setSelectedArea(area)}
                key={area.id}
                className="relative p-2 border-2 border-black cursor-pointer transition-all duration-300 hover:bg-slate-300 flex flex-col space-y-2 rounded-lg"
            >
                <Button className="absolute top-2 right-2 bg-secondary-pink-salmon text-white  py-1 px-2 rounded-bl hover:bg-secondary-pink-salmon-darker flex items-center justify-center" onClick={(e) => {e.stopPropagation(); setIsDialogOpen(true);}}>
                    <Trash2 className="mr-2" /> Delete
                </Button>
                <div className="flex items-center ">
                    <div className="font-righteous  mr-2">Name:</div>
                    <CodeBlock className="text-primary-spinach-green">{area.name}</CodeBlock>
                </div>
                <div className="flex items-center">
                    <div className="font-righteous  mr-2">ID:</div>
                    <CodeBlock className="text-primary-spinach-green">{area.id}</CodeBlock>
                </div>
                <div className="italic mb-2 self-end font-righteous">{area.description}</div>
                <div className="font-righteous ">Scheduler Status:</div>
                <div>{area.scheduler_job_status}</div>
                <div className="font-righteous ">Rebatch Scheduler Status:</div>
                <div>{area.rebatch_scheduler_job_status}</div>
            </div>
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this area?"
            />
        </>
    );
}