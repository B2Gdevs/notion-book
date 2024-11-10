'use client'

import { endOfDay, startOfDay } from 'date-fns';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { DatePicker, MonthPicker, Org, OrgSelect, RadioGroup, RadioGroupItem, Separator, WeekPicker } from '..';
import { Label } from './ui/label';

export interface SelectedDateRange{
    start: Date;
    end: Date;
}

interface InvoiceSelectionsProps {
    isMobile: boolean;
    canSelectOrg?: boolean;
    onSelectedOrgChange: (org: Org) => void;
    onSelectedDateRangeChange?: (range: SelectedDateRange) => void;

    // Adjusting for a single date selection
}

export const InvoiceSelections: React.FC<InvoiceSelectionsProps> = ({
    canSelectOrg = false,
    onSelectedOrgChange,
    onSelectedDateRangeChange
}) => {
    // Local state for the single date selection
    const [selectedDateRange, setSelectedDateRange] = useState<SelectedDateRange>();
    const [invoicePeriod, setInvoicePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const handleInvoicePeriodChange = debounce((value: string) => {
        setInvoicePeriod(value as 'daily' | 'weekly' | 'monthly');
    }, 300); // Adjust the delay as needed
    

    return (
        <div className={`flex-col m-2 space-y-2 w-full`}>
            {canSelectOrg && (
                <>
                    <div className='flex justify-between'>
                        <Label className="text-primary-spinach-green font-righteous text-lg">Select an Organization</Label>
                        <OrgSelect onChange={(newlySelectedOrg: Org) => onSelectedOrgChange?.(newlySelectedOrg)} />
                    </div>
                    <Separator />
                </>
            )}

            <div className='flex justify-between'>
                <Label className="text-primary-spinach-green font-righteous text-lg">Select Period</Label>
                <RadioGroup
    className='flex'
    value={invoicePeriod}
    onValueChange={handleInvoicePeriodChange}
>
                    <RadioGroupItem value='daily' className='bg-primary-spinach-green disabled:opacity-50' />
                    <Label className="text-primary-spinach-green font-righteous">Daily</Label>
                    <RadioGroupItem value='weekly' className='bg-primary-spinach-green disabled:opacity-50' />
                    <Label className="text-primary-spinach-green font-righteous">Weekly</Label>
                    <RadioGroupItem value='monthly' className='bg-primary-spinach-green disabled:opacity-50' />
                    <Label className="text-primary-spinach-green font-righteous">Monthly</Label>
                </RadioGroup>
            </div>
            <Separator />

            {/* Conditionally render DatePicker for daily selection */}
            {invoicePeriod === 'daily' && (
                <>
                    <div className='flex justify-between'>
                        <Label className="text-primary-spinach-green font-righteous text-lg">Select Day</Label>
                        <DatePicker
                            selectedDate={selectedDateRange?.start}
                            onSelect={(date) => {
                                const start = startOfDay(date);
                                const end = endOfDay(date);
                                if (!selectedDateRange || selectedDateRange.start !== start || selectedDateRange.end !== end) {
                                    setSelectedDateRange({ start, end });
                                    onSelectedDateRangeChange?.({ start, end });
                                }
                            }}
                            className='text-black'
                        />
                    </div>
                    <Separator />
                </>
            )}

            {/* Keep existing selectors for weekly and monthly, adjust as needed */}
            {invoicePeriod === 'weekly' && (
                <div className='flex justify-between'>
                    <Label className="text-primary-spinach-green font-righteous text-lg">Select Week</Label>
                    <WeekPicker onSelect={(dateRange) => {
                        setSelectedDateRange(dateRange);
                        onSelectedDateRangeChange?.(dateRange);
                    }} />
                    {/* <div>Week Picker</div> */}
                </div>
            )}
            {invoicePeriod === 'monthly' && (
                <div className='flex justify-between'>
                    <Label className="text-primary-spinach-green font-righteous text-lg">Select Month</Label>
                    <MonthPicker selectedMonth={selectedDateRange} onSelect={(dateRange) => {
                        setSelectedDateRange(dateRange);
                        onSelectedDateRangeChange?.(dateRange);
                    
                    }} />
                </div>
            )}
            {invoicePeriod !== 'daily' && <Separator />}
        </div>
    );
};