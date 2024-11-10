'use client';

import { useSession } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useIntercom } from 'react-use-intercom';
import { CubeLoader, sessionRole, useSessionTokenRole } from 'ui'; // Adjust the import path as necessary
import { ColorfullDashboard } from './components/colorfull-dashboard';
import { CourierDashboard } from './components/courier-dashboard';
import { PartnerDashboard } from './components/partner-dashboard';
import { SidebarWrapper } from './components/sidebar-wrapper';


export default function AppPage() {
    const [isCourierView, setIsCourierView] = useState(false);
    const [isPartnerView, setIsPartnerView] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const session = useSession();
    const sessionTokenRole = useSessionTokenRole();

    const userEmail = session.session?.user.primaryEmailAddress?.emailAddress
    // Check if userEmail ends in "colorfull.ai" to determine if user is a Colorfull user
    const isColorfullUser = userEmail?.endsWith('colorfull.ai');
    // const isColorfullUser = false;

    useEffect(() => {
        if (sessionTokenRole === sessionRole.COURIER) {
            setIsCourierView(true);
            setIsLoading(false);
        } else if (sessionTokenRole === sessionRole.PARTNER) {
            setIsPartnerView(true);
            setIsLoading(false);
        } else if (isColorfullUser) {
            setIsLoading(false); // Immediately stop loading if it's a Colorfull user
        }
    }, [sessionTokenRole, isColorfullUser])

    const toggleView = (view: 'courier' | 'partner') => {
        if (view === 'courier') {
            setIsCourierView(!isCourierView);
            setIsPartnerView(false);
        } else if (view === 'partner') {
            setIsPartnerView(!isPartnerView);
            setIsCourierView(false);
        }
    };

    const { boot } = useIntercom();

    useEffect(() => {
        boot();
    }, [boot]);


    if (!userEmail || isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen h-full w-full'>
                <CubeLoader />
            </div>
        )
    }

    if (isPartnerView) {
        return (
            <SidebarWrapper
                isCourierView={false}
                isPartnerView={true}
                isColorfullUser={isColorfullUser}
                toggleView={toggleView}
            >
                <PartnerDashboard />

            </SidebarWrapper>
        )
    }

    return (
        <SidebarWrapper
            isCourierView={!isColorfullUser || isCourierView}
            isPartnerView={!isColorfullUser || isPartnerView}
            isColorfullUser={isColorfullUser}
            toggleView={toggleView}
        >
            {(!isColorfullUser || isCourierView) ? <CourierDashboard isColorfullUser={isColorfullUser} /> : <ColorfullDashboard />}
            <div>

            </div>
        </SidebarWrapper>
    )
}