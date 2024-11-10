import { Hexagon, MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Brand, CodeBlock, toast, TitleComponent, TitleComponentMenuItem } from 'ui'; // Import TitleComponent
import { HitComponentProps, SearchIndex } from './algolia-search';
import { createRoute } from './hitRoutes';
import { Highlight } from 'react-instantsearch';

export const BrandHitComponent = ({ hit }: HitComponentProps) => {
    const router = useRouter()
    const brand = hit as Brand;
    const brandHit = brand as any; // typing hurdle

    const goToBrand = () => {
        const route = createRoute(SearchIndex.BRANDS, brand?.id ?? '');
        if (!brand.id) {
            toast({
                title: 'Error',
                description: 'Brand does not have an id',
                duration: 5000
            });
            return;
        }
        router.push(route);
    }

    const handleClick = (menuItemName: string) => {
        switch (menuItemName) {
            case "go_to_brand":
                goToBrand();
                break;
        }
    }

    const menuItems: TitleComponentMenuItem[] = [{
        name: "go_to_brand",
        label: "Go",
    }]

    return (
        <TitleComponent
            menuItems={menuItems}
            onMenuItemClick={handleClick}
            leftTitle="Brand"
            leftTitleClassName="text-xs text-black bg-white" 
            rightTitle={brand?.name}
            leftTitleIcon={<Hexagon className='text-xxs'/>}
            >
            <div className="flex-col space-y-1 justify-between text-xs items-center p-2 hover:bg-lime-500">
                <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2">Name</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="name" hit={brandHit} />
                    </CodeBlock>
                </div>
            </div>
        </TitleComponent>
    );
}