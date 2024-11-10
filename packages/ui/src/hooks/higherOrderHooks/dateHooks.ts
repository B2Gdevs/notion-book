import { createTimezonedDateForArea } from "../../lib/dateUtils";
import { Org } from "../../models/orgModels";
import { useGetArea } from "../areaHooks";
import { useGetCurrentColorfullUser } from "../userHooks";
import { useGetOrg } from "../orgHooks";

export const useGetOrgTimeZonedDate = (org?: Org) => {
    const { data: area } = useGetArea(org?.locations?.[0]?.area_id ?? '');
    return createTimezonedDateForArea(area ?? {})
}

export const useGetCurrentUserTimeZonedDate = () => {
    const { data: user } = useGetCurrentColorfullUser();
    const { data: org } = useGetOrg(user?.org_id ?? '');
    return useGetOrgTimeZonedDate(org)
}