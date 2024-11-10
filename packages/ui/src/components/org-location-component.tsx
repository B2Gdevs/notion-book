'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useUpdateOrg } from '../hooks/orgHooks';
import { ColorfullLocation, Org } from '../models/orgModels';
import { Section } from './section';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { LocationList } from './location-list';

interface OrgLocationComponentProps {
  org?: Org; // Now `org` can be undefined
}

export const OrgLocationComponent: React.FC<OrgLocationComponentProps> = ({ org }) => {
  const [localOrg, setLocalOrg] = useState<Org | undefined>(org);
  const [locationHasArea, setLocationHasArea] = useState(false);
  const [locationHasAddress, setLocationHasAddress] = useState(false);
  const [locationIsServed, setLocationIsServed] = useState(false);

  const { toast } = useToast();

  const checkIfLocationHasArea = (org: Org) => {
    const orgLocation = org.locations?.[0];
    if (!orgLocation) return false;
    const hasArea = Boolean(orgLocation.area_id);
    return hasArea;
  }

  const checkIfLocationHasAddress = (org: Org) => {
    const orgLocation = org.locations?.[0];
    if (!orgLocation) return false;
    const hasAddress = Boolean(orgLocation.address);
    return hasAddress;
  }

  const checkIfLocationIsServed = (org: Org) => {
    const orgLocation = org.locations?.[0];
    if (!orgLocation) return false;
    const isServed = Boolean(orgLocation.is_served);
    return isServed;
  }

  useEffect(() => {
    // Convert both `org` and `localOrg` to strings to check if they are different
    const orgString = JSON.stringify(org);
    const localOrgString = JSON.stringify(localOrg);

    // Only update `localOrg` if `org` has actually changed
    if (orgString !== localOrgString) {
      setLocalOrg(org);
    }

    // Check if the location has an area
    if (org) {
      setLocationHasArea(checkIfLocationHasArea(org));
    }
    // Check if the location has an address
    if (org) {
      setLocationHasAddress(checkIfLocationHasAddress(org));
    }
    // Check if the location is served
    if (org) {
      setLocationIsServed(checkIfLocationIsServed(org));
    }
  }, [org]); // Depend on `org` prop

  const updateOrgMutation = useUpdateOrg({
    onSuccess: () => {
      toast({
        title: 'Org Updated',
        description: 'Org has been updated successfully',
        duration: 3000,
      });
      // Optionally, invoke a callback here if needed
    },
    onError: (error) => {
      console.error('Error updating org:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the org',
        duration: 3000,
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!localOrg) return; // Guard clause if localOrg is undefined
    setLocalOrg((prevOrg) => prevOrg ? { ...prevOrg, [name]: value } : undefined);
  };

  const handleSubmit = async () => {
    if (!localOrg) return; // Guard clause if localOrg is undefined
    updateOrgMutation.mutate(localOrg);
  };

  const onLocationsChange = useCallback((locations: ColorfullLocation[]) => {
    setLocalOrg((prevOrg) => prevOrg ? { ...prevOrg, locations } : undefined);
  }, []);

  if (!localOrg) return <div>Loading...</div>; // Or any other placeholder for when `org` is undefined

  return (
    <Section className='p-4' title='Location Details' expanded>
      <div className='flex flex-col '>
        <div className='mb-2'>
          <Label className='block text-gray-700'>Org Name</Label>
          <Input
            type='text'
            name='name'
            value={localOrg?.name ?? ''}
            onChange={handleInputChange}
            className='p-2 mt-1 border rounded-md w-full'
            disabled={true}
          />
        </div>

        {/* New section for descriptions */}
        {(!locationHasArea || !locationHasAddress || !locationIsServed) && <div className="mb-4 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <div>Please note:</div>
          <ul className="list-disc list-inside">
            {!locationHasArea && <li>If your org's location doesn't have an assigned area, please assign it to an area to allow us to find the org in said area.</li>}
            {!locationHasAddress && <li>Please provide an address for the location to enable delivery services.</li>}
            {!locationIsServed && <li>If a location is not marked as served, please mark it so that we may serve that location.</li>}
          </ul>
        </div>}

        <LocationList
          locations={localOrg?.locations ?? []}
          onLocationsChange={onLocationsChange}
          onIsServedToggle={(index, isServed) => {
            setLocalOrg((prevOrg) => {
              if (!prevOrg) return undefined;
              return {
                ...prevOrg,
                locations: prevOrg?.locations?.map((location, i) =>
                  i === index ? { ...location, is_served: isServed } : location,
                ),
              };
            });
          }}
        />

        <div className='flex w-full justify-start '>
          <Button className='btn-primary' onClick={handleSubmit} disabled={!localOrg}>
            Save
          </Button>
        </div>
      </div>
    </Section>
  );
};

