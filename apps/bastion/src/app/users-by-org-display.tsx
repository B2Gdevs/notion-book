import React, { useEffect, useRef, useState } from 'react';
import { Org, User, useGetUsers } from 'ui';

interface OrgUserCount {
    orgId: string;
    count: number;
}

interface UsersByOrgDisplayProps {
    org: Org;
    onUserCount: (count: number) => void;  // Callback to update total count
}

const UsersByOrgDisplay: React.FC<UsersByOrgDisplayProps> = ({ org, onUserCount }) => {
    const [orgUserCounts, setOrgUserCounts] = useState<OrgUserCount[]>([]);
    const { data: users, isLoading, isError } = useGetUsers({ orgId: org.id ?? '', pageSize: 300 }, true);
    const orgBudget = org.budget?.amount || 0;
    const previousTotalForOrg = useRef<number>();

    useEffect(() => {
        // Reset user counts on component mount
        setOrgUserCounts([]);
        onUserCount(0);
        previousTotalForOrg.current = 0; // Update the ref with the new total
    }, [])

    useEffect(() => {
        if (users) {
            const orgCounts: Record<string, number> = {};
    
            users.forEach((user: User) => {
                if (user.org_id) {
                    orgCounts[user.org_id] = (orgCounts[user.org_id] || 0) + 1;
                }
            });
    
            const countsArray: OrgUserCount[] = Object.keys(orgCounts).map(orgId => ({
                orgId: orgId,
                count: orgCounts[orgId]
            }));
    
            setOrgUserCounts(countsArray);
            const totalForOrg = countsArray.reduce((acc, curr) => acc + curr.count, 0);
    
            // Only call onUserCount if totalForOrg has changed
            if (totalForOrg !== previousTotalForOrg.current) {
                onUserCount(totalForOrg);
                previousTotalForOrg.current = totalForOrg; // Update the ref with the new total
            }
        }
    }, [users, onUserCount]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading users.</div>;

    return (
        <div>
            {orgUserCounts.map(org => (
                <div key={org.orgId} className='flex flex-col justify-start items-center gap-1 text-xs'>
                    <span className='font-righteous text-xl'>${org.count * orgBudget}</span>
                    <span>({org.count} x ${orgBudget})</span>
                </div>
            ))}
        </div>
    );
};

export default UsersByOrgDisplay;