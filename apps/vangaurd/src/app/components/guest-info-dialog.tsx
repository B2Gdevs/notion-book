'use client'

import { utcToZonedTime } from "date-fns-tz";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Share, toast, useGetDeliveryWindowById, useGetOrg } from "ui";

interface GuestInfoDialogProps {
    isDialogOpen: boolean;
    closeDialog: () => void;
    guestOrgId: string;
    share: Share,
}

const GuestInfoDialog: React.FC<GuestInfoDialogProps> = ({ isDialogOpen, closeDialog, guestOrgId, share }) => {
    const { data: org } = useGetOrg(guestOrgId);
    const { data: deliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
    const timeZone = deliveryWindow?.timezone ?? 'UTC';
    const shareDateToPass = utcToZonedTime(share?.date ?? new Date(), timeZone);
    const date = shareDateToPass.toLocaleDateString();
    const stipend = share.budget;
    return (
        <Dialog open={isDialogOpen}>
            {/* add overflow-y-auto below to scroll */}
            <DialogContent
                isSticky={true}
                className="bg-secondary-creamer-beige overflow-y-auto w-full h-fit max-h-[95vh] lg:max-h-[80vh] rounded-2xl"
            >
                <DialogHeader className='sticky top-0 z-50 bg-secondary-creamer-beige lg:pt-6 h-fit'>
                    <div className='relative w-full flex justify-center items-center lg:pb-4'>
                        <DialogTitle className='font-righteous py-4 lg:py-0'>
                            <span className='px-8 lg:px-0 text-xl lg:text-2xl'>You&apos;re invited to lunch! 🎉</span>
                        </DialogTitle>
                    </div>
                    <div className='border-b border-primary-spinach-green' />
                    <div className="flex flex-col justify-center items-center gap-2 py-2 px-12 text-center">
                        <span>
                            You have been invited by {org?.name} to join in on their lunch for {date}. You have also been given a stipend to pay for parts or all of your lunch. 🎁
                        </span>
                        <span className="text-2xl font-righteous text-primary-spinach-green">
                            ${stipend}
                        </span>
                    </div>
                    <div className='border-b border-primary-spinach-green' />
                    <form
                        className='p-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
                            const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
                            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                            const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                            const org_id = guestOrgId
                            const org_location_address = org?.locations?.[0]?.address;

                            localStorage.setItem('guestUserInfo', JSON.stringify({
                                first_name: firstName,
                                last_name: lastName,
                                email: email,
                                phone: phone,
                                org_id: org_id,
                                work_address: org_location_address,
                            }));
                            closeDialog();
                            toast({
                                title: 'Success',
                                description: 'Your information has been saved!',
                                duration: 3000,
                            });
                        }}
                    >
                        <div className='flex flex-col justify-center items-center gap-2'>

                            <div>
                                <span className="text-primary-spinach-green text-sm">
                                    We will label your meal with your full name.
                                </span>
                                <div className="flex justify-center items-center w-full gap-4">
                                    <div>
                                        <label htmlFor='firstName' className='block text-base font-righteous text-primary-almost-black'>
                                            First Name
                                        </label>
                                        <input
                                            type='text'
                                            name='firstName'
                                            id='firstName'
                                            autoComplete='given-name'
                                            required
                                            className='mt-1 block w-full px-3 py-2 border border-primary-almost-black rounded-md shadow-sm focus:outline-none focus:ring-primary-almost-black focus:border-primary-almost-black sm:text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor='lastName' className='block text-base font-righteous text-primary-almost-black'>
                                            Last Name
                                        </label>
                                        <input
                                            type='text'
                                            name='lastName'
                                            id='lastName'
                                            autoComplete='family-name'
                                            required
                                            className='mt-1 block w-full px-3 py-2 border border-primary-almost-black rounded-md shadow-sm focus:outline-none focus:ring-primary-almost-black focus:border-primary-almost-black sm:text-sm'
                                        />
                                    </div>
                                </div>
                            </div>


                            <div>
                                <span className="text-primary-spinach-green text-sm">
                                    Updates about your meal will be sent to you.
                                </span>
                                <div className="flex justify-center items-center w-full gap-4">
                                    <div>
                                        <label htmlFor='email' className='block text-base font-righteous text-primary-almost-black'>
                                            Email
                                        </label>
                                        <input
                                            type='email'
                                            name='email'
                                            id='email'
                                            autoComplete='email'
                                            required
                                            className='mt-1 block w-full px-3 py-2 border border-primary-almost-black rounded-md shadow-sm focus:outline-none focus:ring-primary-almost-black focus:border-primary-almost-black sm:text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor='phone' className='block text-base font-righteous text-primary-almost-black'>
                                            Phone
                                        </label>
                                        <input
                                            type='tel'
                                            name='phone'
                                            id='phone'
                                            autoComplete='tel'
                                            className='mt-1 block w-full px-3 py-2 border border-primary-almost-black rounded-md shadow-sm focus:outline-none focus:ring-primary-almost-black focus:border-primary-almost-black sm:text-sm'
                                        />
                                    </div>
                                </div>
                            </div>


                            <Button
                                type='submit'
                                className='bg-primary-spinach-green hover:bg-primary-cucumber-green text-primary-off-white  py-2 my-2 px-4 rounded font-righteous'
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default GuestInfoDialog;