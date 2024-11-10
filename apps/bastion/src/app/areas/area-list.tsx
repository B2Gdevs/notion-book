'use client'
// AreaList.tsx
import React from 'react';
import { Area, Button, PageTitleDisplay, Section } from 'ui';
import { AreaCard } from './area-card';

interface PaginationItem {
  skip: number;
  limit: number;
}

interface AreaListProps {
  areas: Area[];
  setSelectedArea: (area: Area) => void;
  setPagination: (
    pagination: PaginationItem | ((prev: PaginationItem) => PaginationItem),
  ) => void;
}

export const AreaList: React.FC<AreaListProps> = ({
  areas,
  setSelectedArea,
  setPagination,
}) => {

  return (
    <Section expanded={true} hideChevron={true}>
      <PageTitleDisplay overrideTitle="Areas" />
      <div className="bg-primary-off-white m-2 p-4 rounded border-2 border-black">
        <div className='flex-col space-y-2'>
          {areas?.map((area, idx) => (
            <AreaCard key={`${idx}`} area={area} setSelectedArea={setSelectedArea} />
          ))}
        </div>
        <div className="mt-4">
          <Button
            onClick={() =>
              setPagination((prev) => ({ ...prev, skip: prev.skip + 10 }))
            }
            className="text-blue-400 underline"
          >
            Load More
          </Button>
        </div>
      </div>
    </Section>
  );
};