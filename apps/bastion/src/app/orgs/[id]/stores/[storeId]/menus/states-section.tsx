import { ArrowUpRightSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, Menu } from 'ui';
import { CategoryStateDialog } from './category-state-dialog';
import { MenuItemStateDialog } from './menu-item-state-dialog';
import { ModifierGroupStateDialog } from './modifier-group-state-dialog';
import { PhotoStateDialog } from './photo-state-dialog';

interface StatesSectionProps {
    menu: Menu;
}

export const StatesSection = ({ menu }: StatesSectionProps) => {
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
    const [isModifierGroupDialogOpen, setIsModifierGroupDialogOpen] = useState(false);
    const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

    return (
        <>
            <div className='flex space-x-2 border-2 border-black rounded-lg p-2'>
                <div className='underline'>States</div>

                {/* Categories */}
                <Button
                    className="mt-4 inline-flex items-center"
                    onClick={() => setIsCategoryDialogOpen(true)}
                >
                    Categories
                    <ArrowUpRightSquareIcon className="ml-2" />
                </Button>

                {/* Menu Items */}
                <Button
                    className="mt-4 inline-flex items-center"
                    onClick={() => setIsMenuItemDialogOpen(true)}
                >
                    Menu Items
                    <ArrowUpRightSquareIcon className="ml-2" />
                </Button>

                {/* Modifier Groups */}
                <Button
                    className="mt-4 inline-flex items-center"
                    onClick={() => setIsModifierGroupDialogOpen(true)}
                >
                    Modifier Groups
                    <ArrowUpRightSquareIcon className="ml-2" />
                </Button>

                {/* Photos */}
                <Button
                    className="mt-4 inline-flex items-center"
                    onClick={() => setIsPhotoDialogOpen(true)}
                >
                    Photos
                    <ArrowUpRightSquareIcon className="ml-2" />
                </Button>

            </div>

            <CategoryStateDialog
                menu={menu}
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
            />
            <MenuItemStateDialog
                menu={menu}
                isOpen={isMenuItemDialogOpen}
                onClose={() => setIsMenuItemDialogOpen(false)}
            />
            <ModifierGroupStateDialog
                menu={menu}
                isOpen={isModifierGroupDialogOpen}
                onClose={() => setIsModifierGroupDialogOpen(false)}
            />
            <PhotoStateDialog
                menu={menu}
                isOpen={isPhotoDialogOpen}
                onClose={() => setIsPhotoDialogOpen(false)}
            />
        </>
    );
};