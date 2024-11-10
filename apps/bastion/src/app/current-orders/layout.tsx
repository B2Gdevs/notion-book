'use client';

import React from 'react';
import { SidebarWrapper } from '../components/sidebar-wrapper';

export default function CurrentOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarWrapper>{children}</SidebarWrapper>;
}
