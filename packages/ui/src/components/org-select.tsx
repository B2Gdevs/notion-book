'use client';

import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetOrgsByQuery } from '../hooks/orgHooks';
import { Org, OrgGroup, OrgType } from '../models/orgModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface OrgSelectProps {
  onChange?: (selectedOrg: Org) => void;
  initialOrgId?: string;
  orgType?: OrgType;
  disabled?: boolean;
  orgsToFilterOut?: string[];
  orgTypeFilterOut?: OrgType;
  orgGroup?: OrgGroup;
  isWithoutSearchBar?: boolean;
  className?: string;
  selectTriggerTextOverride?: string; // Add selectTriggerTextOverride prop
  override?: boolean;
  orgs?: Org[]; // New prop to accept an array of organizations directly
}

export const OrgSelect: React.FC<OrgSelectProps> = ({
  onChange,
  initialOrgId,
  orgType,
  disabled,
  orgsToFilterOut = [],
  orgTypeFilterOut,
  orgGroup,
  isWithoutSearchBar,
  className,
  selectTriggerTextOverride,
  override = false,
  orgs
}) => {

  let orgIds = orgGroup ? orgGroup.org_ids : [initialOrgId ?? ''];
  if (override){
    orgIds = [];

  }
  let { data: fetchedOrgs, isLoading } = useGetOrgsByQuery({
    page: 1,
    pageSize: 1000,
    orgIds: orgIds,
    sortBy: 'name',
    sortDirection: 'asc',
  }, {}, !Boolean((orgs?.length ?? 0) > 0));
  fetchedOrgs = orgs ?? fetchedOrgs;


  const [selectedOrgId, setSelectedOrgId] = useState<string>(initialOrgId || '');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedOrgId(initialOrgId || '');
  }, [initialOrgId]);

  const handleSelectionChange = (value: string) => {
    setSelectedOrgId(value);
    // Ensure fetchedOrgs is defined and not null before attempting to find an org
    if (fetchedOrgs) {
      const selectedOrg = fetchedOrgs.find((org) => org.id === value);
      if (selectedOrg) {
        onChange?.(selectedOrg);
      }
    } 
  };

  const getFilteredOrgs = () => {
    return fetchedOrgs?.filter(org => {
      return (!orgsToFilterOut.includes(org?.id ?? '')) &&
             (!orgTypeFilterOut || org.org_type !== orgTypeFilterOut) &&
             (!orgType || org.org_type === orgType);
    });
  };

  const searchResults = searchTerm ? new Fuse(getFilteredOrgs() || [], {
    keys: ['name'],
    includeScore: true,
    threshold: 0.3,
  }).search(searchTerm).map(result => result.item) : getFilteredOrgs();

  const placeholderText = orgType ? `Select a ${orgType.replace('_', ' ')}...` : 'Select an Organization...';

  if (isLoading) return <Skeleton count={1} />;

  return (
    <Select
      value={selectedOrgId}
      onValueChange={handleSelectionChange}
      disabled={disabled}>
      <SelectTrigger className={className}>
        {fetchedOrgs?.find(org => org.id === selectedOrgId)?.name || (selectTriggerTextOverride ? selectTriggerTextOverride : placeholderText)}
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {!isWithoutSearchBar && (
          <div className="p-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Search organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        {searchResults?.map((org) => (
          <SelectItem
            key={org.id}
            value={org?.id ?? ''}
            className="p-2 hover:bg-gray-100">
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};