'use client';

import { useSession } from '@clerk/nextjs';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { JWT_TEMPLATE } from '..';

export enum sessionRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest',
    COURIER = 'courier',
    PARTNER = 'partner',
}

export const useFirstAdminOrg = (
): string | undefined => {
    const session = useSession();
    const orgMemberships = session.session?.user?.organizationMemberships;
    const orgsMemsAdminOf = orgMemberships?.filter(
        (orgMembership) =>
            orgMembership.role === 'admin'
    );
    return orgsMemsAdminOf?.[0]?.organization?.id;
};

export const useSessionToken = () => {
    const { session, isLoaded } = useSession();
    const [token, setToken] = useState<string | null>(null);
    

    useEffect(() => {
        let isMounted = true; // Flag to handle component unmount

        const fetchToken = async () => {
            try {
                const fetchedToken = await session?.getToken({ template: JWT_TEMPLATE });
                if (isMounted && fetchedToken) {
                    const decoded: { exp: number } = jwtDecode(fetchedToken);
                    const isExpired = decoded.exp * 1000 < Date.now();
                    if (!isExpired) {
                        setToken(fetchedToken);
                    } else {
                        setToken(null); // Optionally trigger a token refresh here
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setToken(null); // Reset token on error
                }
            }
        };

        if (isLoaded) {
            fetchToken();
        }

        return () => {
            isMounted = false;
        };
    }, [session, isLoaded]);

    return token;
};

export const useSessionTokenRole = () => {
    const { session, isLoaded } = useSession();
    const [role, setRole] = useState<string | null>(null); // Store role

    useEffect(() => {
        let isMounted = true; // Flag to handle component unmount

        const fetchToken = async () => {
            try {
                const fetchedToken = await session?.getToken({ template: JWT_TEMPLATE });
                if (isMounted && fetchedToken) {
                    const decoded: { exp: number, metadata: { role: string } } = jwtDecode(fetchedToken); // Update type to include role
                    const isExpired = decoded.exp * 1000 < Date.now();
                    if (!isExpired) {
                        setRole(decoded.metadata.role); // Set role from decoded token
                    } else {
                        setRole(null); // Optionally trigger a role refresh here
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setRole(null); // Reset role on error
                }
            }
        };

        if (isLoaded) {
            fetchToken();
        }

        return () => {
            isMounted = false;
        };
    }, [session, isLoaded]);

    return role; // Return role instead of token
};