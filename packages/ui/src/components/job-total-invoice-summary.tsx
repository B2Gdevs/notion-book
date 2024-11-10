'use client'

import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, DeliveryJob, Org, calculateInvoiceSummary, useUpdateDeliveryJob, useUpdateDeliveryJobTotal } from '..';
import { DeliveryJobTotal } from '../models/totalModels';
import { DualColumnLayout } from './dual-column-layout';
import { SummaryItemProps } from './summary-section';

interface JobTotalSummaryProps {
    jobTotal: DeliveryJobTotal;
    org: Org;
    job?: DeliveryJob
}

export const JobTotalInvoiceSummary: React.FC<JobTotalSummaryProps> = ({ jobTotal, org, job }) => {
    const router = useRouter();
    const [deliveryFee, setDeliveryFee] = useState(jobTotal?.delivery_fee ?? 0);

    const updateJobTotalMutation = useUpdateDeliveryJobTotal({
        onSuccess: () => {
        },
        onError: (error) => {
            console.error('Error updating job total:', error);
        }
    })

    // smae mutation but for a delivery job
    const updateDeliveryJobMutation = useUpdateDeliveryJob({
        onSuccess: () => {
        },
        onError: (error) => {
            console.error('Error updating delivery job:', error);
        }

    })


    const handleUpdateJobTotalDeliveryFee = (deliveryFee: number) => {
        const updatedJobTotal = { ...jobTotal };
        updatedJobTotal.delivery_fee = deliveryFee;
        updateJobTotalMutation.mutate({
            deliveryJobTotalId: jobTotal?.id ?? '',
            deliveryJobTotalData: updatedJobTotal
        });

        if (!job) return;
        
        const updatedJob = { ...job };
        updatedJob.delivery_fee = deliveryFee;
        updateDeliveryJobMutation.mutate({
            deliveryJobId: job?.id ?? '',
            deliveryJobData: updatedJob
        });
    }


    const debouncedHandleUpdateJobTotalDeliveryFee = debounce(handleUpdateJobTotalDeliveryFee, 500);

    const handleDeliveryFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDeliveryFee = event.target.value;
        if (newDeliveryFee === '') {
            setDeliveryFee(0);
            debouncedHandleUpdateJobTotalDeliveryFee(0);
        } else {
            const parsedDeliveryFee = parseFloat(newDeliveryFee);
            if (!isNaN(parsedDeliveryFee)) {
                setDeliveryFee(parsedDeliveryFee);
                debouncedHandleUpdateJobTotalDeliveryFee(parsedDeliveryFee);
            }
        }
    }

    const calculatePotentialStipend = () => {
        const potential = (org?.budget?.amount ?? 0) * (jobTotal?.num_orders ?? 0);
        return potential.toFixed(2);
    };

    const caclulateActualStipendSpend = () => {
        const amount = jobTotal.subsidy_total ?? 0;
        return amount.toFixed(2);
    };


    const calculateUserSpendTotal = () => {
        return (jobTotal?.user_spend_total ?? 0).toFixed(2);
    };


    if (!jobTotal) return (
        <div className='flex items-center justify-center h-screen text-2xl  text-red-500'>
            No job total available.
        </div>
    );


    const {
        taxTotal,
        taxRate,
        sumDeliveryFeesTotal,
        sumOfDeliveryFeeTaxes,
        subsidyTotal,
        sumOfUserTotals,
        sumOfUnder50Overages } = calculateInvoiceSummary(jobTotal ? [jobTotal] : []);

    const salesTax = (taxTotal - (parseFloat(sumOfDeliveryFeeTaxes?.toFixed(2) ?? '0'))).toFixed(2)

    const leftColumnItems: SummaryItemProps[] = [
        {
            title: "Subsidy Total:",
            value: `$${(subsidyTotal + sumOfUnder50Overages).toFixed(2)}`,
            description: "The total amount of subsidies provided."
        },
        {
            title: "Delivery Fees:",
            value: `$${sumDeliveryFeesTotal?.toFixed(2)}`,
            description: "Total delivery fees charged."
        },
        {
            title: "Delivery Service Tax:",
            value: `$${sumOfDeliveryFeeTaxes?.toFixed(2)}`,
            description: "Total taxes of the service."
        },
        {
            title: "Sales Tax:",
            value: `$${salesTax}`,
            description: "Total taxes of the service."
        },
        {
            title: "Tax Total (Sales+Service):",
            value: `$${taxTotal?.toFixed(2)}`,
            description: "Total tax amount charged."
        },
        {
            title: "Org Total To Pay (Tax Total + Delivery Fee + Stipend + {under 50 cent stripe charges}):",
            value: `$${(sumOfDeliveryFeeTaxes + sumDeliveryFeesTotal + subsidyTotal + sumOfUnder50Overages)?.toFixed(2)}`,
            description: "Total amount the organization needs to pay."
        },
        {
            title: "Users Total To Pay:",
            value: `$${sumOfUserTotals.toFixed(2)}`,
            description: "Total amount all users need to pay."
        },
        {
            title: "Total under 50 cent stripe charges Org:",
            value: `$${sumOfUnder50Overages.toFixed(2)}`,
            description: "Total amount all users and organization needs to pay."
        }
    ];


    const rightColumnSummaryItems: SummaryItemProps[] = [
        {
            title: "Subsidized Amount (Actual Spend):",
            value: caclulateActualStipendSpend(),
            description: "The amount the org subsidized for the job"
        },
        {
            title: "Stipend/Subsidy (Potential Spend):",
            value: calculatePotentialStipend(),
            description: "The amount of subsidy spend that could have happened if all users used their full stipend"
        },
        {
            title: "User (Overages):",
            value: calculateUserSpendTotal(),
            description: "Calculated as (orders with user amounts owed) * (the respective amounts)"
        },
        {
            title: "Tax Rate:",
            description: "The applicable tax rate.",
            valueComponent: (
                <motion.div
                    className="p-2 rounded-md text-white text-lg "
                    animate={{ boxShadow: "0 0 10px 5px #00ff00" }}
                    transition={{ yoyo: Infinity, duration: 1 }}
                >
                    {`%${taxRate}`}
                </motion.div>
            )
        },
        {
            title: "Delivery Fee:",
            description: "The delivery fee for this job.",
            valueComponent: (
                <input
                    type="number"
                    value={deliveryFee}
                    onChange={handleDeliveryFeeChange}
                    className="p-2 rounded-md text-black text-lg "
                />
            )
        },
        {
            title: "Create Invoice:",
            description: "Create an invoice for this job.",
            valueComponent: (
                <div
                    className="p-2 rounded-md text-white text-lg "
                >
                    <Button onClick={() => {
                        const jobTotalIds = Array.isArray(jobTotal.id) ? jobTotal.id.join(',') : jobTotal.id;
                        router.push(`/invoicing?jobTotalIds=${jobTotalIds}`);
                    }}>
                        Go to Invoice
                    </Button>
                </div>
            )
        }
    ];

    return (
        <DualColumnLayout
            leftTitle="Invoice Summaries"
            leftColumnSummaryItems={leftColumnItems}
            rightColumnSummaryItems={rightColumnSummaryItems}
        />
    );
};