'use client'
import { Download, Save, Upload, User as UserIcon } from 'lucide-react';
import Papa from 'papaparse';
import React, { useState } from 'react';
import { Progress, cn } from '..';
import { useCreateColorfullUsers } from '../hooks/userHooks';
import { User } from '../models/userModels';
import { CodeBlock } from './code-block';
import { ConfirmationDialog } from './confirmation-dialog';
import { Button } from './ui/button'; // Ensure this is your custom Button component
import { toast } from './ui/use-toast';
import { NotificationsDialog } from './notifications-dialog';

interface CsvUserRow {
    'First Name'?: string;
    'Last Name'?: string;
    'Email Address': string;
    'Phone Number'?: string;
}

interface UserCsvImporterProps {
    orgId?: string;
    className?: string;
}

export const UserCsvImporter: React.FC<UserCsvImporterProps> = ({
    orgId,
    className
}) => {
    const [parsedUsers, setParsedUsers] = useState<User[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [csvError, setCsvError] = useState<any>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const { mutate: createUsers, progress, isLoading } = useCreateColorfullUsers({
        onSuccess: () => {
            toast({
                title: 'Users imported successfully',
                duration: 3000,
            });
            setParsedUsers([]); // Clear parsed users after successful import
            setFileUploaded(false); // Reset file uploaded state
        },
        onError: (error: any) => {
            toast({
                title: 'Failed to import users',
                duration: 3000,
            });
            console.error("Error importing users:", error);
        },
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFileName(file.name);
            Papa.parse<CsvUserRow>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const expectedHeaders = ['First Name', 'Last Name', 'Email Address', 'Phone Number'];
                    const headers = result.meta.fields ?? [];
                    if (!expectedHeaders.every(header => headers.includes(header))) {
                        const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
                        const unexpectedHeaders = headers.filter(header => !expectedHeaders.includes(header));
                        const errorMessage = (
                            <>
                                Invalid CSV format.
                                Missing headers: {missingHeaders.map((header, index) => <><CodeBlock className="text-green-500">{header}</CodeBlock>{index !== missingHeaders.length - 1 && ','}</>)}.
                                Unexpected headers: {unexpectedHeaders.map((header, index) => <><CodeBlock className="text-red-500">{header}</CodeBlock>{index !== unexpectedHeaders.length - 1 && ','}</>)}.
                                Please ensure the headers are correct.
                            </>
                        );
                        setCsvError(errorMessage);
                        toast({
                            title: 'Invalid CSV format',
                            description: errorMessage,
                            duration: 3000,
                            variant: 'destructive'
                        });
                        return;
                    }

                    const users = result.data.map(row => ({
                        first_name: row['First Name'] ?? '',
                        last_name: row['Last Name'] ?? '',
                        email: row['Email Address'],
                        phone: row['Phone Number'] ?? '',
                        org_id: orgId ?? '', // Add orgId to each user
                    })).filter(user => user.email); // Ensure each user has an email

                    setParsedUsers(users as User[]);
                    setFileUploaded(true); // Set file uploaded state to true
                    setCsvError(null); // Reset CSV error state
                },
            });
        }
        event.target.value = ''; // Reset the file input after each upload
    };

    const handleSave = () => {
        setIsDialogOpen(true);
    };

    const confirmSave = () => {
        createUsers(parsedUsers);
        setIsDialogOpen(false);
    };

    const handleDownloadSample = () => {
        const sampleData = "First Name,Last Name,Email Address,Phone Number\nJohn,Doe,johndoe@example.com,111-555-0100";
        const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'sample_users.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className={cn('rounded-lg w-full', className)}>
            {csvError && <div className="text-red-500">{csvError}</div>}

            <div className='flex p-2 m-2 border border-black rounded-lg justify-between w-full'>
                <div className='flex items-center space-x-4'>
                    <input
                        id="file-upload"
                        className='cursor-pointer hidden'
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                        <Upload className="mr-2" size={16} />
                        <span>{uploadedFileName || 'Click to upload a file'}</span>
                    </label>
                    <div className='flex justify-center items-center'>
                        <UserIcon className='mr-2' />
                        <span>{parsedUsers.length}</span>
                    </div>
                </div>

                {fileUploaded ? (
                    isLoading ? (
                        <div className='flex-col w-full items-center justify-center space-x-4'>
                            <div className='text-sm ml-4'>Saving Users...</div>
                            <div className="overflow-x-hidden w-1/2">
                                <Progress value={progress} className="h-2" />
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleSave} style={{ marginLeft: '10px' }}>
                            <Save className="mr-2" size={16} /> Save
                        </Button>
                    )
                ) : (
                    <Button onClick={handleDownloadSample} style={{ marginLeft: '10px' }}>
                        <Download className="mr-2" size={16} /> Download Sample
                    </Button>
                )}
                <ConfirmationDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onConfirm={confirmSave}
                    message="Are you sure you want to import these users?"
                >
                    <NotificationsDialog />
                </ConfirmationDialog>
            </div>
        </div>
    );
};