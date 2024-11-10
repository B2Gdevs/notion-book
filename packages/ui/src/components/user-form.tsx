'use client'

import { useForm } from '@tanstack/react-form';
import { Save, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ColorfullLocation, LocationSelect, OrgGroup, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useGetOrg } from '..';
import { cn } from '../lib/utils';
import { User } from '../models/userModels';
import { OrgSelect } from './org-select';
import { PageTitleDisplay } from './page-title-display';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UserFormProps {
  onSubmit: (user: User, userType?: string) => void; // Make userType optional
  onCancel?: () => void;
  initialData?: User;
  className?: string;
  isInVangaurd?: boolean;
  orgGroup?: OrgGroup;
  excludeFields?: string[];
  disableFields?: string[];
  isUserWithoutOrg?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className,
  isInVangaurd,
  orgGroup,
  excludeFields,
  disableFields,
  isUserWithoutOrg
}) => {
  const form = useForm<User>({
    defaultValues: initialData || {
      id: '',
      clerk_id: '',
      name: '',
      cart: [],
      email: '',
      phone: '',
      org_id: '',
      work_address: '',
      stripe_account_id: '',
      first_name: '',
      last_name: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value, userType); // Pass userType along with user data, it can be undefined
      onCancel?.();
    },
  });

  const [userType, setUserType] = useState<string>('');
  const [locations, setLocations] = useState<ColorfullLocation[]>([]);
  const { data: org } = useGetOrg(form.state.values.org_id ?? '');

  useEffect(() => {
    if (org?.locations) {
      setLocations(org.locations);
    }
  }, [org]);

  return (
    <div className={cn("justify-left left-0  ", className)}>
      <PageTitleDisplay overrideTitle={"Profile Details"} />

      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className={`flex flex-col gap-2 border-black ${isInVangaurd ? '' : 'border-2'} rounded-lg p-2 mt-2 relative`}>

        {/* First Name Input */}
        {!excludeFields?.includes('first_name') && (
          <div className='flex flex-col justify-start items-start gap-1'>
            <Label htmlFor="first_name" className={`font-righteous ${isInVangaurd ? 'w-1/5' : 'w-[75px]'}`}>First Name</Label>
            <form.Field
              name="first_name"
              children={(field) => (
                <Input
                  id="first_name"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="First Name"
                  required
                  disabled={disableFields?.includes('first_name')}
                  className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
                />
              )}
            />
          </div>
        )}

        {/* Last Name Input */}
        {!excludeFields?.includes('last_name') && (
          <div className='flex flex-col justify-start items-start gap-1'>
            <Label htmlFor="last_name" className={`font-righteous ${isInVangaurd ? 'w-1/5' : 'w-[75px]'}`}>Last Name</Label>
            <form.Field
              name="last_name"
              children={(field) => (
                <Input
                  id="last_name"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Last Name"
                  required
                  disabled={disableFields?.includes('last_name')}
                  className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
                />
              )}
            />
          </div>
        )}

        {/* Email Input */}
        {!excludeFields?.includes('email') && (
          <div className='flex flex-col justify-start items-start gap-1'>
            <Label htmlFor="email" className={`font-righteous ${isInVangaurd ? 'w-1/5' : 'w-[75px]'}`}>Email</Label>
            <form.Field
              name="email"
              children={(field) => (
                <Input
                  id="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={disableFields?.includes('email')}
                  className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
                />
              )}
            />
          </div>
        )}

        {/* Phone Input */}
        {!excludeFields?.includes('phone') && (
          <div className='flex flex-col justify-start items-start gap-1'>
            <Label htmlFor="phone" className={`font-righteous ${isInVangaurd ? 'w-1/5' : 'w-[75px]'}`}>Phone</Label>
            <form.Field
              name="phone"
              children={(field) => (
                <Input
                  id="phone"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Phone"
                  disabled={disableFields?.includes('phone')}
                  className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
                />
              )}
            />
          </div>
        )}

        {/* Work Address Input */}
        {!excludeFields?.includes('work_address_select') && (
          <>
            <div className='mb-4 col-span-2 w-full '>
              <Label htmlFor="locationSelect" className="block font-righteous text-primary-almost-black mb-2">
                Please Select Work Address
              </Label>
              <LocationSelect
                initialLocationAddress={form.state.values.work_address ?? ''}
                locations={locations}
                onChange={(location: ColorfullLocation) => form.setFieldValue('work_address', location.address)}
                disabled={disableFields?.includes('work_address_select')}
                className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
              />
            </div>
          </>
        )}

        {/* Current Work Address Display */}
        {!excludeFields?.includes('work_address') && (
          <>
            <div className='mb-4 col-span-2 w-full'>
              <Label htmlFor="locationSelect" className="block font-righteous text-primary-almost-black mb-2">
                Current Work Address
              </Label>
              <div className='bg-gray-100 shadow text-primary-almost-black border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'>
                {form.state.values.work_address}
              </div>
            </div>
          </>
        )}

        {/* Organization Select and Manual Override */}
        {!excludeFields?.includes('org_select') && (
          <div className='mb-4 col-span-2 w-full '>
            <Label htmlFor="orgSelect" className="block font-righteous text-primary-almost-black mb-2">
              Org
            </Label>
            <form.Field
              name="org_id"
              children={(field) => (
                <OrgSelect
                  initialOrgId={form.state.values.org_id}
                  onChange={(org) => {
                    field.handleChange(org?.id ?? '')
                    setLocations(org?.locations ?? [])
                  }}
                  orgGroup={orgGroup}
                  disabled={disableFields?.includes('org_select')}
                  isWithoutSearchBar={isUserWithoutOrg}
                  className='border-transparent border-1 p-4 rounded-lg my-2 text-sm lg:text-base'
                />
              )}
            />
          </div>
        )}

        {/* Amount Owed Display */}
        {!excludeFields?.includes('amount_owed') && (
          <div>
            {(form.state?.values?.amount_owed ?? 0) > 0 && (
              <div className="flex flex-col items-start bg-red-100 p-2 rounded shadow mb-4">
                <div className=" text-red-600">Amount Owed for Service</div>
                <div className="text-lg text-red-800">${(form.state.values?.amount_owed ?? 0).toFixed(2)}</div>
              </div>
            )}
          </div>
        )}

        {!isInVangaurd && (
          <>
            {!excludeFields?.includes('org_id') && (
              <div className='flex space-x-2 justify-center items-center'>
                <Label htmlFor="org_id" className='w-[75px]'>Organization ID (Manual Override)</Label>
                <form.Field
                  name="org_id"
                  children={(field) => (
                    <Input
                      id="org_id"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Organization ID"
                      required
                      disabled={disableFields?.includes('org_id')}
                    />
                  )}
                />
              </div>
            )}

            {/* Clerk ID Input */}
            {!excludeFields?.includes('clerk_id') && (
              <div className='flex space-x-2 justify-center items-center'>
                <Label htmlFor="clerk_id" className='w-[75px]'>Clerk ID</Label>
                <form.Field
                  name="clerk_id"
                  children={(field) => (
                    <Input
                      id="clerk_id"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Clerk ID"
                      disabled={disableFields?.includes('clerk_id')}
                    />
                  )}
                />
              </div>
            )}

            {/* Stripe Account Input */}
            {!excludeFields?.includes('stripe_account_id') && (
              <div className='flex space-x-2 justify-center items-center'>
                <Label htmlFor="stripe_account_id" className='w-[75px]'>Stripe Account ID</Label>
                <form.Field
                  name="stripe_account_id"
                  children={(field) => (
                    <Input
                      id="stripe_account_id"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Stripe Account ID"
                      disabled={disableFields?.includes('stripe_account_id')}
                    />
                  )}
                />
              </div>
            )}

            {/* Partner Checkbox */}
            {!excludeFields?.includes('user_type') && (
              <div className='absolute top-2 right-2'>
                <Select onValueChange={setUserType}>
                  <SelectTrigger aria-label="User Type">
                    <SelectValue placeholder="Select Special User Type">{userType || "Select User Type"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {/* Need to implement logic for adding new admin user to org */}
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* Submission and Cancel Buttons */}
        <div className="flex flex-col lg:flex-row justify-end gap-4">
          <Button type="submit" className="flex items-center px-4 py-2 bg-primary-spinach-green text-white text-sm font-medium rounded-md hover:bg-primary-spinach-green-darker focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Save className="mr-2" size={16} /> {form.state.values.id ? 'Update' : 'Save'}
          </Button>

          {!isUserWithoutOrg && (
            <Button type="button" onClick={onCancel} className="flex items-center px-4 py-2 bg-secondary-pink-salmon text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <XCircle className="mr-2" size={16} /> Cancel
            </Button>
          )}
        </div>

      </form>
    </div>
  );
};

