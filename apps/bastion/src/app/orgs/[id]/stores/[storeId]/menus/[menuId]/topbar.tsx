'use client';
import { ArrowLeft } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const TopBar: React.FC = () => {
  const tabs = ['Categories', 'Items', 'Modifier groups', 'Photos'];
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const orgId = params.id as string;
  const menuId = params.menuId as string;
  const storeId = params.storeId as string;

  const currentTabFromUrl = () => {
    const matchedTab = tabs.find(tab => 
      pathname.toLowerCase().includes(tab.toLowerCase().replace(' ', '-'))
    );
    return matchedTab || 'Items'; // Default to 'Items' if no match found
  };
  

  const [activeTab, setActiveTab] = useState<string>(() => currentTabFromUrl());

  useEffect(() => {
    setActiveTab(currentTabFromUrl());
  }, [pathname]); // Update activeTab when the URL path changes

  return (
    <div className="flex mt-4">
      <div className="flex items-center">
        <ArrowLeft
          size={24}
          className="cursor-pointer mr-4"
          onClick={() => {
            router.push(`/orgs/${orgId}/stores/${storeId}/menus`);
          }}
        />
      </div>

      <div className="flex items-center">
        <div className="flex space-x-2 bg-gray-300 rounded-md p-1 mr-6">
          {tabs?.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                router.push(
                  `/orgs/${orgId}/stores/${storeId}/menus/${menuId}/${tab.toLowerCase().replace(' ', '-')}`,
                );
              }}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab ? 'bg-white' : 'bg-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
