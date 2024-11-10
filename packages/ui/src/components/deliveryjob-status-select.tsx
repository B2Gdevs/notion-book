import React, { useEffect, useState } from 'react';
import { DeliveryJobStatus } from '../models/deliveryJobModels';
import Skeleton from 'react-loading-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface DeliveryJobStatusSelectProps {
  initialStatus?: DeliveryJobStatus;
  onChange?: (newStatus: DeliveryJobStatus) => void;
  disabled?: boolean;
}

export const DeliveryJobStatusSelect: React.FC<DeliveryJobStatusSelectProps> = ({
  initialStatus,
  onChange,
  disabled,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<DeliveryJobStatus>(initialStatus || DeliveryJobStatus.PENDING);
  const isLoading = false; // Assuming there's no loading state needed for enums

  const handleStatusChange = (value: DeliveryJobStatus) => {
    if (value !== selectedStatus) {
      setSelectedStatus(value);
      onChange?.(value);
    }
  };

  useEffect(() => {
    setSelectedStatus(initialStatus || DeliveryJobStatus.PENDING);
  }, [initialStatus]);

  if (isLoading) return <Skeleton count={1} />;

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={disabled}>
      <SelectTrigger>{selectedStatus}</SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {Object.values(DeliveryJobStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};