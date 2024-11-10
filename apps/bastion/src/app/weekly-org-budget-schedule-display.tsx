'use  client';

import React, { useEffect, useState } from 'react';
import { useGetOrgsByQuery } from 'ui';
import { Org, OrgType, BudgetSchedule, DAYS_OF_WEEK } from 'ui';
import UsersByOrgDisplay from './users-by-org-display';

export const WeeklyOrgBudgetScheduleDisplay: React.FC = () => {
    const { data: orgs, isError, isLoading } = useGetOrgsByQuery({ orgType: OrgType.RECIPIENT });
    const [dailyOrgs, setDailyOrgs] = useState<Record<string, Org[]>>({});
    const [dailyUserCounts, setDailyUserCounts] = useState<Record<string, number>>({}); // State to hold user counts

    const getColorBasedOnCount = (count: number) => {
        if (count < 50) return 'bg-red-200';
        if (count < 100) return 'bg-red-400';
        return 'bg-red-600';
    }

    const handleUserCount = (day: string, count: number) => {
        setDailyUserCounts(prevCounts => ({
            ...prevCounts,
            [day]: prevCounts[day] + count
        }));
    };

    useEffect(() => {
        // Reset user counts on component mount
        const initialCounts: Record<string, number> = {};
        DAYS_OF_WEEK.forEach(day => {
            initialCounts[day] = 0;
        });
        setDailyUserCounts(initialCounts);
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        if (orgs) {
            const excludedNames = ["Pied Piper", "Colorfull"]; // Names to exclude
            const orgsByDay: Record<string, Org[]> = {};

            DAYS_OF_WEEK.forEach(day => {
                orgsByDay[day] = orgs.filter(org => {
                    const defaultBudgetSchedule: BudgetSchedule = { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false };
                    const budgetSchedule: BudgetSchedule = org.budget_schedule || defaultBudgetSchedule;
                    const hasBudget = org.budget && org.budget.amount > 0;
                    const isNotExcluded = !excludedNames.includes(org.name);
                    const isActive = org.is_active;
                    return hasBudget && budgetSchedule[day as keyof BudgetSchedule] && isNotExcluded && isActive;
                });
            });

            setDailyOrgs(orgsByDay);
        }
    }, [orgs]);

    useEffect(() => {
        // Reset user counts whenever `dailyOrgs` changes
        const initialCounts: Record<string, number> = {};
        DAYS_OF_WEEK.forEach(day => {
            initialCounts[day] = 0;
        });
        setDailyUserCounts(initialCounts);
    }, [dailyOrgs]); // Only re-run when `dailyOrgs` changes

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading organizations.</p>;

    return (
        <div className='flex justify-center items-start gap-2 pt-2'>
            {DAYS_OF_WEEK.map(day => (
                dailyOrgs[day] && dailyOrgs[day].length > 0 && (
                    <div key={day} className={`flex flex-col justify-start items-start gap-2 ${getColorBasedOnCount(dailyUserCounts[day])} p-2 rounded-lg`}>
                        <h2 className='font-righteous text-xl'>
                            <span>{day} Users: </span>
                            <span>{dailyUserCounts[day]}</span></h2>
                        {dailyOrgs[day].map(org =>
                            <div className="flex justify-between items-start gap-1 w-full">
                                <div>{org.name}:</div>
                                <div>
                                    <UsersByOrgDisplay org={org} onUserCount={(count) => handleUserCount(day, count)} />
                                </div>
                            </div>
                        )}
                    </div>
                )
            ))}
        </div>
    );
};
