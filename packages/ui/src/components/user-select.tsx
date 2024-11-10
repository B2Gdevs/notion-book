'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetUsers } from '../hooks/userHooks';
import { User } from '../models/userModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface UserSelectProps {
  onChange?: (selectedUser: User) => void;
  initialUserId?: string;
  disabled?: boolean;
  usersToFilterOut?: string[];
}

export const UserSelect: React.FC<UserSelectProps> = ({
  onChange,
  initialUserId,
  disabled,
  usersToFilterOut = [],
}) => {
//   const {data:initialUser} = useGetUser(initialUserId ?? '')
  const { data: users, isLoading } = useGetUsers({
    page: 1,
    pageSize: 1000,
  });
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || '');
  const selectedUserIdRef = useRef(selectedUserId);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  // Update selectedUserId when initialUserId changes
  useEffect(() => {
    setSelectedUserId(initialUserId || '');
  }, [initialUserId]);

  const handleSelectionChange = (value: string) => {
    if (value !== selectedUserIdRef.current) {
      setSelectedUserId(value);
      const selectedUser = users?.find((user) => user.id === value);
      if (selectedUser) {
        onChange?.(selectedUser);
      }
    }
  };

  const filteredUsers = users?.filter(user => !usersToFilterOut.includes(user?.id ?? ''));

  if (isLoading) return <Skeleton count={5} />;

  return (
    <Select value={selectedUserId} onValueChange={handleSelectionChange} disabled={disabled}>
      <SelectTrigger>
        {filteredUsers?.find((user) => user.id === selectedUserId)?.name || 'Select a User...'}
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {filteredUsers?.map((user) => (
          <SelectItem key={user.id} value={user?.id ?? ''}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};