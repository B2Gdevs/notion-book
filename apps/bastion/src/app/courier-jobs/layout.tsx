'use client';

import React from 'react';
import { SidebarWrapper } from '../components/sidebar-wrapper';

export default function CourierJobsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SidebarWrapper isCourierView={true}>{children}</SidebarWrapper>;
}
