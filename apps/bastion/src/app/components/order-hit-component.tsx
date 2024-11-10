import { ShoppingBasket, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Highlight } from 'react-instantsearch';
import { CodeBlock, Order, TitleComponent, TitleComponentMenuItem, toast, useGetUser } from 'ui'; // Import TitleComponent
import { HitComponentProps, SearchIndex } from './algolia-search';
import { createRoute } from './hitRoutes';

export const OrderHitComponent = ({ hit }: HitComponentProps) => {
    const router = useRouter()
    const order = hit as Order;
    const orderHit = order as any; // typing hurdle

    const {data: user} = useGetUser(order?.user_id ?? '')

    const goToOrder = () => {
        const route = createRoute(SearchIndex.ORDERS, order?.id ?? '');
        if (!order.id) {
            toast({
                title: 'Error',
                description: 'Order does not have an id',
                duration: 5000
            });
            return;
        }
        router.push(route);
    }

    const handleClick = (menuItemName: string) => {
        switch (menuItemName) {
            case "go_to_order":
                goToOrder();
                break;
        }
    }

    const menuItems: TitleComponentMenuItem[] = [{
        name: "go_to_order",
        label: "Go",
    }]

    return (
        <TitleComponent
            menuItems={menuItems}
            onMenuItemClick={handleClick}
            leftTitle="Order"
            leftTitleClassName="text-xs text-black bg-white" 
            rightTitle={order?.id}
            leftTitleIcon={<ShoppingBasket className='text-xxs'/>}
            >
            <div className="flex-col space-y-1 justify-between text-xs items-center  p-2  hover:bg-lime-500">
                <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2">User ID</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="user_id" 
                        hit={orderHit} />
                    </CodeBlock>
                </div>
                <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2">User Name</div>
                    <CodeBlock className="text-xs text-black">
                        {user?.name}
                    </CodeBlock>
                </div>
            </div>
        </TitleComponent>
    );
}