import * as React from 'react';
import { DEFAULT_TABLE_PAGE_SIZE, Tooltip, TooltipContent, TooltipTrigger, cn, getIconForClassification, toast, useGetItemClassifications, useGetItemClassificationsList, useUpdateItem } from '..';
import { DEFAULT_ITEM_CLASSIFICATIONS } from '../constants/menuConstants';
import { Item, ItemClassification } from '../models/menuModels';
import { ItemClassificationsTagDisplay } from './item-classification-tag-display';

export interface DietaryClassificationsProps {
  layout?: 'vertical' | 'horizontal';
  className?: string;
  previewMode?: boolean;
  onClick?: (classification: ItemClassification) => void;
  item?: Item;
}

export const DietaryClassifications: React.FC<DietaryClassificationsProps> = ({
  layout = 'vertical',
  className,
  previewMode = false,
  onClick = () => { },
  item
}) => {
  const updateMenuItemMutation = useUpdateItem({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Item updated successfully',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        duration: 5000,
        variant: 'destructive'
      });
    }
  });
  const { data: defaultClassifications } = useGetItemClassifications({
    page: 1,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  let { data: itemClassifications, isLoading, isError } = useGetItemClassificationsList(item?.item_classifications_ids ?? []);

  const checkIfClassificationInItem = (classification: ItemClassification) => {
    return itemClassifications?.some(ic => ic.tag === classification.tag);
  };

  const toggleClassificationInItem = (classification: ItemClassification) => {
    if (!item) return;

    const updatedItem = { ...item };
    const classificationExists = item.item_classifications_ids?.includes(classification?.id ?? '');

    updatedItem.item_classifications_ids = classificationExists ?
      updatedItem.item_classifications_ids?.filter(id => id !== classification.id) :
      [...(updatedItem.item_classifications_ids ?? []), classification.id].filter((id): id is string => id !== undefined);

    return updatedItem;
  };

  const handleUpdateMenuItem = (classification: ItemClassification) => {
    const updatedItem = toggleClassificationInItem(classification);

    if (updatedItem) {
      updateMenuItemMutation.mutate({
        itemId: item?.id ?? '',
        itemData: updatedItem
      });
    }
  };

  if (!previewMode && (!item || !itemClassifications || itemClassifications.length === 0)) {
    return null;
  }

  if (isLoading) {
    return <div>Loading classifications...</div>;
  }

  if (isError) {
    return <div>Error loading classifications.</div>;
  }
  if (!itemClassifications) return null

  return (
    <div className={`flex-col ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-1 pt-2 pb-2`}>
      <div className='flex space-x-2'>
        {DEFAULT_ITEM_CLASSIFICATIONS.map((defaultClassification) => {
          const IconComponent = getIconForClassification(defaultClassification.tag);
          const isClassificationInItem = checkIfClassificationInItem(defaultClassification);
          const itemClassification = defaultClassifications?.find(ic => ic.tag === defaultClassification.tag);

          if (!itemClassification) return null;

          if (!IconComponent && previewMode) return null;

          // Only show icons if in preview mode or if the classification is in the item
          if (previewMode || isClassificationInItem) {
            return (
              <div key={defaultClassification.tag}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {IconComponent && (
                        <IconComponent
                          onClick={() => {
                            if (previewMode) {
                              handleUpdateMenuItem(itemClassification);
                              onClick(itemClassification);
                            }
                          }}
                          className={cn(className, {
                            'text-green-600 hover:text-blue-500 cursor-pointer': isClassificationInItem,
                            'text-blue-500 hover:text-blue-500 cursor-pointer opacity-50': !isClassificationInItem && previewMode
                          })}
                        />
                      )}

                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {defaultClassification.tag}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div>
        {previewMode && (
          <ItemClassificationsTagDisplay itemClassifications={itemClassifications} />
        )}
      </div>
    </div>
  );
}

