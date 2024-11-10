'use client';

import { useQuery } from 'react-query';
import { SvixClient } from '../clients/svixClient';
import { MutationCallbacks } from '../lib/utils';

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
};

export const useGetAppPortalUrl = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();

    return useQuery(
        ['getAppPortalUrl', token], // Unique key for the query and dependency array
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return SvixClient.getAppPortalUrl(token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
            enabled: !!token, // Only run the query if the token is available
        }
    );
};