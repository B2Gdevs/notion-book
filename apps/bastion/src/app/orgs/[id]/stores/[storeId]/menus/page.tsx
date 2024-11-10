'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { Menu, TitleComponent, useMenuDataFromStoreId } from 'ui';
import MenuComponent from './menu';

const Menus: React.FC = () => {
  const params = useParams();

  const orgId = params.id as string;
  const storeId = params.storeId as string;

  // Fetch menus data using menuHooks
  const {
    menus,
  } = useMenuDataFromStoreId(storeId);


  return (
    <TitleComponent className='m-4' leftTitle='Org' rightTitle={orgId}>
      {Object.values(menus)?.map((menu: Menu, index: number) => (
        <MenuComponent key={index} menu={menu} orgId={orgId} />
      ))}
    </TitleComponent>
  )
};


export default Menus;
