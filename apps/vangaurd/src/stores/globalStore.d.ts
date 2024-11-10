import { immerable } from 'immer';
import { Order, User } from 'ui';
export declare class GlobalState {
  [immerable]: boolean;
  set: any;
  get: any;
  user: User | undefined;
  cart: Order[];
  isCartOpen: boolean;
  selectedDayOfWeek: string;
  setSelectedDayOfWeek: (dayOfWeek: string) => void;
  constructor(set: any, get: any);
  setUser: (user: User) => void;
  setCart: (cart: any[]) => void;
  toggleCart: () => void;
}
export declare const useGlobalStore: import('zustand').UseBoundStore<
  Omit<import('zustand').StoreApi<any>, 'setState'> & {
    setState(
      nextStateOrUpdater: any,
      shouldReplace?: boolean | undefined,
    ): void;
  }
>;
