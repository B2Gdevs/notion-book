"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogPrimitive,
    StepHeader,
    TextBox,
    toast,
    useGetCurrentColorfullUser,
    useGetOrg,
    // useListPaymentMethods 
} from "..";
import { Input } from "./aceternity-ui/anim-input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useCreateShare, useDeleteShare, useGetShare } from '../hooks/shareHooks';
import { Link } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { utcToZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";

// interface CardDetails {
//     brand: string;
//     last4: string;
//     exp_month: number;
//     exp_year: number;
// }

// interface BankAccountDetails {
//     last4: string;
// }

// interface PaymentMethod {
//     id: string;
//     type: string;
//     card?: CardDetails;
//     us_bank_account?: BankAccountDetails;
// }

interface GuestInviteFormProps {
    selectedDate: Date;
    onClose?: () => void;
}

export const GuestInviteForm: React.FC<GuestInviteFormProps> = ({
    selectedDate,
    onClose,
}) => {
    const { data: user } = useGetCurrentColorfullUser();
    const [guests, setGuests] = useState<number>(5);
    const [budget, setBudget] = useState<number | null>(null);
    const [isCustomBudgetOpen, setIsCustomBudgetOpen] = useState<boolean>(false);
    const [paymentMethodId, setPaymentMethodId] = useState<string>('');
    const [customMessage, setCustomMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [submitClicked, setSubmitClicked] = useState<boolean>(false);
    const [shareId, setShareId] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const budgetAmounts = [10, 15, 20, 25, 30, 35];
    const createShareMutation = useCreateShare({
        onSuccess: (data) => {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            if (org && org.share_calendar) {
                org.share_calendar[formattedDate] = data.id;
                setShareId(data.id);
            }
            toast({
                title: 'Invitation Created',
                description: 'Your invitation link has been successfully created',
                duration: 5000,
            });
            // // Assuming the response data has the new share ID
            // setShareId(data.shareId);
        },
        onError: (error) => {
            toast({
                title: 'Error Creating Invitation',
                description: error.message,
                duration: 5000,
            });
        },
    });

    // const updateShareMutation = useUpdateShare();
    const deleteShareMutation = useDeleteShare();

    const { data: org } = useGetOrg(user?.org_id ?? '');


    // Effect to update shareId based on org and selectedDate
    useEffect(() => {
        if (org && org.share_calendar) {
            const formattedDate = selectedDate.toLocaleDateString('en-CA'); // Format date as 'YYYY-MM-DD' in local time
            const newShareId = org.share_calendar[formattedDate];
            setShareId(newShareId);
        }
    }, [org, selectedDate]);

    // Use the custom hook to fetch share data if shareId is available
    const { data: shareData, isLoading: shareDataLoading } = useGetShare(shareId ?? '');


    const handleCopyLink = async () => {
        if (shareUrl) {
            await navigator.clipboard.writeText(shareUrl);
            toast({
                title: 'Invitation Link Copied',
                description: 'Your invitation link has been successfully copied to your clipboard!',
                duration: 3000,
            });
        }
    };

    const handleCreateInvitationLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validateInputs();

        if (!errorMessage && submitClicked) {
            setIsCreating(true);  // Set loading state
            // Convert selectedDate to start of day
            const startOfSelectedDate = startOfDay(selectedDate);

            // Ensure startOfSelectedDate is in UTC
            const nowInUTC5: Date = utcToZonedTime(new Date(startOfSelectedDate), 'America/New_York'); // Convert to UTC-5 (Eastern Time)

            const newShare = {
                date: nowInUTC5,
                org_id: user?.org_id ?? '',
                guests,
                budget,
                payment_method_id: paymentMethodId,
                custom_message: customMessage,
                delivery_window_id: org?.delivery_window_id ?? '',
            };
            createShareMutation.mutate(newShare);
        }
    };

    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteShare = () => {
        if (!shareId) return;

        deleteShareMutation.mutate(shareId, {
            onSuccess: () => {
                toast({
                    title: 'Delete Successful',
                    description: 'The share has been deleted successfully.',
                    duration: 3000,
                });
                handleCloseDeleteDialog();
                setShareUrl('');
                setCustomMessage('');
                setSubmitClicked(false);
                setGuests(5);
                setBudget(null);
                onClose?.();
            },
            onError: (error) => {
                toast({
                    title: 'Delete Failed',
                    description: `Failed to delete share: ${error}`,
                    duration: 3000,
                });
                handleCloseDeleteDialog();
                onClose?.();
            },
        });
    };

    const validateInputs = () => {
        if (!submitClicked) return;
        if (!user?.org_id) {
            setErrorMessage('Organization ID is missing.');
            setIsCreating(false);
            return;
        }
        if (!selectedDate) {
            setErrorMessage('Please select a date.');
            setIsCreating(false);
            return;
        }
        if (guests <= 0) {
            setErrorMessage('Please specify the number of guests.');
            setIsCreating(false);
            return;
        }
        if (budget === null) {
            setErrorMessage('Please select a budget.');
            setIsCreating(false);
            return;
        }

        setErrorMessage('');
    };

    // Effect to validate inputs whenever dependencies change
    useEffect(() => {
        if (submitClicked) {
            validateInputs()
        }
    }, [selectedDate, guests, budget, paymentMethodId]);

    useEffect(() => {
        if (shareId) {
            const basePath = window.location.origin; // Get the base URL
            const path = `${basePath}/shares/${shareId}`; // Append the shareId to form the full URL
            setShareUrl(path);
            setLoading(false);
            // Fetch the new share data if needed or set it directly if available
            // Assuming useGetShare is a hook that refetches when shareId changes
            setGuests(shareData?.guests ?? 5);
            setBudget(shareData?.budget ?? null);
            // If shareData.budget doesn't exist within budgetAmounts, set isCustomBudgetOpen to true
            if (shareData?.budget && !budgetAmounts.includes(shareData.budget)) {
                setIsCustomBudgetOpen(true);
            }
            setPaymentMethodId(shareData?.payment_method_id ?? '');
            setCustomMessage(shareData?.custom_message ?? '');
        } else if (!shareDataLoading) {
            setShareUrl('');
            setLoading(false);
        } else {
            setShareUrl('');
        }
    }, [shareId]);

    return (
        <div className="max-w-sm lg:max-w-2xl w-full mx-auto rounded-lg rounded-2xl p-4 shadow-input bg-primary-off-white dark:bg-black">
            {
                loading ? (
                    <Skeleton width={200} height={20} />
                ) : (
                    <form className="flex flex-col justify-center items-center" onSubmit={handleCreateInvitationLink}>
                        <h2 className="flex w-full justify-center items-center font-righteous text-xl text-neutral-800 dark:text-neutral-200 mb-2">
                            Invitation for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                        <p className="text-neutral-600 text-left text-sm my-2 dark:text-neutral-300 w-full">
                            Select your budget per guest and we will create a link that you can share with your guest(s). They will see the amount of stipend that you have selected and must order within that.
                        </p>
                        <Separator className='bg-primary-spinach-green' />
                        {/* <div className={`flex justify-between items-center w-full ${Boolean(shareUrl) && 'pointer-events-none opacity-70'}`}>
                            <StepHeader
                                step="1"
                                orderPopup={true}
                                text="How many guests do you expect?"
                            />
                            <select
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className='p-1 rounded-lg'
                                disabled={Boolean(shareUrl)}
                                required
                            >
                                {[...Array(20).keys()].map((_, i) => (
                                    <option value={5 * (i + 1)} key={i}>
                                        {5 * (i + 1)}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <Separator className='bg-primary-spinach-green' />
                        <div className={`flex flex-col justify-start items-start w-full font-righteous ${Boolean(shareUrl) && 'pointer-events-none opacity-70'}`}>
                            <StepHeader
                                step="$"
                                orderPopup={true}
                                text="How much will you pay for each guest?"
                            />
                            <div className='lg:flex justify-between items-center gap-2 w-full mb-2'>
                                {budgetAmounts.map((amount, index) => (
                                    <Button
                                        key={index}
                                        className={`w-12 mr-2 lg:mr-0 my-1 lg:my-0 lg:w-16 border-2 hover:text-secondary-peach-orange ${budget === amount ? 'text-primary-off-white bg-primary-spinach-green border-transparent' : 'text-primary-spinach-green bg-primary-off-white border-primary-spinach-green'}`}
                                        onClick={() => setBudget(amount)}
                                        disabled={Boolean(shareUrl)}
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                                <Button
                                    className={`border-2 hover:text-secondary-peach-orange ${isCustomBudgetOpen ? 'text-primary-off-white bg-primary-spinach-green border-transparent' : 'text-primary-spinach-green bg-primary-off-white border-primary-spinach-green'}`}
                                    onClick={() => setIsCustomBudgetOpen(!isCustomBudgetOpen)}
                                    disabled={Boolean(shareUrl)}
                                >
                                    {isCustomBudgetOpen ? 'Close' : 'Custom'}
                                </Button>
                            </div>
                            {isCustomBudgetOpen && (
                                <Input
                                    type='number'
                                    id='custom-budget'
                                    value={budget ?? 0}
                                    min={0}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className='w-full mb-2'
                                    disabled={Boolean(shareUrl)}
                                />
                            )}

                        </div>
                        <Separator className='bg-primary-spinach-green' />
                        <div className={`w-full ${Boolean(shareUrl) && 'pointer-events-none opacity-70'}`}>
                            <TextBox
                                text={customMessage}
                                maxChars={100}
                                headerText='Custom Message'
                                placeholderText='Enjoy your lunch!'
                                onTextChange={setCustomMessage}
                            />
                        </div>

                        <Separator className='bg-primary-spinach-green' />
                        {errorMessage && (
                            <div className="text-red-500 text-sm text-center w-full mb-2">
                                {errorMessage}
                            </div>
                        )}
                        {shareData ? (
                            <>
                                <div className="flex flex-col justify-center items-center gap-2 bg-primary-lime-green p-4 my-2 rounded-lg">
                                    <span className="font-righteous">Copy and share this link</span>
                                    <div className="flex justify-center items-center gap-2">
                                        <span>{shareUrl}</span>
                                        <Link onClick={handleCopyLink} className="cursor-pointer" />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-2 bg-primary-spinach-green-lighter p-4 my-2 rounded-lg">
                                    <span className="font-righteous">Need to cancel this link?</span>
                                    <div className="flex justify-center items-center gap-2">
                                        <span className='bg-primary-spinach-green p-2 rounded-lg text-white cursor-pointer' onClick={handleOpenDeleteDialog}>Delete</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Button
                                className="font-righteous my-2"
                                type="submit"
                                onClick={() => setSubmitClicked(true)}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Generating Your Unique Link...' : 'Create Invitation Link'}
                            </Button>)}
                        <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
                            <DialogContent className="bg-transparent overflow-y-auto max-h-[100vh] w-full border-none shadow-none" isSticky={true}>
                                <div className="bg-primary-off-white p-4 flex flex-col justify-center items-center gap-4 text-center">
                                    <span className='text-2xl'>Are you sure you want to delete this share link?</span>
                                    <span className='italic'>This will delete all orders that have been placed by guests who have used this link. This action cannot be undone.</span>
                                    <div className='flex justify-center items-center gap-2'>
                                        <Button
                                            className='font-righteous'
                                            onClick={() => handleDeleteShare()}>
                                            Yes, Delete Share
                                        </Button>
                                        <DialogPrimitive.Close
                                            className='ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                                            onClick={handleCloseDeleteDialog}
                                        >
                                            <Button className='font-righteous' variant='destructive'>No, Go Back</Button>
                                            <span className='sr-only'>Close</span>
                                        </DialogPrimitive.Close>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </form>
                )
            }
        </div>
    );
}