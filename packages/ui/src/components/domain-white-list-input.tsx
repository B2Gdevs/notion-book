'use client'

import { AlertCircleIcon, CheckCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Org } from '../models/orgModels';
import { AllowListIdentifier } from '../clients/clerkClient';
import { useAddToAllowlist, useDeleteFromAllowList, useGetAllowList } from '../hooks/integrations/clerkHooks';
import { useGetOrgsByQuery, useUpdateOrg } from '../hooks/orgHooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { ConfirmationDialog } from './confirmation-dialog';

interface Identifier {
    id: number;
    value: string;
}

interface DomainWhitelistInputProps {
    inBastion?: boolean;
    className?: string;
}

export const DomainWhitelistInput: React.FC<DomainWhitelistInputProps> = ({ inBastion, className }) => {
    const params = useParams();
    const orgId = (params.orgId || params.id) as string;
    const [identifiers, setIdentifiers] = useState<Identifier[]>([]);
    const [currentInput, setCurrentInput] = useState<string>('');
    const [org, setOrg] = useState<Org>(); // Adjust the type based on your Org model
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [identifierToDelete, setIdentifierToDelete] = useState<Identifier | null>(null);

    const excludedDomains = [
        "yahoo.com", "hotmail.com", "outlook.com", "live.com",
        "icloud.com", "aol.com", "zoho.com", "mail.com"
    ];

    const { data: allowList } = useGetAllowList();
    const addMutation = useAddToAllowlist({});
    const deleteMutation = useDeleteFromAllowList({});
    const updateOrgMutation = useUpdateOrg({});
    const { toast } = useToast();



    // Landmark: Fetch organization data based on inBastion flag
    const { data: orgsData } = useGetOrgsByQuery({
        orgIds: inBastion && orgId ? [orgId] : undefined,
        externalId: !inBastion && orgId ? orgId : undefined,
    });

    useEffect(() => {
        if (orgsData && orgsData.length > 0) {
            const fetchedOrg = orgsData[0];
            setOrg(fetchedOrg);
            const fetchedIdentifiers = fetchedOrg?.white_listed_domains?.map((domain, idx) => ({
                id: idx,
                value: domain,
            }));
            setIdentifiers(fetchedIdentifiers ?? []);
        }
    }, [orgsData]);

    const openConfirmationDialog = (identifier: Identifier) => {
        setIdentifierToDelete(identifier);
        setIsDialogOpen(true);
    };

    // Function to handle the deletion after confirmation
    const handleDeleteConfirmed = () => {
        if (identifierToDelete) {
            handleRemoveIdentifier(identifierToDelete.id);
        }
        setIsDialogOpen(false);
        setIdentifierToDelete(null);
    };

    const validateIdentifier = (identifier: string) => {
        const isValidFormat = true

        // Extract domain and local part from identifier
        const [localPart, domain] = identifier.split('@');

        if (!domain || !localPart) {
            toast({
                title: 'Invalid identifier.',
                description: 'Please enter a valid email address.',
                duration: 5000,
            });
            return false;
        }

        if (localPart === '*' && domain === 'gmail.com') {
            toast({
                title: 'Wildcard not allowed for gmail.com.',
                description: 'You cannot add wildcard email addresses.',
                duration: 5000,
            });
            return false;
        }

        if (isValidFormat && excludedDomains.includes(domain ?? '')) {
            toast({
                title: 'Domain not allowed.',
                description: `${domain} is not permitted.`,
                duration: 5000,
            });
            return false;
        }

        return isValidFormat;
    };

    const handleAddToAllowList = (value: string) => {
        addMutation.mutate({ identifier: value, notify: true });
    };

    const handleRemoveFromAllowList = (value: string) => {
        deleteMutation.mutate(value);
    };

    // Landmark: Check if identifier is in Clerk's allowlist
    const isIdentifierInAllowList = (identifier: string) => {
        return allowList?.some((item: AllowListIdentifier) => item.identifier === identifier);
    };

    // Landmark: Decoupled function to update organization's whitelisted domains
    const updateOrgWithCurrentIdentifiers = (updatedIdentifiers: Identifier[]) => {
        const updatedOrg: Org = {
            ...org,
            name: org?.name || 'Default Name', // Provide a default name if org.name is undefined
            white_listed_domains: updatedIdentifiers.map(identifier => identifier.value).filter(Boolean),
            deal: org?.deal,
            distribution_list: {},
        };
        updateOrgMutation.mutate(updatedOrg, {
            onSuccess: () => {
                setOrg(updatedOrg);
                toast({
                    title: 'Success!',
                    description: 'Organization updated.',
                    duration: 2000,
                });
            },
        });
    };

    // Landmark: Add identifier to local state and Clerk's allowlist
    const handleAddIdentifier = () => {
        if (!validateIdentifier(currentInput)) {
            toast({ title: 'Invalid identifier format.', duration: 2000 });
            return;
        }
        const newIdentifier = { id: Date.now(), value: currentInput };
        setIdentifiers(prev => {
            const updatedIdentifiers = [...prev, newIdentifier];
            // Update org with the new list of identifiers
            updateOrgWithCurrentIdentifiers(updatedIdentifiers);
            return updatedIdentifiers;
        });
        addMutation.mutate({ identifier: currentInput, notify: false }, {
            onSuccess: () => {
                toast({ title: 'Identifier added to allowlist.' });
                setCurrentInput('');
            },
        });
    };

    // Landmark: Remove identifier from local state and Clerk's allowlist
    const handleRemoveIdentifier = (id: number) => {
        setIdentifiers(prev => {
            const updatedIdentifiers = prev.filter(identifier => identifier.id !== id);
            // Update org with the new list of identifiers
            updateOrgWithCurrentIdentifiers(updatedIdentifiers);
            return updatedIdentifiers;
        });
        const identifier = identifiers.find(identifier => identifier.id === id);
        if (identifier) {
            deleteMutation.mutate(identifier.value, {
                onSuccess: () => {
                    toast({ title: 'Identifier removed from allowlist.' });
                },
            });
        }
    };

    // Inside the return statement of your component
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className='flex gap-2'>
                <Input
                    className='w-full rounded'
                    type='text'
                    name='domain-whitelist'
                    id='domain-whitelist'
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder='Enter an identifier'
                />
                <Button onClick={handleAddIdentifier} className='bg-primary text-white'>
                    Add
                </Button>
            </div>
            <ul className='space-y-1'>
                {identifiers.map((identifier, index) => (
                    <li key={identifier.id} className={`flex justify-between items-center p-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                        <span className=''>{identifier.value}</span>
                        <div className='flex items-center gap-4'>
                            <Button onClick={() => openConfirmationDialog(identifier)} className='bg-red-500 text-white  py-1 px-3 rounded'>
                                Delete from Org
                            </Button>
                            {/* Adjusted layout to not put the connection status between the buttons */}

                            <Button
                                onClick={() => isIdentifierInAllowList(identifier.value) ? handleRemoveFromAllowList(identifier.value) : handleAddToAllowList(identifier.value)}
                                className={`ml-2 ${isIdentifierInAllowList(identifier.value) ? 'bg-red-500' : 'bg-green-500'} text-white  py-1 px-3 rounded`}>
                                {isIdentifierInAllowList(identifier.value) ? 'Remove from Allowlist' : 'Add to Allowlist'}
                            </Button>
                            {isIdentifierInAllowList(identifier.value) ? (
                                <>
                                    <CheckCircle color="green" />
                                    <span className='text-green-500'>Connected in Clerk</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircleIcon color="red" />
                                    <span className='text-red-500'>Not Connected in Clerk</span>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <ConfirmationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onConfirm={handleDeleteConfirmed} />
        </div>
    );
};