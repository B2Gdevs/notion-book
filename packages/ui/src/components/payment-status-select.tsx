import React, { useEffect, useState } from 'react';
import { PaymentStatus } from '../models/stripeModels';
import Skeleton from 'react-loading-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { cn } from '..';


interface PaymentStatusSelectProps {
  initialStatus?: PaymentStatus;
  onChange?: (newStatus: PaymentStatus) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentStatusSelect: React.FC<PaymentStatusSelectProps> = ({
  initialStatus,
  onChange,
  disabled,
  className
}) => {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(initialStatus || PaymentStatus.UNPAID);
  const isLoading = false;

  const handleStatusChange = (value: PaymentStatus) => {
    if (value !== selectedStatus) {
      setSelectedStatus(value);
      onChange?.(value);
    }
  };

  useEffect(() => {
    setSelectedStatus(initialStatus || PaymentStatus.UNPAID);
  }, [initialStatus]);

  if (isLoading) return <Skeleton count={1} />;

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={disabled}>
      <SelectTrigger>{selectedStatus}</SelectTrigger>
      <SelectContent 
      className={cn("max-h-48 overflow-y-auto",
                    className)}>
        {Object.values(PaymentStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};