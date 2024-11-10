import { useRouter } from 'next/navigation';
import { DeliveryJob, CodeBlock, toast, TitleComponent, TitleComponentMenuItem } from 'ui'; // Import TitleComponent
import { HitComponentProps, SearchIndex } from './algolia-search';
import { createRoute } from './hitRoutes';
import { Highlight } from 'react-instantsearch';

export const DeliveryJobHitComponent = ({ hit }: HitComponentProps) => {
    const router = useRouter()
    const job = hit as DeliveryJob;
    const jobHit = job as any; // typing hurdle

    const goToJob = () => {
        const route = createRoute(SearchIndex.DELIVERY_JOBS, job?.id ?? '');
        if (!job.id) {
            toast({
                title: 'Error',
                description: 'Delivery job does not have an id',
                duration: 5000
            });
            return;
        }
        router.push(route);
    }

    const handleClick = (menuItemName: string) => {
        switch (menuItemName) {
            case "go_to_job":
                goToJob();
                break;
        }
    }

    const menuItems: TitleComponentMenuItem[] = [{
        name: "go_to_job",
        label: "Go",
    }]

    return (
        <TitleComponent
            menuItems={menuItems}
            onMenuItemClick={handleClick}
            leftTitle="Job"
            leftTitleClassName="text-xs text-black bg-white" 
            rightTitle={job?.id}
            >
            <div className="flex-col space-y-1 justify-between text-xs items-center  p-2 hover:bg-lime-500">
                <div className="flex items-center">
                    <div className="mr-2">Org ID</div>
                    <CodeBlock className="text-xs text-black">
                        <Highlight attribute="org_id" hit={jobHit} />
                    </CodeBlock>
                </div>
            </div>
        </TitleComponent>
    );
}