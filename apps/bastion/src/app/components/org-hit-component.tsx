import { Building, MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Org, CodeBlock, toast, TitleComponent, TitleComponentMenuItem } from 'ui'; // Import TitleComponent
import { HitComponentProps, SearchIndex } from './algolia-search';
import { createRoute } from './hitRoutes';
import { Highlight } from 'react-instantsearch';

export const OrgHitComponent = ({ hit }: HitComponentProps) => {
    const router = useRouter()
    const org = hit as Org;
    const orgHit = org as any; // typing hurdle

    const goToOrg = () => {
        const route = createRoute(SearchIndex.ORGS, org?.id ?? '');
        if (!org.id) {
            toast({
                title: 'Error',
                description: 'Organization does not have an id',
                duration: 5000
            });
            return;
        }
        router.push(route);
    }

    const handleClick = (menuItemName: string) => {
        switch (menuItemName) {
            case "go_to_org":
                goToOrg();
                break;
        }
    }

    const menuItems: TitleComponentMenuItem[] = [{
        name: "go_to_org",
        label: "Go",
    }]

    return (
        <TitleComponent
            menuItems={menuItems}
            onMenuItemClick={handleClick}
            leftTitle="Org"
            leftTitleClassName="text-xs text-black bg-white" 
            rightTitle={org?.name}
            leftTitleIcon={<Building className='text-xxs'/>}
            >
            <div className="flex space-y-1 justify-between text-xs items-center p-2 mt-2 hover:bg-lime-500">
                <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mx-2 text-xs" />
                    <div className="mr-2">Email</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="admin_email" hit={orgHit} />
                    </CodeBlock>
                </div>
            </div>
        </TitleComponent>
    );
}