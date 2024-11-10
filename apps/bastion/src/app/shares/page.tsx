'use client';

import { SharesTable, useGetArea, useGetCurrentColorfullUser, useGetOrgsByIds } from "ui";

export default function SharePage() {

    const { data: user } = useGetCurrentColorfullUser();
    // Get associated Org from user
    const orgsResult = useGetOrgsByIds([user?.org_id ?? '']);
    const org = orgsResult.data?.[0];
    const areaId = org?.locations?.[0]?.area_id;
    const { data: area } = useGetArea(areaId ?? '');
    const areaTimezone = area?.timezone || 'America/Chicago'; // Default to 'America/Chicago' if timezone is undefined
    return (
        <div>
            <SharesTable
                timezone={areaTimezone}
            />
        </div>
    );
}
