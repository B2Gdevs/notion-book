'use client'

import React, { useState } from 'react';
import { Button, Checkbox, CodeBlock, ConfirmationDialog, Scheduler, SchedulerCreateRequest, SchedulerStatus, SchedulerUpdateRequest, Switch, toast, useCreateScheduler, useDeleteScheduler, usePauseScheduler, useUnpauseScheduler, useUpdateScheduler } from '..';
import { CubeLoader } from './cube-loader';

interface SchedulerCardProps {
  scheduler: any; // Adjust the type to match your scheduler object
  onCreateScheduler?: (scheduler: Scheduler) => void;
  onDeleteScheduler?: (scheduler: Scheduler) => void;
  schedulerCreateRequest?: SchedulerCreateRequest;
  canUpdate?: boolean;
  onScheduleChange?: (schedule: string) => void;
}

export const SchedulerCard: React.FC<SchedulerCardProps> = ({
  scheduler,
  onCreateScheduler,
  onDeleteScheduler,
  schedulerCreateRequest,
  canUpdate = true,
  onScheduleChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPaused, setIsPaused] = useState(scheduler?.job_status === SchedulerStatus.PAUSED);
  const [editMode, setEditMode] = useState(false);
  const [editedCronSchedule, setEditedCronSchedule] = useState(scheduler?.cron_schedule || '');
  const [editedPayload, setEditedPayload] = useState(JSON.stringify(scheduler?.payload || {}, null, 2));
  const { mutate: pauseScheduler } = usePauseScheduler();
  const { mutate: unpauseScheduler } = useUnpauseScheduler();
  const [editedTargetEndpoint, setEditedTargetEndpoint] = useState(scheduler?.target_endpoint || '');

  const { mutate: createSchedulerMutation } = useCreateScheduler({
    onSuccess: (scheduler: Scheduler) => {
      toast({
        title: 'Scheduler Created',
        description: 'The scheduler has been successfully created.',
        duration: 3000,
      });
      onCreateScheduler?.(scheduler);
    },
    onError: () => {
      setIsCreating(false);
      toast({
        title: 'Error',
        description: 'Failed to create the scheduler.',
        duration: 3000,
      });
    },
  });

  const { mutate: deleteScheduler } = useDeleteScheduler({
    onSuccess: (scheduler: Scheduler) => {
      toast({
        title: 'Scheduler Deleted',
        description: 'The scheduler has been successfully deleted.',
        duration: 3000,
      });
      onDeleteScheduler?.(scheduler);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the scheduler.',
        duration: 3000,
      });
    },
  });

  const { mutate: updateScheduler } = useUpdateScheduler({
    onSuccess: () => {
      toast({
        title: 'Scheduler Updated',
        description: 'The scheduler has been successfully updated.',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update the scheduler.',
        duration: 3000,
      });
    },
  });

  const handleToggleScheduler = () => {
    if (isPaused) {
      unpauseScheduler(scheduler?.id);
    } else {
      pauseScheduler(scheduler?.id);
    }
    setIsPaused(!isPaused);
  };

  const handleCreateScheduler = () => {
    if (!schedulerCreateRequest) {
      toast({
        title: 'Error',
        description: 'No scheduler create request provided.',
        duration: 3000,
        variant: 'destructive'
      });
      return;
    }
    setIsCreating(true);
    createSchedulerMutation(schedulerCreateRequest);
  };

  const openDeleteDialog = () => setIsDialogOpen(true);

  const handleDeleteScheduler = () => {
    if (!scheduler) {
      toast({
        title: 'Error',
        description: 'No scheduler found.',
        duration: 3000,
        variant: 'destructive'
      });
      return;
    }
    deleteScheduler(scheduler?.id);
    setIsDialogOpen(false);
  };

  const handleSaveScheduleEdits = () => {
    if (!editedCronSchedule) {
      toast({
        title: 'Error',
        description: 'Cron schedule cannot be empty.',
        duration: 3000,
        variant: 'destructive',
      });
      return;
    }
    try {
      const payload = JSON.parse(editedPayload);
      let httpTarget = scheduler?.http_target;
      httpTarget.body = JSON.stringify(payload);
      scheduler.http_target = httpTarget;
      const updateRequest: SchedulerUpdateRequest = {
        http_target: scheduler.http_target,
        schedule: editedCronSchedule,
        time_zone: scheduler.time_zone,
        payload: payload,
        target_endpoint: editedTargetEndpoint,
      };

      updateScheduler({
        schedulerId: scheduler?.id,
        updateRequest,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON format for payload.',
        duration: 3000,
        variant: 'destructive',
      });
    }
  };
  // add a handler to execute what the scheduler would
  // do when the test execution button is clicked
  const handleTestExecution = () => {
    const payload = JSON.parse(editedPayload);  // Assuming editedPayload is a JSON string
    const httpTarget = scheduler?.http_target;

    if (!scheduler?.target_endpoint || !httpTarget) {
      toast({
        title: 'Error',
        description: 'Scheduler configuration is incomplete.',
        duration: 3000,
      });
      return;
    }

    httpTarget.body = JSON.stringify(payload);  // Update the body with the new payload
    scheduler.http_target = httpTarget;  // Update the scheduler's http_target


    fetch(scheduler.target_endpoint, {
      method: httpTarget.http_method,
      headers: {
        'Content-Type': 'application/json'  // Ensure the server knows to expect JSON
      },
      body: httpTarget.body
    }).then(response => {
      if (response.ok) {
        return response.json().then(() => {
          toast({
            title: 'Success',
            description: 'Test execution successful',
            duration: 3000,
          });
        });
      } else {
        response.json().then(data => {
          toast({
            title: 'Error',
            description: `Test execution failed: ${data.message}`,
            duration: 3000,
          });
          console.error('Error response data:', data);
        }).catch(() => {
          toast({
            title: 'Error',
            description: 'Test execution failed and no error message received.',
            duration: 3000,
          });
        });
      }
    }).catch(error => {
      toast({
        title: 'Error',
        description: `Network or other error: ${error.message}`,
        duration: 3000,
      });
      console.error('Fetch error:', error);
    });
  }

  const handleScheduleChange = (schedule: string) => {
    setEditedCronSchedule(schedule);
    onScheduleChange?.(schedule);
  }

  return (
    <div className='flex'>
      <div className='flex flex-col'>
        <div className='border-2 border-black rounded-lg p-2 m-2 bg-slate-100'>
          <Checkbox
            checked={editMode}
            onClick={() => setEditMode(!editMode)}
            text="Edit Schedule"
          />
        </div>
        <div className='flex space-x-2'>
          <Switch
            name="paused"
            checked={scheduler?.job_status !== SchedulerStatus.PAUSED}
            onClick={handleToggleScheduler}
          />
          {!scheduler && (
            <Button className="ml-2" onClick={handleCreateScheduler}>Create</Button>
          )}
          <Button
            variant="destructive"
            className="ml-2"
            onClick={openDeleteDialog}
          >Delete</Button>
          {canUpdate && editMode && (
            <Button
              className="ml-2"
              onClick={handleSaveScheduleEdits}
            >Save Changes</Button>
          )}
          <Button
            onClick={handleTestExecution}
            className='ml-2 text-black bg-white border-black border-2 rounded-lg'
            variant={'outline'}
          >Test Execution</Button>
        </div>
        {scheduler ? (
          <>
            <div className="flex justify-between mb-2">
              <span className="">Cron Schedule:</span>
              {editMode ? (
                <input
                  type="text"
                  value={editedCronSchedule}
                  onChange={(e) => handleScheduleChange(e.target.value)}
                  className="ml-2 p-1 border rounded"
                />
              ) : (
                <CodeBlock>{scheduler?.cron_schedule || 'Not set'}</CodeBlock>
              )}
            </div>
            <div className="flex justify-between mb-2">
              <span className="">Scheduler Job Status:</span> <CodeBlock>{scheduler?.job_status || 'Not set'}</CodeBlock>
            </div>
            <div className="flex justify-between mb-2">
              <span className="">Scheduler Job Name:</span> <CodeBlock>{scheduler?.job_name || 'Not set'}</CodeBlock>
            </div>
            {editMode ? (
              <div className="flex justify-between mb-2 w-full">
                <span className="">Target Endpoint:</span>
                <input
                  type="text"
                  value={editedTargetEndpoint}
                  onChange={(e) => setEditedTargetEndpoint(e.target.value)}
                  className="ml-2 p-1 border rounded w-full"
                />
              </div>
            ) : (
              <CodeBlock>
                {scheduler?.target_endpoint ? scheduler?.target_endpoint : 'Not set'}
              </CodeBlock>
            )}
            <div className="flex justify-between w-full">
              <div className='w-full'>
                <span className="">Scheduler Payload:</span>
                <div className="overflow-y-auto ">
                  {editMode ? (
                    <textarea
                      value={editedPayload}
                      onChange={(e) => setEditedPayload(e.target.value)}
                      className="h-96 w-full  border border-gray-300 rounded p-2" // Adjusted height, border, and padding
                    />
                  ) : (
                    <CodeBlock>
                      {scheduler?.payload ? JSON.stringify(scheduler?.payload, null, 2) : 'Not set'}
                    </CodeBlock>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex text-center justify-center shadow-lg border-2 border-black rounded-lg '>No Scheduler found</div>
        )}
      </div>
      {isCreating && !scheduler && <CubeLoader />}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteScheduler}
        message="Are you sure you want to delete this scheduler? This action cannot be undone."
      />
    </div>
  );
};