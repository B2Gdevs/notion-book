'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetOrgGroups } from '../hooks/orgGroupHooks';
import { OrgGroup } from '../models/orgModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface OrgGroupSelectProps {
  onChange?: (selectedOrgGroup: OrgGroup) => void;
  initialOrgGroupId?: string;
  disabled?: boolean;
}

export const OrgGroupSelect: React.FC<OrgGroupSelectProps> = ({
  onChange,
  initialOrgGroupId,
  disabled,
}) => {
  const { data: orgGroups, isLoading } = useGetOrgGroups({
    page: 1,
    pageSize: 100,
  });
  const [selectedOrgGroupId, setSelectedOrgGroupId] = useState<string>(initialOrgGroupId || '');
  const selectedOrgGroupIdRef = useRef(selectedOrgGroupId);

  useEffect(() => {
    selectedOrgGroupIdRef.current = selectedOrgGroupId;
  }, [selectedOrgGroupId]);

  // Update selectedOrgGroupId when initialOrgGroupId changes
  useEffect(() => {
    setSelectedOrgGroupId(initialOrgGroupId || '');
  }, [initialOrgGroupId]);

  const handleSelectionChange = (value: string) => {
    if (value !== selectedOrgGroupIdRef.current) {
      setSelectedOrgGroupId(value);
      const selectedOrgGroup = orgGroups?.find((orgGroup) => orgGroup.id === value);
      if (selectedOrgGroup) {
        onChange?.(selectedOrgGroup);
      }
    }
  };

  if (isLoading) return <Skeleton count={5} />;

  return (
    <Select value={selectedOrgGroupId} onValueChange={handleSelectionChange} disabled={disabled}>
      <SelectTrigger>
        {orgGroups?.find((orgGroup) => orgGroup.id === selectedOrgGroupId)?.name || 'Select an Org Group...'}
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {orgGroups?.map((orgGroup) => (
          <SelectItem key={orgGroup.id} value={orgGroup?.id ?? ''}>
            {orgGroup.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};