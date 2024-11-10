import { MailIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Highlight } from 'react-instantsearch';
import { CodeBlock, TitleComponent, TitleComponentMenuItem, User, toast } from 'ui'; 
import { HitComponentProps, SearchIndex } from './algolia-search';
import { createRoute } from './hitRoutes';

export const UserHitComponent = ({ hit }: HitComponentProps) => {
    const router = useRouter()
    const user = hit as User;
    const userHit = user as any;

    const goToUser = () => {
        const route = createRoute(SearchIndex.USERS, hit?.id ?? '');
        if (!user.id) {
            toast({
                title: 'Error',
                description: 'User does not have an id',
                duration: 5000
            });
            return;
        }
        router.push(route);
    }

    const handleClick = (menuItemName: string) => {
        switch (menuItemName) {
            case "go_to_user":
                goToUser();
                break;
        }
    }

    const menuItems: TitleComponentMenuItem[] = [{
        name: "go_to_user",
        label: "Go",
    }]

    return (
        <TitleComponent
            menuItems={menuItems}
            onMenuItemClick={handleClick}
            leftTitle="User"
            leftTitleClassName="text-xs text-black bg-white" 
            rightTitle={`${user?.first_name} ${user?.last_name}`}
            leftTitleIcon={<UserIcon className='text-xxs'/>}
            >
            <div
                className='flex-col my-2 gap-4 text-xs items-center  p-2 space-y-1 hover:bg-lime-500'>

                <div className="flex items-center text-white">
                    <MailIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2 ">Email</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="email" hit={userHit} />
                    </CodeBlock>
                </div>

                <div className="flex items-center text-white">
                    <UserIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2 ">ID</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="id" hit={userHit} />
                    </CodeBlock>
                </div>


            </div>
        </TitleComponent>
    );
}