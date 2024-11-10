import { cn } from "..";

interface MenuItemCardUnavailableOverlayProps {
    className?: string;
}

export const MenuItemCardUnavailableOverlay: React.FC<MenuItemCardUnavailableOverlayProps> = ({ className }) => (
    <div className={cn('absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-xl z-20', className)}>
        <span className="text-secondary-pink-salmon  text-xl z-30 font-righteous">
            Unavailable
        </span>
    </div>
);