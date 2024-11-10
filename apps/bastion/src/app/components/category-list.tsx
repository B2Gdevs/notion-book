'use client'
import React from 'react';
import { Category, useMenuDataFromStoreId } from 'ui'; // Ensure these imports are correct
import CategoryCard from './category-card'; // Ensure this import is correct

interface CategoryListProps {
  onSelect: (category: Category) => void;
  storeId: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelect, storeId }) => {
  const {
    categories,
    isLoading,
  } = useMenuDataFromStoreId(storeId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
<>
  {Object.values(categories ?? {}).length === 0 ? (
    <div>No categories available.</div>
  ) : (
        Object.values(categories ?? {}).filter((cat) => cat).map((category) => (
          <div key={category?.id} onClick={() => onSelect(category)}>
            <CategoryCard category={category} />
          </div>
        ))
      )}
    </>
  );
};

export default CategoryList;