import React, { useEffect, useState } from 'react';
import { OrderStatus } from '../models/orderModels';
import Skeleton from 'react-loading-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { cn } from '..';

interface OrderStatusSelectProps {
  initialStatus?: OrderStatus;
  onChange?: (newStatus: OrderStatus) => void;
  disabled?: boolean;
  className?: string;
}

export const OrderStatusSelect: React.FC<OrderStatusSelectProps> = ({
  initialStatus,
  onChange,
  disabled,
  className
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(initialStatus || OrderStatus.NEW_ORDER);
  const isLoading = false; // Assuming there's no loading state needed for enums

  const handleStatusChange = (value: OrderStatus) => {
    if (value !== selectedStatus) {
      setSelectedStatus(value);
      onChange?.(value);
    }
  };

  useEffect(() => {
    setSelectedStatus(initialStatus || OrderStatus.NEW_ORDER);
  }, [initialStatus]);

  if (isLoading) return <Skeleton count={1} />;

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={disabled}>
      <SelectTrigger>{selectedStatus}</SelectTrigger>
      <SelectContent className={cn("max-h-48 overflow-y-auto", className)}>
        {Object.values(OrderStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};