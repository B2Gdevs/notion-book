import React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button, ItemClassification, Label, toast, useCreateItemClassification, useDeleteItemClassification, useUpdateItemClassification } from '..';

interface ItemClassificationFormProps {
    itemClassification?: ItemClassification;
    onSuccess: () => void;
    onError: (error: any) => void;
}

export const ItemClassificationForm: React.FC<ItemClassificationFormProps> = ({
    itemClassification,
    onSuccess,
    onError
}) => {
    const form = useForm<ItemClassification>({
        defaultValues: {
            tag: itemClassification?.tag ?? '',
            containsAllergen: itemClassification?.containsAllergen ?? false,
        },
        onSubmit: async ({ value }) => {
            if (itemClassification) {
                updateItemClassificationMutation.mutate({
                    itemClassificationId: itemClassification?.id ?? '',
                    itemClassificationData: value
                });
            } else {
                createItemClassificationMutation.mutate(value);
            }
        },
    });

    const createItemClassificationMutation = useCreateItemClassification({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item classification created successfully',
                duration: 5000,
            });
            onSuccess();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: `Failed to create item classification: ${error.message}`,
                duration: 5000,
                variant: 'destructive',
            });
            onError(error);
        },
    });

    const updateItemClassificationMutation = useUpdateItemClassification({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item classification updated successfully',
                duration: 5000,
            });
            onSuccess();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: `Failed to update item classification: ${error.message}`,
                duration: 5000,
                variant: 'destructive',
            });
            onError(error);
        },
    });

    const deleteItemClassificationMutation = useDeleteItemClassification({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item classification deleted successfully',
                duration: 5000,
            });
            onSuccess();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: `Failed to delete item classification: ${error.message}`,
                duration: 5000,
                variant: 'destructive',
            });
            onError(error);
        },
    });
    const handleDeleteItemClassification = () => {
        if (itemClassification) {
            deleteItemClassificationMutation.mutate(itemClassification?.id ?? '');
        }
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className='flex flex-col gap-y-4 p-4'>
            <Label className="flex items-center">
                Item Classification Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <form.Field
                name='tag'
                children={(field) => (
                    <input
                        type='text'
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='Item Classification Name'
                        required
                        className={`p-2 border rounded mb-4 ${field.state.value ? 'border-gray-300' : 'border-red-500'}`}
                        aria-required="true"
                    />
                )}
            />

            <Button
                className='bg-primary-spinach-green text-primary-off-white'
                type="submit"
            >
                {itemClassification ? 'Update' : 'Create'} Item Classification
            </Button>
            {itemClassification && (
                <Button
                    className='bg-primary-almost-black/40 text-primary-off-white'
                    onClick={handleDeleteItemClassification}
                >
                    Delete Item Classification
                </Button>
            )}
        </form>
    );
};