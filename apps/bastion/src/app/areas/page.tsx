'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Area, PageTitleDisplay, useGetAreas } from 'ui';
import { AreaCreateUpdate } from './area-create-update';
import { AreaList } from './area-list';

const AreaComponent: React.FC = () => {
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const router = useRouter();

  const {data: areas} = useGetAreas(pagination.skip, pagination.limit);

  const handleAreaSelect = (area: Area) => {
    router.push(`/areas/${area.id}`);
  };

  return (
    <div className="flex flex-col mx-auto p-6 gap-y-5">
      <PageTitleDisplay overrideTitle='Area Management' />
      <AreaCreateUpdate
        setSelectedArea={handleAreaSelect}
        initialArea={{}}
      />
      <AreaList
        areas={areas ?? []}
        setSelectedArea={handleAreaSelect}
        setPagination={setPagination}
      />
    </div>
  );
};

export default AreaComponent;