'use client';

import React, { useState } from 'react';
import { Org } from '../models/orgModels';

interface OrgListProps {
  orgs: Org[];
  onSelect?: (org: Org) => void;
}

export const OrgList: React.FC<OrgListProps> = ({ orgs, onSelect }) => {
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);

  const handleOrgClick = (org: Org) => {
    setSelectedOrg(org);
    onSelect?.(org);
  };

  return (
    <div className="">
      <h2 className="text-2xl  mb-6">Select an Restaurant</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {orgs?.map((org, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md cursor-pointer transform transition-transform duration-200 ${
              selectedOrg?.name === org?.name
                ? 'scale-105 bg-blue-100'
                : 'hover:scale-105'
            }`}
            onClick={() => handleOrgClick(org)}
          >
            {org.brand_image_url ? (
              <img
                src={org.brand_image_url}
                alt={org?.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-md mb-4">
                <span className="text-gray-700">{org?.name}</span>
              </div>
            )}
            <h3 className="text-lg font-medium">{org?.name}</h3>
            {selectedOrg?.name === org?.name && (
              <span className="text-blue-600">Selected</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
