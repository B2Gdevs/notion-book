'use client'

import React, { useState } from 'react';
import { DayOfWeek, SpecialHourType, StoreHoursConfiguration, StorefrontRegularHours, StorefrontSpecialHours } from '../models/hoursModels';
import { Collapsible } from './collapsible';
import { RegularHoursInput } from './regular-hours-input';
import { SpecialHoursInput } from './special-hours-input';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface StoreHoursConfigurationInputProps {
  initialConfiguration: StoreHoursConfiguration;
  onChange: (updatedConfiguration: StoreHoursConfiguration) => void;
}


// StoreHoursConfigurationInput Component
export const StoreHoursConfigurationInput: React.FC<StoreHoursConfigurationInputProps> = ({
  initialConfiguration,
  onChange,
}) => {
  // If initialConfiguration does not have regular or special hours, initialize with defaults
  const [configuration, setConfiguration] = useState<StoreHoursConfiguration>({
    delivery_hours: initialConfiguration.delivery_hours,
    pickup_hours: initialConfiguration.pickup_hours,
    timezone: initialConfiguration.timezone,
  });


  // Add handlers
  const addRegularHour = (type: 'delivery_hours' | 'pickup_hours', newRegularHour: StorefrontRegularHours) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          regular_hours: prev[type]?.regular_hours ? [...(prev?.[type]?.regular_hours || []), newRegularHour] : [newRegularHour],
        },
      }
      onChange(newConf)
      return newConf
    });
  };

  const addSpecialHour = (type: 'delivery_hours' | 'pickup_hours', newSpecialHour: StorefrontSpecialHours) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          special_hours: prev[type]?.special_hours ? [...(prev?.[type]?.special_hours || []), newSpecialHour] : [newSpecialHour],
        },
      }
      onChange(newConf)
      return newConf
    });
  };

  // Remove handlers
  const removeRegularHour = (type: 'delivery_hours' | 'pickup_hours', index: number) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          regular_hours: prev[type]?.regular_hours?.filter((_, i) => i !== index),
        },
      }
      onChange(newConf)
      return newConf
    });
  };

  const removeSpecialHour = (type: 'delivery_hours' | 'pickup_hours', index: number) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          special_hours: prev[type]?.special_hours?.filter((_, i) => i !== index),
        },
      }
      onChange(newConf)
      return newConf
    });
  };

  const handleRegularHoursChange = (type: 'delivery_hours' | 'pickup_hours', index: number, updatedHour: StorefrontRegularHours) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          regular_hours: prev[type]?.regular_hours?.map((hour, i) => i === index ? updatedHour : hour) || [updatedHour],
        },
      }
      onChange(newConf)

      return newConf

    }
    );
  };

  // Correctly update a single special hour in the array
  const handleSpecialHoursChange = (type: 'delivery_hours' | 'pickup_hours', index: number, updatedHour: StorefrontSpecialHours) => {
    setConfiguration(prev => {
      let newConf = {
        ...prev,
        [type]: {
          ...prev[type],
          special_hours: prev[type]?.special_hours?.map((hour, i) => i === index ? updatedHour : hour) || [updatedHour],
        },
      }
      onChange(newConf)

      return newConf

    }
    );
  };

  // Render function for regular and special hours inputs
  const renderHoursInputs = (type: 'delivery_hours' | 'pickup_hours') => {
    const hours = configuration[type];

    return (
      <>
        <Collapsible className='bg-primary-almost-black-light p-2 rounded-lg' stepHeaderProps={{
          className: 'bg-primary-almost-black/20 p-2 rounded-lg',
          text: "Regular Hours"
        }}>
          {hours?.regular_hours?.map((regularHour, index) => (
            <div key={`regular-${type}-${index}`}>
              <RegularHoursInput
                regularHours={regularHour}
                onChange={(updatedHour) => handleRegularHoursChange(type, index, updatedHour)}
              />
              <Button className='bg-secondary-pink-salmon mt-2' onClick={() => removeRegularHour(type, index)}>Remove Regular Hour</Button>
            </div>
          ))}
          <Button onClick={() => addRegularHour(type, { day_of_week: DayOfWeek.MONDAY, time_ranges: [] })}>Add New Regular Hour</Button>
        </Collapsible>

        <Collapsible className='bg-primary-almost-black-light p-2 rounded-lg' stepHeaderProps={{
          className: 'bg-primary-almost-black/20 p-2 rounded-lg',
          text: "Special Hours"
        }}>
          {hours?.special_hours?.map((specialHour, index) => (
            <div key={`special-${type}-${index}`}>
              <SpecialHoursInput
                specialHours={specialHour}
                onChange={(updatedHour) => handleSpecialHoursChange(type, index, updatedHour)}
              />
              <Button className='bg-secondary-pink-salmon' onClick={() => removeSpecialHour(type, index)}>Remove Special Hour</Button>
            </div>
          ))}
          <Button onClick={() => addSpecialHour(type, { date: new Date(), time_ranges: [], special_hour_type: SpecialHourType.OPEN })}>Add New Special Hour</Button>
        </Collapsible>
      </>
    );
  };

  // JSX
  return (
    <div>

      <h1 className='text-xl font-righteous border-black border-b-2'>Delivery Hours</h1>
      {renderHoursInputs('delivery_hours')}

      <h1 className='text-xl font-righteous border-black border-b-2'>Pickup Hours</h1>
      {renderHoursInputs('pickup_hours')}

      {/* Timezone input */}
      <Label htmlFor="timezone">Timezone:</Label>
      <Input
        id="timezone"
        type="text"
        value={configuration.timezone}
        onChange={(e) => {
          setConfiguration({ ...configuration, timezone: e.target.value })
          onChange({ ...configuration, timezone: e.target.value })
        }}
        className="border rounded p-2"
      />
    </div>
  );
};

