import React, { useState } from 'react';
import { Button } from 'react-day-picker';
import { Input } from './ui/input';
import { Label } from '..';

interface EditCardFormProps {
  onSubmit: (formData: any) => void; // Add your own type here instead of any
  onCancel: () => void;
}

export const EditCardForm: React.FC<EditCardFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    expiryMonth: '02',
    expiryYear: '2034',
    cardholderName: '',
    street: '',
    street2: '',
    city: '',
    zip: '23423',
    state: '',
    country: 'US',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label>Expiration month:</Label>
        <Input
          name="expiryMonth"
          value={formData.expiryMonth}
          onChange={handleChange}
        />
        <Label>Expiration year:</Label>
        <Input
          name="expiryYear"
          value={formData.expiryYear}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Cardholder name:</Label>
        <Input
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Street:</Label>
        <Input name="street" value={formData.street} onChange={handleChange} />
      </div>
      <div>
        <Label>Street (line 2):</Label>
        <Input
          name="street2"
          value={formData.street2}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>City:</Label>
        <Input name="city" value={formData.city} onChange={handleChange} />
      </div>
      <div>
        <Label>Zip/Postal:</Label>
        <Input name="zip" value={formData.zip} onChange={handleChange} />
      </div>
      <div>
        <Label>State/Province:</Label>
        <Input name="state" value={formData.state} onChange={handleChange} />
      </div>
      <div>
        <Label>Country:</Label>
        <Input
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full justify-left items-center gap-x-2 mt-2">
        <Button type="submit" className="bg-primary-spinach-green w-full">
          <span className="font-righteous text-primary-off-white">
            Update
          </span>
        </Button>
        <Button
          className="bg-secondary-pink-salmon w-full"
          type="button"
          onClick={onCancel}
        >
          <span className="font-righteous text-primary-off-white">
            Cancel
          </span>
        </Button>
      </div>
    </form>
  );
};

export default EditCardForm;
