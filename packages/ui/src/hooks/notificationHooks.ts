'use client'

import { useMutation } from 'react-query';
import { MutationCallbacks } from '../lib/utils';
import { NotificationClient } from '../clients/notificationClient';
import { EmailMessage } from '../models/notificationModels';

const useSessionToken = () => {
  const { useSessionToken } = require('./sessionHooks');
  return useSessionToken();
};

export const useSendmail = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const token = useSessionToken(); // Use the useSessionToken hook to get the session token
  return useMutation(
    async (emailMessage: EmailMessage) => {
      if (!token) {
        throw new Error("Session token not available");
      }
      return NotificationClient.sendEmail(emailMessage, token);
    },
    {
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError,
    }
  );
};

export const useSendRestaurantOrderItemsForecast = ({ onSuccess, onError }: MutationCallbacks = {}) => {
  const token = useSessionToken();
  return useMutation(
    async (forecastDate: string) => { // Accept a date parameter
      if (!token) {
        throw new Error("Session token not available");
      }
      return NotificationClient.sendRestaurantOrderItemsForecast(forecastDate, token);
    },
    {
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError,
    }
  );
};