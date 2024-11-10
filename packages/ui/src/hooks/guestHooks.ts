// src/hooks/guestHooks.ts
'use client';

import { useMutation, useQueryClient } from 'react-query';
import { GuestClient } from '../clients/guestClient';
import { MutationCallbacks } from '../lib/utils';

const GUEST_TOKEN_CACHE_KEY = 'guestToken';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateGuestActorToken = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();

    const queryClient = useQueryClient();

    return useMutation(
        async () => {

            const guestActorToken = await GuestClient.createGuestActorToken(token);
            return guestActorToken;
        },
        {
            onSuccess: (data) => {
                // Cache the newly created guest token
                queryClient.setQueryData([GUEST_TOKEN_CACHE_KEY], data);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError: (error) => {
                if (onError) {
                    onError(error);
                }
            },
        },
    );
};