'use client';

import { HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button, SchedulerCard, SchedulerCreateRequest, SchedulerType, toast, useCreateScheduler, useGetSchedulers } from '..';
import { CodeBlock } from './code-block';

interface InvoiceSchedulerCardProps {
    orgId: string;
}

const CronSummary: React.FC = () => {
    return (
        <div>
            <h2
                className='font-righteous flex justify-end items-center gap-2 cursor-pointer'
            >
                Understanding Cron Scheduling <HelpCircle size={16} />
            </h2>
            <div>
                Cron scheduling allows you to define specific times at which a task should be executed.
                The format consists of five fields that represent different units of time:
            </div>
            <ul className='list-disc pl-5'>
                <li>Minute (0 - 59)</li>
                <li>Hour (0 - 23)</li>
                <li>Day of the month (1 - 31)</li>
                <li>Month (1 - 12)</li>
                <li>Day of the week (0 - 6) (Sunday to Saturday)</li>
            </ul>
            <div className=''>Examples:</div>
            <ul className='list-disc pl-5'>
                <li><CodeBlock>Every Minute: * * * * *</CodeBlock></li>
                <li><CodeBlock>Every Hour: 0 * * * *</CodeBlock></li>
                <li><CodeBlock>Every Day at Midnight: 0 0 * * *</CodeBlock></li>
                <li><CodeBlock>Every Monday at Midnight: 0 0 * * 1</CodeBlock></li>
                <li className='italic'><CodeBlock>This sets the task to run at midnight on every Monday.</CodeBlock></li>
                <li><CodeBlock>1st of Every Month at Midnight: 0 0 1 * *</CodeBlock></li>
                <li className='italic'><CodeBlock>This schedules the task at midnight on the first day of every month.</CodeBlock></li>
            </ul>
            <div>Please input the schedule in the above format based on when you want the invoice to occur.</div>
        </div>
    );
};

export const InvoiceSchedulerCard: React.FC<InvoiceSchedulerCardProps> = ({ orgId }) => {
    const [schedule, setSchedule] = useState('0 10 * * 1'); // Default to run every Monday at 10 AM

    const { data: schedulers } = useGetSchedulers({ "org_id": orgId, "type": SchedulerType.INVOICE });
    const invoiceScheduler = schedulers?.[0]

    const createScheduler = useCreateScheduler({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Scheduler created successfully',
                duration: 3000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error creating scheduler: ${error}`,
                duration: 3000,
                variant: 'destructive',
            });
        }
    });

    const handleCreateScheduler = () => {
        const createRequest: SchedulerCreateRequest = {
            name: `Invoice-${orgId}`,
            http_target: {
                uri: `/lifecycle/orgs/${orgId}/invoice`,
                http_method: 'POST',
                body: JSON.stringify({})
            },
            schedule,
            time_zone: 'America/Chicago',
            org_id: orgId
        };
        createScheduler.mutate(createRequest);
    };


    return (
        <div className='flex justify-between items-start p-2 border-2 border-black rounded-lg gap-2'>
            <div className='flex flex-col justify-start items-start gap-2 w-full'>
                <h3 className='font-righteous text-2xl'>Create Invoice Scheduler</h3>
                <SchedulerCard
                    scheduler={invoiceScheduler}
                    onScheduleChange={(schedule: string) => setSchedule(schedule)}
                />
                <Button variant="default" onClick={handleCreateScheduler}>Create Scheduler</Button>
            </div>
            <div className='flex flex-col justify-start items-start w-3/4'>
                <CronSummary />
            </div>
        </div>
    );
};