'use client'

import { useSession } from '@clerk/nextjs';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import TimezoneSelect, { ITimezone } from 'react-timezone-select';
import { Area, AreaClient, Button, Input, JWT_TEMPLATE, Label } from 'ui';

interface AreaCreateUpdateProps {
  setSelectedArea: (area: Area) => void;
  onCreated?: (area: Area) => void;
  initialArea?: Area;
}

export const AreaCreateUpdate: React.FC<AreaCreateUpdateProps> = ({
  initialArea,
  setSelectedArea,
}) => {
  const defaultFormData = {
    name: '',
    description: '',
    id: undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to the user's current timezone
  };
  const session = useSession()?.session

  const [formData, setFormData] = useState<Area>(
    initialArea ?? defaultFormData,
  );

  // Adjusted to handle ITimezone being either an object or a string
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
    value: formData.timezone ?? '',
    label: formData.timezone ?? '',
  });

  // Type guard to check if selectedTimezone is ITimezoneOption
  const isITimezoneOption = (timezone: ITimezone): timezone is { value: string; label: string } => {
    return typeof timezone === 'object' && 'value' in timezone;
  };

  const handleSubmit = async () => {
    let result;
    // Ensure formData includes the selected timezone
    const timezoneValue = isITimezoneOption(selectedTimezone) ? selectedTimezone.value : '';
    const updatedFormData = { ...formData, timezone: timezoneValue };
    const token = await session?.getToken({ template: JWT_TEMPLATE });
    if (updatedFormData.id) {
      result = await AreaClient.updateArea(updatedFormData.id, updatedFormData, token ?? '');
    } else {
      result = await AreaClient.createArea(updatedFormData, token ?? '');
    }
    setSelectedArea(result);
  };


  return (
    <div className='grid grid-cols-2 gap-4 bg-gray-100 text-black p-4 rounded mt-4 border-2 border-black'>
      <div className='col-span-2 flex justify-between'>
        <Button
          onClick={handleSubmit}
          className='flex  b border-black border-2 rounded-lg'
        >
          {formData.id ? <><RefreshCw className='mr-2' /> Update Area</> : <><PlusCircle className='mr-2' /> Create New Area</>}
        </Button>
      </div>
  
      <div className='col-span-2 grid grid-cols-3 space-y-2 items-center'>
        <Label className='col-span-1 '>
           Select Timezone:
        </Label>
        <div className='col-span-2 flex items-center'>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
            className="bg-white p-2 rounded border-2 border-black" // Adjust width here
          />
        </div>
  
        <Label className='col-span-1'>
          Name:
        </Label>
        <div className='col-span-2 flex items-center'>
          <Input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Enter name here...'
            className='block w-full mt-1 bg-white p-2 rounded border-2 border-black'
          />
        </div>
      </div>
    </div>
  );
};