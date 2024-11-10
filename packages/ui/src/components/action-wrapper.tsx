'use client'

import { Action } from '../models/actionModels';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';


interface ActionWrapperProps {
    startActions?: Action[];
    endActions?: Action[];
    children: JSX.Element;
    startActionsContainerStyle?: string;
    endActionsContainerStyle?: string;
    startButtonStyle?: string;
    startButtonActiveStyle?: string;
    endButtonStyle?: string;
    endButtonActiveStyle?: string;
    onEditClick?: () => void;
    alwaysShowActions?: boolean;
    className?: string;
    id: string; // Unique id for each instance
    onHover?: (id: string) => void; // Callback to set the currently hovered component
}

export const ActionWrapper: React.FC<ActionWrapperProps> = ({
    startActions,
    endActions,
    children,
    startActionsContainerStyle = '',
    endActionsContainerStyle = '',
    startButtonStyle = '',
    endButtonStyle = '',
    endButtonActiveStyle = '',
    alwaysShowActions,
    className,
    id,
    onHover,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false); // Renamed from modalOpen to dialogOpen
    const [currentAction, setCurrentAction] = useState<Action | null>(null);
    const [confirmation, setConfirmation] = useState('');
    const [activeEndAction, setActiveEndAction] = useState(
        endActions?.[endActions.length - 1]?.name
    );

    // Function to handle Confirmation Change
    const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
    };

    // Function to handle Action Click
    const handleActionClick = (action: Action, skipModal = false) => {
        if (!action.noPopUp && !skipModal) {
            setCurrentAction(action);
            setDialogOpen(true);
        } else {
            if (startActions?.includes(action)) {
                action?.onClick?.();
            } else if (endActions?.includes(action)) {
                action?.onClick?.();
                setActiveEndAction(action.name);
            }
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setCurrentAction(null);
    };

    // Whether this component is the currently hovered component
    // const isCurrentHover = id === currentHover;

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => {
                onHover?.(id)
            }}
            onMouseLeave={() => {
                onHover?.('')
            }}
        >
            <div className={`absolute top-0 left-0 flex space-x-2 ${startActionsContainerStyle}`}>
                {startActions?.map((action: Action) => (
                    <div
                        key={action.id}
                        className={`transition-opacity duration-200 ${alwaysShowActions ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'}`}
                    >
                        <button
                            className={`${startButtonStyle}`}
                            onClick={() => handleActionClick(action)}
                        >
                            <action.icon />
                            {action.name}
                        </button>
                    </div>
                ))}
            </div>
    
            {children}
    
            <div className={`absolute top-0 right-0 flex space-x-2 ${endActionsContainerStyle}`}>
                {endActions?.map((action: Action) => (
                    <div
                        key={action.id}
                        className={`transition-opacity duration-200 ${alwaysShowActions ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'}`}
                    >
                        <div>{action.toolTip}</div>
                        <Button
                            onClick={() => handleActionClick(action)}
                            className={`text-sm ${action.name === activeEndAction ? endButtonActiveStyle : endButtonStyle}`}
                        >
                            <action.icon />
                        </Button>
                    </div>
                ))}
            </div>
    
            {currentAction && (
                <Dialog open={dialogOpen} onOpenChange={closeDialog}>
                    <DialogContent>
                        <h3>{currentAction.modalTitle}</h3>
                        <div>{currentAction.modalDescription}</div>
                        {currentAction.isDangerous && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={confirmation}
                                    onChange={handleConfirmationChange}
                                    className="border p-2 mr-2"
                                    placeholder="Type 'continue' to confirm"
                                />
                            </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-4">
                            {currentAction?.onClick && (
                                <Button
                                    className={`${currentAction.isDangerous
                                        ? confirmation === 'continue'
                                            ? 'neobrutalism-dangerous'
                                            : 'neobrutalism-dangerous'
                                        : 'neobrutalism-accent'
                                        }`}
                                    onClick={() => {
                                        handleActionClick(currentAction, true);
                                        closeDialog();
                                    }}
                                    disabled={currentAction.isDangerous && confirmation !== 'continue'}
                                >
                                    Continue
                                </Button>
                            )}
                            <Button className='bg-secondary-pink-salmon' onClick={closeDialog}>
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};