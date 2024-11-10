import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface MutationCallbacks {
    onSuccess?: (data?: any, variables?: any) => void;
    onError?: (error: any) => void;
}
export interface QueryCallbacks {
	onSuccess?: (data: any) => void;
	onError?: (error: any) => void;
  }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
