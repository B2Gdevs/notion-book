import { Link2 } from 'lucide-react';
import { useState } from 'react';
import { Button, ColorfullIcon, Org, TryOtterIcon, useIsAuthorized } from 'ui';
import CallbackDialog from './callback-dialog';

interface OtterIntegrationSectionProps {
    org?: Org;
}

export const OtterIntegrationSection: React.FC<OtterIntegrationSectionProps> = ({ org }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: authorizationStatus} = useIsAuthorized(org?.id || '');

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const isAuthorized = authorizationStatus?.message === 'Authorized.';

    return (
        <div className="flex flex-col text-black items-start justify-start gap-4 mb-6">
            {!isAuthorized && (
                <div className='bg-primary-light-cyan-blue p-6 rounded-2xl w-full'>
                    <div className="text-left text-base p-2 font-righteous">
                        <div>Authorization Required</div>
                    </div>
                    <div className='flex items-center justify-left gap-20'>
                        <Button
                            onClick={handleOpenDialog} className='flex text-white justify-center items-center text-xl font-righteous h-[64px]'
                            variant="default"
                            size="lg"
                        >
                            Authorize
                        </Button>
                        <div className="flex items-center justify-center space-x-4 py-4">
                            <TryOtterIcon className="fill-current text-white" size={64} />
                            <Link2 />
                            <ColorfullIcon />
                        </div>
                    </div>
                </div>
            )}

            {(isDialogOpen && org) && (
                <CallbackDialog
                    isDialogOpen={isDialogOpen}
                    handleCloseDialog={handleCloseDialog}
                    headerText={<span className='text-2xl font-righteous'>Authorization Required</span>}
                    paragraphText='Your authorization is required to continue importing data and making additional requests. Please authorize to proceed.'
                    buttonText='Authorize'
                    org={org}
                />
            )}

            {isAuthorized && (
                <Button
                    size='sm'
                    className='font-righteous rounded-xl mb-2'
                    onClick={() => {
                        handleOpenDialog();
                    }}
                >
                    Reauthorize
                </Button>
            )}
        </div>
    );
};