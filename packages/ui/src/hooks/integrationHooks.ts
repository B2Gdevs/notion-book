'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IntegrationClient, IntegrationQueryParams } from '../clients/integrationClient';
import { Integration } from '../models/integrationModels';
import { MutationCallbacks } from '../lib/utils';

const INTEGRATIONS_CACHE_KEY = 'integrations';
const INTEGRATION_CACHE_KEY = 'integration';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

  export const useGetIntegrations = (params: IntegrationQueryParams, enabled: boolean = true) => {
    const token = useSessionToken();
    return useQuery(
      [INTEGRATIONS_CACHE_KEY, params],
      async () => {
        if (!token) {
          throw new Error("Session token not available");
        }
        return IntegrationClient.getIntegrations(params, token);
      },
      { staleTime: STALE_TIME, 
        enabled: !!token && enabled
      }
    );
  };

export const useGetIntegration = (id: string) => {
  const token = useSessionToken();
  return useQuery(
    [INTEGRATION_CACHE_KEY, id],
    async () => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return IntegrationClient.getIntegration(id, token);
    },
    {
      staleTime: STALE_TIME,
      enabled: !!id && !!token,
    },
  );
};

export const useCreateIntegration = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();
  return useMutation(
    async (integration: Integration) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return IntegrationClient.createIntegration(integration, token);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INTEGRATIONS_CACHE_KEY);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError,
    },
  );
};

export const useUpdateIntegration = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();
  return useMutation(
    async ({ id, integration }: { id: string; integration: Integration }) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return IntegrationClient.updateIntegration(id, integration, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([INTEGRATION_CACHE_KEY, variables.id]);
        queryClient.invalidateQueries(INTEGRATIONS_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const useDeleteIntegration = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();
  return useMutation(
    async (id: string) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return IntegrationClient.deleteIntegration(id, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([INTEGRATION_CACHE_KEY, variables]);
        queryClient.invalidateQueries(INTEGRATIONS_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};