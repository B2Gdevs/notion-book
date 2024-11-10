import React, { useState } from 'react';
import { Item } from 'ui';

interface Props {
  menuId: string;
  onChange: (item: Item) => void;
  item?: Item;
}

const ItemInput: React.FC<Props> = ({ onChange, menuId, item }) => {
  const initialItem: Item = {
    description: '',
    menu_id: menuId,
    name: '',
    modifier_group_ids: [],
    price: { currency_code: 'USD', amount: 0 },
    photo_ids: [],
    sale_status: 'FOR_SALE',
    is_active: true, // default value
    ...item
  };

  const [localItem, setLocalItem] = useState<Item>(initialItem);


  const updateItem = (field: keyof Item, value: any) => {
    const newItem = { ...localItem, [field]: value };
    setLocalItem(newItem);
    onChange(newItem);
  };


  return (
    <div>
      <InputField
        label="Name"
        value={localItem.name}
        onChange={(value) => updateItem('name', value)}
      />

      <InputField
        label="Price Amount"
        type="number"
        value={localItem.price.amount}
        onChange={(value) => updateItem('price', { ...localItem.price, amount: parseFloat(value) })}
      />

      <InputField
        label="Currency Code"
        value={localItem.price.currency_code}
        onChange={(value) => updateItem('price', { ...localItem.price, currency_code: value })}
      />

      <TextAreaField
        label="Description"
        value={localItem.description}
        onChange={(value) => updateItem('description', value)}
      />
    </div>
  );
};

interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputProps> = ({ label, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md p-2"
    />
  </div>
);

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextAreaField: React.FC<TextAreaProps> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md p-2"
    />
  </div>
);

export default ItemInput;
