'use client'
import React, { useEffect, useState } from 'react';
import { Category } from 'ui';

interface CategoryInputProps {
  menuId: string;
  onChange?: (category: Category) => void;
  category?: Category;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  onChange,
  menuId,
  category,
}) => {
  const [newCategory, setNewCategory] = useState<Category>(
    category ?? {
      menu_id: menuId,
      name: '',
      description: '',
      item_ids: [],
    },
  );


  const handleInputChange = (field: keyof Category, value: any) => {
    const updatedCategory = { ...newCategory, [field]: value };
    setNewCategory(updatedCategory);
    onChange?.(updatedCategory);
  };

  // This useEffect ensures that if the prop `category` changes, it updates the local state
  useEffect(() => {
    if (category) {
      setNewCategory(category);
    }
  }, [category]);

  return (
    <div>
      <h3 className="text-xl  mb-4">Add Category</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={newCategory.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>
    </div>
  );
};

export default CategoryInput;
