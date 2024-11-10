'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { UserClient, UserQueryParams } from '../clients/userClient';
import { MutationCallbacks } from '../lib/utils';
import { User } from '../models/userModels';
import { ORDER_ITEMS_CACHE_KEY } from './orderItemHooks';
import { useSession } from '@clerk/nextjs';
import { useState } from 'react';

export const USER_CACHE_KEY = 'user';
export const USERS_CACHE_KEY = 'users';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};


export const useGetUser = (userId: string) => {
    const token = useSessionToken();
    const fetchUser = async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return UserClient.getUser(userId, token);
    };

    return useQuery([USER_CACHE_KEY, userId], fetchUser, {
        enabled: !!userId && !!token,
    });
};

export const useCreateUser = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(async ({ user, userType }: { user: User; userType?: string }) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return UserClient.createUser(user, token, userType);
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(USERS_CACHE_KEY);
            if (onSuccess) onSuccess(data);
        },
        onError,
    });
};

export const useCreateColorfullUsers = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    const [progress, setProgress] = useState(0);

    const mutation = useMutation(async (users: User[]) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        let completed = 0;
        return Promise.all(users.map(user => {
            return UserClient.createUser(user, token).then(result => {
                completed++;
                setProgress((completed / users.length) * 100);
                return result;
            });
        }));
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(USERS_CACHE_KEY);
            if (onSuccess) onSuccess();
        },
        onError,
    });

    return { ...mutation, progress };
};

export const useUpdateUser = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(async ({ userId, user }: { userId: string; user: User }) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return UserClient.updateUser(userId, user, token);
    }, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([USER_CACHE_KEY, variables.userId]);
            queryClient.invalidateQueries(USERS_CACHE_KEY);
            queryClient.invalidateQueries(ORDER_ITEMS_CACHE_KEY);
            if (onSuccess) onSuccess(data);
        },
        onError,
    });
};

export const useDeleteUser = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(async (userId: string) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return UserClient.deleteUser(userId, token);
    }, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([USER_CACHE_KEY, variables]);
            queryClient.invalidateQueries(USERS_CACHE_KEY);
            if (onSuccess) onSuccess(data);
        },
        onError,
    });
};

export const useGetUsers = (params: UserQueryParams, isEnabled: boolean = true) => {
    const token = useSessionToken();
    const fetchUsers = async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return UserClient.getUsers(params, token);
    };

    return useQuery([USERS_CACHE_KEY, params], fetchUsers, {
        enabled: !!token && isEnabled // Ensure the query is only enabled if the token is available and the external condition is met
    });
};

export const useGetCurrentColorfullUser = () => {
    const session = useSession();
    const clerkId = session.session?.user?.id ?? '';

    const { data: users, isError, refetch } = useGetUsers({ clerkId, page: 1, pageSize: 1 });
    return { data: users?.[0], isError, refetch };
};