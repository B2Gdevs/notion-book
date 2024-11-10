'use client';

import { useParams } from 'next/navigation';
import { TitleComponent, useGetMenu } from 'ui';
import TopBar from './topbar';

interface AccountLayoutProps {
  children: any; // Adjusted type here to include ReactElement explicitly
}

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  const params = useParams();
  const menuId = params.menuId as string;
  const { data: menu } = useGetMenu(menuId);

  return (
    <TitleComponent
      className='mt-4'
      leftTitle='Menu'
      centerTitle={menu?.name}
      rightTitle={menuId}>
      {menuId && (
        <TopBar />
      )}
      {children}
    </TitleComponent>
  );
}