import { immerable } from 'immer';
import { OrderItem } from 'ui';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export class GlobalState {
  [immerable] = true;
  set: any = null;
  get: any = null;
  selectedDate: Date = new Date();
  isSheetOpen: boolean = false; 
  wasSheetOpen: boolean = false; 
  isOrderItemDialogOpen: boolean = false; 
  selectedOrderItem?: OrderItem = undefined; // Provide a default value of null
  isAdminGuestAccount?: boolean = false; 

  constructor(set: any, get: any) {
    this.set = set;
    this.get = get;
  }

  setDate = (date: Date) => {
    this.set((state: GlobalState) => {
      state.selectedDate = date;
    });
  };

  setIsSheetOpen = (open: boolean) => { // Add this method
    this.set((state: GlobalState) => {
      state.isSheetOpen = open;
    });
  };

  setWasSheetOpen = (open: boolean) => { // Add this method
    this.set((state: GlobalState) => {
      state.wasSheetOpen = open;
    });
  }

  setIsOrderItemDialogOpen = (open: boolean) => { // Add this method
    this.set((state: GlobalState) => {
      state.isOrderItemDialogOpen = open;
    });
  };

  setSelectedOrderItem = (item: OrderItem) => { // Add this method
    this.set((state: GlobalState) => {
      state.selectedOrderItem = item;
    });
  }

  setIsAdminGuestAccount = (isAdmin: boolean) => { // New method
    this.set((state: GlobalState) => {
      state.isAdminGuestAccount = isAdmin;
    });
  }
}

// Log every time state is changed
const log = (config: any) => (set: Function, get: Function, api: any) =>
  config(
    (...args: any) => {
      set(...args);
      // console.debug('MeetingPageState 👊 NEW STATE:', get());
    },
    get,
    api,
  );
// Create the context store
export const useGlobalStore = create(
  immer(
    log((set: any, get: any) => {
      return new GlobalState(set, get);
    }),
  ),
);
