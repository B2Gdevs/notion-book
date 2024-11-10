'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CreateInvoiceRequest, Invoice } from '../models/invoiceModels';
import { MutationCallbacks } from '../lib/utils';
import { InvoiceQueryParams, InvoicesClient } from '..';

const INVOICES_CACHE_KEY = 'invoices';
const INVOICE_CACHE_KEY = 'invoice';

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

export const useCreateInvoice = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async (invoice: CreateInvoiceRequest) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return InvoicesClient.createInvoice(invoice, token);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INVOICES_CACHE_KEY);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError,
    },
  );
};

export const useGetInvoiceById = (invoiceId: string) => {
  const token = useSessionToken();
  return useQuery(
    [INVOICE_CACHE_KEY, invoiceId],
    async () => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return InvoicesClient.getInvoiceById(invoiceId, token);
    },
    {
      enabled: !!invoiceId && !!token,
    },
  );
};

export const useGetInvoices = (params: InvoiceQueryParams) => {
  const token = useSessionToken();
  return useQuery([INVOICES_CACHE_KEY, params], async () => {
    if (!token) {
      throw new Error("Session token not available");
    }
    return InvoicesClient.getInvoices(params, token);
  },
  {
    enabled: !!token,
  });
};

export const useGetInvoicesByIds = (invoiceIds: string[]) => {
  const token = useSessionToken();
  return useQuery(
    [INVOICES_CACHE_KEY, { ids: invoiceIds }],
    async () => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return InvoicesClient.getInvoicesByIds(invoiceIds, token);
    },
    {
      enabled: (invoiceIds?.length ?? 0) > 0 && !!token,
    },
  );
};

export const useUpdateInvoice = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();

  return useMutation(
    async ({
      invoiceId,
      invoiceData,
    }: { invoiceId: string; invoiceData: Invoice }) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return InvoicesClient.updateInvoice(invoiceId, invoiceData, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          INVOICE_CACHE_KEY,
          variables.invoiceId,
        ]);
        queryClient.invalidateQueries(INVOICES_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};

export const useDeleteInvoice = ({
  onSuccess,
  onError,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  const token = useSessionToken();
  return useMutation(
    async (invoiceId: string) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return InvoicesClient.deleteInvoice(invoiceId, token);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([INVOICE_CACHE_KEY, variables]);
        queryClient.invalidateQueries(INVOICES_CACHE_KEY);
        if (onSuccess) onSuccess(data);
      },
      onError,
    },
  );
};