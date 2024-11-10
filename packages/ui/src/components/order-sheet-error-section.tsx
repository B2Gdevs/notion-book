'use client'

import React from 'react';
import { OrderErrorType } from '../lib/orderUtils';
import { CodeBlock } from './code-block';
import { cn } from '..';

interface OrderSheetErrorSectionProps {
  errorMessage: string | null;
  errorType: OrderErrorType;
  className?: string;
  onMyAccountSettingsClick?: () => void;
  isGuestLimitedView?: boolean;
}

interface ErrorMessage {
  title: string;
  instruction: (onMyAccountSettingsClick?: () => void, isGuestLimitedView?: boolean) => JSX.Element;
}

function getErrorMessages(onMyAccountSettingsClick?: () => void): Record<string, ErrorMessage | null> {
  return {
    [OrderErrorType.None]: null,
    [OrderErrorType.UserOrOrgUnavailable]: {
      title: "Account Issue",
      instruction: () => <>There seems to be an issue with your account. Please contact Colorfull support. 😕</>
    },
    [OrderErrorType.OrgNotAvailable]: {
      title: "Account Issue",
      instruction: () => <>You are not associated with an org. Please contact Colorfull support. 😕</>
    },
    [OrderErrorType.OrgInactive]: {
      title: "Org Issue",
      instruction: () => <>Your organization is not active. Please contact your administrator.</>
    },
    [OrderErrorType.NameNotSet]: {
      title: "Name Missing",
      instruction: () => <>
        You need to set a first and last name in <CodeBlock className='text-red-500'>My Settings</CodeBlock>.
      </>
    },
    [OrderErrorType.NoDeliveryLocation]: {
      title: "Delivery Location Missing",
      instruction: () => <>Please select your current work location.</>
    },
    [OrderErrorType.TaxRateUnknown]: {
      title: "Tax Rate Unknown",
      instruction: () => <>
        Go to <CodeBlock className='text-red-500'>Company Accounts</CodeBlock> and set your organization's tax rate, or contact Colorfull support.
      </>
    },
    [OrderErrorType.SubsidyExceeded]: {
      title: "Subsidy Limit Exceeded",
      instruction: (onMyAccountSettingsClick, isGuestLimitedView) => isGuestLimitedView ? (
        <>Total amount exceeds the subsidy. Please reduce the order amount below the subsidy.</>
      ) : (
        <>
          You've exceeded your subsidy limit. Please add a default payment method <span className='bg-transparent p-1 rounded-lg font-mono text-secondary-peach-orange hover:bg-primary-lime-green cursor-pointer' onClick={() => onMyAccountSettingsClick?.()}>
            here
          </span>
        </>
      )
    },
    [OrderErrorType.PastCutoffTime]: {
      title: "Past Cutoff Time",
      instruction: () => <>The time to place an order for today has passed.</>
    },
    [OrderErrorType.OrderAlreadyPlaced]: null,
    [`${OrderErrorType.SubsidyExceeded}_${OrderErrorType.NoPaymentMethods}`]: {
      title: "Limit Exceeded and No Payment Method",
      instruction: () => <>
        You've exceeded your subsidy limit and have no payment method to charge. Please add one <span className='bg-transparent p-1 rounded-lg font-mono text-secondary-peach-orange hover:bg-primary-lime-green cursor-pointer' onClick={() => onMyAccountSettingsClick?.()}>
          here
        </span> or reduce your order amount below the stipend.
      </>
    },
    [OrderErrorType.OutstandingBalance]: {
      title: "Outstanding Balance",
      instruction: () => (
        <>
          Exceeded subsidy limit. Add a new payment method and pay the balance <span className='bg-transparent p-1 rounded-lg font-mono text-secondary-peach-orange hover:bg-primary-lime-green cursor-pointer' onClick={() => onMyAccountSettingsClick?.()}>
            here
          </span>
        </>
      )
    },
  };
}

const ErrorMessageComponent: React.FC<{ errorType: OrderErrorType, onMyAccountSettingsClick?: () => void, isGuestLimitedView?: boolean }> = ({ errorType, onMyAccountSettingsClick, isGuestLimitedView }) => {
  const errorMessages = getErrorMessages(onMyAccountSettingsClick);
  const errorMessage = errorMessages[errorType];

  if (!errorMessage) return null;

  return (
    <>
      <div className="font-righteous">{errorMessage.title}</div>
      <div className='italic'>{errorMessage.instruction(onMyAccountSettingsClick, isGuestLimitedView)}</div>
    </>
  );
};

export const OrderSheetErrorSection: React.FC<OrderSheetErrorSectionProps> = ({ errorMessage, errorType, className, onMyAccountSettingsClick, isGuestLimitedView }) => {
  if (!errorMessage) return null;

  return (
    <div className={cn("px-4 py-2 bg-secondary-pink-salmon rounded-lg text-center", className)}>
      <ErrorMessageComponent
        errorType={errorType}
        onMyAccountSettingsClick={onMyAccountSettingsClick}
        isGuestLimitedView={isGuestLimitedView}
      />
    </div>
  );
};