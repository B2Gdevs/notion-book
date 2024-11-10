'use client'

import React from 'react';
import { Area, AreaLifecycleRequest, Collapsible, Scheduler, SchedulerCard, SchedulerCreateRequest, timeToCronFormat, toast, useGetSchedulerById, useUpdateArea } from 'ui';

const USING_BASIC_BATCHING = true;

export const AreaSchedulerComponent: React.FC<{ area: Area }> = ({ area }) => {
  const orderCutoffCron = timeToCronFormat(area?.order_cutoff_time ?? '');
  const rebatchCutoffCron = timeToCronFormat(area?.order_rebatch_cutoff_time ?? '');
  const { data: orderCutoffScheduler } = useGetSchedulerById(area?.order_cutoff_scheduler_id ?? '');
  const { data: rebatchCutoffScheduler } = useGetSchedulerById(area?.order_rebatch_cutoff_scheduler_id ?? '');
  const { data: reminderScheduler } = useGetSchedulerById(area?.daily_reminders_scheduler_id ?? '');

  const { mutate: updateAreaMutation } = useUpdateArea({
    onSuccess: () => {
      toast({
        title: 'Area Updated',
        description: 'The area has been successfully updated.',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update the area.',
        duration: 3000,
      });
    },
  });

  const createSchedulerBody = (isRebatch: boolean): AreaLifecycleRequest => {
    return {
      area_id: area?.id ?? '',
      basic_batching: USING_BASIC_BATCHING, // Set this according to your needs
      is_rebatch: isRebatch,
      date: new Date().toISOString(),
      use_date: false,
    };
  }

  const createSchedulerCreateRequest = (isRebatch: boolean, isReminder: boolean) => {
    const now = new Date();
    const urlFriendlyDate = now.toISOString().replace(/[:.-]/g, '');
    const payload = createSchedulerBody(isRebatch);

    if (isReminder) {
      const thirtyMinBeforeCron = timeToCronFormat(area?.order_cutoff_time ?? '', -30);
      const schedulerRequest = {
        name: 'send-daily-reminder-' + urlFriendlyDate,
        area_id: area?.id ?? '',
        schedule: thirtyMinBeforeCron, // Run every day at midnight
        payload: payload,
        http_target: {
          uri: '/send_daily_reminders',
          http_method: 'POST',
          time_zone: area?.timezone ?? '',
          body: JSON.stringify(payload),
        },
        time_zone: area?.timezone ?? '',
      } as SchedulerCreateRequest
      return schedulerRequest
    }


    const schedulerRequest = {
      name: (isRebatch ? 'order-cutoff-rebatch' : 'order-cutoff') + '-' + urlFriendlyDate,
      area_id: area?.id ?? '',
      schedule: isRebatch ? rebatchCutoffCron : orderCutoffCron,
      payload: payload,
      http_target: {
        uri: isRebatch ? '/lifecycle/rebatch' : '/lifecycle/begin',
        http_method: 'POST',
        time_zone: area?.timezone ?? '',
        body: JSON.stringify(payload),
      },
      time_zone: area?.timezone ?? '',
    } as SchedulerCreateRequest
    return schedulerRequest
  }


  const handleCreateScheduler = (scheduler: Scheduler, isRebatch: boolean, isReminder: boolean) => {

    if (isReminder) {
      updateAreaMutation({
        areaId: area?.id ?? '',
        area: {
          ...area,
          daily_reminders_scheduler_id: scheduler?.id ?? '',
        }
      });
      return
    }

    if (isRebatch) {
      updateAreaMutation({
        areaId: area?.id ?? '',
        area: {
          ...area,
          order_rebatch_cutoff_scheduler_id: scheduler?.id ?? '',
        }
      });
      return
    }




    updateAreaMutation({
      areaId: area?.id ?? '',
      area: {
        ...area,
        order_cutoff_scheduler_id: scheduler?.id ?? '',
      }
    });
  };
    // const areaScheduler = true
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 border-black border-2 rounded-lg">
        <Collapsible stepHeaderProps={{
          text: 'Daily Reminder Scheduler',
          step: '1',
        }}>
          <SchedulerCard
            scheduler={reminderScheduler}
            onCreateScheduler={(scheduler) => handleCreateScheduler(scheduler, true, true)}
            onDeleteScheduler={() => {}}
            schedulerCreateRequest={createSchedulerCreateRequest(true, true)}
            canUpdate={true}
          />
        </Collapsible>
        <Collapsible stepHeaderProps={{
          text: 'Daily Order Cutoff Scheduler',
          step: '2',
        }}>
          <SchedulerCard
            scheduler={orderCutoffScheduler}
            onCreateScheduler={(scheduler) => handleCreateScheduler(scheduler, false, false)}
            onDeleteScheduler={() => {}}
            schedulerCreateRequest={createSchedulerCreateRequest(false, false)}
            canUpdate={true}
          />
        </Collapsible>
        <Collapsible stepHeaderProps={{
          text: 'Daily Rebatch Cutoff Scheduler',
          step: '3',
        }}>
          <SchedulerCard
            scheduler={rebatchCutoffScheduler}
            onCreateScheduler={(scheduler) => handleCreateScheduler(scheduler, true, false)}
            onDeleteScheduler={() => {}}
            schedulerCreateRequest={createSchedulerCreateRequest(true, false)}
            canUpdate={true}
          />
        </Collapsible>

      </div>
    );
}