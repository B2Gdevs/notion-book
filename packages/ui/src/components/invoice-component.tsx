'use client'

import { PDFViewer } from '@react-pdf/renderer';
import { subDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { BagLoader, Button, CardBody, CardContainer, CardItem, DeliveryJobTotal, InvoiceSelections, JobTotalInvoicePDFDocument, MetricsBento, Org, PageTitleDisplay, PaymentStatus, SelectedDateRange, SkeletonFour, calculateInvoiceSummary, toast, useCreateInvoice, useGetDeliveryJobTotals, useGetOrgsByQuery } from '..';

interface InvoiceComponentProps {
    initialOrgId?: string; // Optional initial org ID for InvoicePage
    canCharge?: boolean;
    onOrgChange?: (org: Org) => void;
    jobTotalIds?: string; // Optional job total IDs
}

export const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ initialOrgId, canCharge, onOrgChange, jobTotalIds }) => {
    const [selectedOrg, setSelectedOrg] = useState<Org | undefined>();
    const [selectedDateRange, setSelectedDateRange] = useState<SelectedDateRange>({
        start: subDays(new Date(), 7),
        end: new Date(),
    });
    const [isMobile, setIsMobile] = useState(false);

    const jobTotalsQueryParams = jobTotalIds ? { job_total_ids: jobTotalIds.split(',') } : {
        org_id: selectedOrg?.id ?? '',
        start_date: selectedDateRange.start,
        end_date: selectedDateRange.end,
        datetime_field: 'delivery_date',
        page: 1,
        page_size: 100,
    };
    const { data: jobTotals } = useGetDeliveryJobTotals(jobTotalsQueryParams);

    // all job totals passed will be for the same org since we are charging multiple jobs at a time.
    const jobTotalOrgId = jobTotals?.[0]?.org_id ?? '';
    // Fetch orgs if initialOrgId is provided

    const queryParams = initialOrgId ? { externalId: initialOrgId } : { "orgIds": [jobTotalOrgId] };
    const { data: orgs } = useGetOrgsByQuery(queryParams);
    useEffect(() => {
        if ((orgs?.length ?? 0) > 0) {
            setSelectedOrg(orgs?.[0]);
        }
    }, [initialOrgId, orgs]);

    const { mutate: createAndChargeInvoice } = useCreateInvoice({
        onSuccess: () => {
            toast({
                title: 'Invoice created!',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error creating invoice',
                description: error.message,
            });
        },
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChargeOrg = async () => {
        try {
            if (jobTotals && jobTotals.length > 0) {
                const totalIds = jobTotals.map((jobTotal: DeliveryJobTotal) => jobTotal.id).filter((id): id is string => id !== undefined);
                createAndChargeInvoice({ "job_total_ids": totalIds });
            }
        } catch (error) {
            console.error('Error charging org:', error);
        }
    };

    const handleOrgChange = (org: Org) => {
        setSelectedOrg(org);
        onOrgChange?.(org);
    }

    const {
        taxTotal,
        subsidyTotal,
        sumOfJobTotals,
        sumDeliveryFeesTotal,
        sumOfUnder50Overages
    } = calculateInvoiceSummary(jobTotals ?? []);
    const unpaidJobTotals = jobTotals?.filter((jobTotal) => jobTotal.payment_status !== PaymentStatus.PAID && jobTotal.payment_status !== PaymentStatus.TRANSFERRED);
    const { sumOfJobTotals: 
        sumOfJobTotalsUnpaid,
    sumOfUnder50Overages: sumOfUnder50OveragesUnpaid } = calculateInvoiceSummary(unpaidJobTotals ?? []);
    const amountOrgOwesUnpaid = (sumOfJobTotalsUnpaid + sumOfUnder50OveragesUnpaid)
    const items = [
        {
            title: "Your Invoice",
            description: (
                <div>
                    The total amount of deliveries, with fees and taxes to be charged! 🎉
                </div>
            ),
            header: <SkeletonFour
                firstCardText='Subsidy Total'
                secondCardText='Delivery Fees'
                thirdCardText='Tax Total'
                firstCardSubText={`${(subsidyTotal + sumOfUnder50Overages).toFixed(2)}`}
                secondCardSubText={`$${sumDeliveryFeesTotal.toFixed(2)}`}
                thirdCardSubText={`${taxTotal.toFixed(2)}`}
            />,
            className: "md:col-span-4",
        },
    ];

    return (
        <div>
            <PageTitleDisplay additionalText={selectedOrg?.name} />
            <div className={`flex justify-between mx-4 space-x-12 ${isMobile ? 'flex-col' : 'space-x-2'}`}>

                <div className='my-2'>
                    {!jobTotalIds && (
                        <>
                            <InvoiceSelections
                                canSelectOrg={!initialOrgId}
                                onSelectedOrgChange={handleOrgChange}
                                onSelectedDateRangeChange={setSelectedDateRange}
                                isMobile={isMobile}
                            />

                        </>
                    )}

                    {canCharge && (
                        <Button
                            variant="outline"
                            className="bg-black hover:bg-gray-200"
                            onClick={handleChargeOrg}
                        >
                            Charge Invoice
                        </Button>
                    )}

                    <CardContainer className="flex flex-col items-center justify-center py-2 w-full">
                        <CardBody className="bg-gray-50 dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[30rem] h-auto rounded-xl p-6 border  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] transition-all duration-200">
                            <CardItem
                                translateZ="50"
                                className="text-2xl  text-neutral-600 dark:text-white font-righteous text-center"
                            >
                                Invoicing Total
                            </CardItem>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center"
                            >
                                The total amount of deliveries, with fees and taxes.
                            </CardItem>
                            <CardItem translateZ="100" className="w-full mt-4 justify-center">
                                <div className="h-full font-righteous text-xl text-primary-almost-black/80 relative z-20 w-full sm:w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center text-center">
                                    {(sumOfJobTotals + sumOfUnder50Overages).toFixed(2)}

                                </div>
                            </CardItem>
                        </CardBody>
                    </CardContainer>

                    <div className="bg-white shadow-lg rounded-lg p-6 my-4">
                        <h2 className="text-xl  mb-2">Amount still Owed:</h2>
                        <div className={`bg-${sumOfJobTotalsUnpaid > 0 ? 'red' : 'green'}-100 border border-${amountOrgOwesUnpaid > 0 ? 'red' : 'green'}-400 text-${amountOrgOwesUnpaid > 0 ? 'red' : 'green'}-700 px-4 py-3 rounded relative`} role="alert">
                            <span className="block sm:inline font-righteous">
                                {amountOrgOwesUnpaid > 0 ? amountOrgOwesUnpaid.toFixed(2) : 'Invoice Paid!'}
                            </span>
                        </div>
                    </div>

                    <MetricsBento items={items} />


                </div>
                <div className={`${isMobile ? 'w-full mt-4' : 'my-2 w-2/3'}`}>
                    {!jobTotals ? (
                        <div className="flex justify-center items-center h-screen space-x-4 animate-pulse border-2 border-gray-500 rounded p-2">
                            <div className="flex-col space-y-16">
                                <div className="font-righteous">Loading data...</div>
                                <BagLoader />
                            </div>
                        </div>
                    ) : (
                        <PDFViewer className='m-4' style={{ width: '100%', height: isMobile ? '50vh' : '90vh' }}>
                            <JobTotalInvoicePDFDocument
                                jobTotals={jobTotals}
                                org={selectedOrg ?? ({} as Org)}
                            />
                        </PDFViewer>
                    )}
                </div>
            </div>
        </div>
    );
};