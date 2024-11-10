'use client';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SchedulerClient, SchedulerQueryParams } from '../clients/schedulerClient';
import { MutationCallbacks } from '../lib/utils';
import { SchedulerCreateRequest, SchedulerUpdateRequest } from '../models/schedulerModels';

const SCHEDULERS_CACHE_KEY = 'schedulers';
export const SCHEDULER_CACHE_KEY = 'scheduler';

const useSessionToken = () => {
  const { useSessionToken } = require('./sessionHooks');
  return useSessionToken();
};


export const useCreateScheduler = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async (createRequest: SchedulerCreateRequest) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.createScheduler(createRequest, token);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(SCHEDULERS_CACHE_KEY);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError,
    },
  );
};

export const useGetSchedulerById = (schedulerId: string) => {
  const token = useSessionToken();
  return useQuery(
    [SCHEDULER_CACHE_KEY, schedulerId],
    async () => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.getSchedulerById(schedulerId, token);
    },
    {
      enabled: !!schedulerId && !!token,
    },
  );
};


export interface UpdateSchedulerMutation {
  schedulerId: string;
  updateRequest: SchedulerUpdateRequest;
}

export const useUpdateScheduler = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async ({ schedulerId, updateRequest }: UpdateSchedulerMutation) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.updateScheduler(schedulerId, updateRequest, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([SCHEDULER_CACHE_KEY, variables.schedulerId]);
        queryClient.invalidateQueries(SCHEDULERS_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const useDeleteScheduler = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async (schedulerId: string) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.deleteScheduler(schedulerId, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([SCHEDULER_CACHE_KEY, variables]);
        queryClient.invalidateQueries(SCHEDULERS_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const usePauseScheduler = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async (schedulerId: string) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.pauseScheduler(schedulerId, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([SCHEDULER_CACHE_KEY, variables]);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const useUnpauseScheduler = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async (schedulerId: string) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.unpauseScheduler(schedulerId, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([SCHEDULER_CACHE_KEY, variables]);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const useGetSchedulers = (params: SchedulerQueryParams) => {
  const token = useSessionToken();
  return useQuery(
    [SCHEDULERS_CACHE_KEY, params],
    async () => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return SchedulerClient.querySchedulers(params, token);
    },
    {
      enabled: !!token,
    }
  );
};