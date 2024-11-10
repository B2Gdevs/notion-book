import { cn } from "..";

interface MenuItemPriceProps {
    name?: string;
    layout?: 'vertical' | 'horizontal';
    price?: number;
}

export const MenuItemPrice: React.FC<MenuItemPriceProps> = ({ name, layout, price }) => {
    const nameLength = name?.length ?? 0;
    let nameClass = 'text-2xl';
    if (nameLength > 20) {
        nameClass = 'text-xl';
    }
    if (nameLength > 25) {
        nameClass = 'text-lg';
    }
    if (nameLength > 30) {
        nameClass = 'text-base';
    }
    if (nameLength > 40) {
        nameClass = 'text-sm';
    }

    return (
        <>
            <div
                className={cn(
                    `${layout === 'vertical'
                        ? 'text-primary-off-white'
                        : 'text-primary-almost-black'
                    } ${nameClass} font-righteous leading-loose`,
                )}
            >
                {name ?? ''}
            </div>
            <div
                className={`text-secondary-peach-orange text-lg font-righteous leading-normal`}
            >
                ${price?.toFixed(2) ?? '0.00'}
            </div>
        </>
    );
};
