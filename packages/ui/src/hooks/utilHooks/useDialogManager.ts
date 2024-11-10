'use client'
import { useState, useCallback } from 'react';

// types/dialog.ts
export interface DialogConfig {
    name: string;
    message: string;
    onConfirm: () => void;
}

/**
 * Custom hook to manage dialog states and interactions.
 * 
 * @param initialDialogs - Array of DialogConfig, initial state for dialogs.
 * @returns An object containing:
 * - activeDialog: The currently active dialog or null if no dialog is active.
 * - registerDialog: Function to add a new dialog to the state.
 * - switchDialog: Function to set a dialog as active by its name.
 * 
 * ## Example Usage
 * 
 * ```typescript
 * const { activeDialog, registerDialog, switchDialog } = useDialogManager([
 *   { name: 'confirmDelete', message: 'Are you sure you want to delete?', onConfirm: () => console.log('Deleted') },
 *   { name: 'alertError', message: 'An error occurred!', onConfirm: () => console.log('Error acknowledged') }
 * ]);
 * 
 * // Register a new dialog
 * registerDialog({ name: 'welcome', message: 'Welcome to the application!', onConfirm: () => console.log('Welcome acknowledged') });
 * 
 * // Switch to a specific dialog
 * switchDialog('welcome');
 * 
 * // Use activeDialog in your component
 * if (activeDialog) {
 *   console.log(`Active Dialog: ${activeDialog.name}`);
 * }
 * ```
 */
export const useDialogManager = (initialDialogs: DialogConfig[]) => {
    const [dialogs, setDialogs] = useState<DialogConfig[]>(initialDialogs);
    const [activeDialog, setActiveDialog] = useState<DialogConfig | null>(null);

    const registerDialog = useCallback((dialog: DialogConfig) => {
        setDialogs(prevDialogs => [...prevDialogs, dialog]);
    }, []);

    const switchDialog = useCallback((dialogName: string) => {
        const foundDialog = dialogs.find(dialog => dialog.name === dialogName);
        setActiveDialog(foundDialog || null);
    }, [dialogs]);

    return {
        activeDialog,
        registerDialog,
        switchDialog
    };
};