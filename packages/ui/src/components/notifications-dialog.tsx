'use client'

import { MailIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogContent as ImageDialogContent } from './ui/dialog';
import { Separator } from './ui/separator';
import { PageTitleDisplay } from './page-title-display';
import { DialogDescription } from '@radix-ui/react-dialog';

// Define your image URLs
const images = {
  orderCanceled: 'https://res.cloudinary.com/dzmqies6h/image/upload/v1717284787/vangaurd_assets/order-canceled-notification_atxpdj.png',
  newUserWelcome: 'https://res.cloudinary.com/dzmqies6h/image/upload/v1717284787/vangaurd_assets/new-user-welcome-notification_jogbdf.png',
  dailyReminder: 'https://res.cloudinary.com/dzmqies6h/image/upload/v1717284786/vangaurd_assets/daily-reminder-notification_rsfv6v.png',
  orderFailed: 'https://res.cloudinary.com/dzmqies6h/image/upload/v1717284786/vangaurd_assets/order-failed-notification_e8fo4c.png',
  ordersDelivered: 'https://res.cloudinary.com/dzmqies6h/image/upload/v1717284786/vangaurd_assets/orders-delivered-notification_pixj0u.png',
};

interface NotificationItemProps {
  description: string;
  imageUrl: string;
  title?: string;
}

const NotificationItem: FC<NotificationItemProps> = ({
  description,
  imageUrl,
  title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsImageOpen(true);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsImageOpen(false);
  };

  return (
    <div
      className={`relative mx-2 flex justify-between mb-5 p-2 border border-gray-300 rounded cursor-pointer ${isHovered ? 'bg-gray-300' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className='flex-col m-4'>
        <div className='flex space-x-2 mt-2 justify-center items-center'>
          <MailIcon className='' />
        <PageTitleDisplay
          overrideTitle="Notification"
          additionalText={title}
          className="text-lg" 
          additionalTextClassName="text-xs text-secondary-pink-salmon"
          separator={true}
          separatorCharacter='-'
          separatorClassName='text-xs'
        />
        </div>
        <Separator />
        <p className='mt-4 mr-8 italic text-sm'>{description}</p>
      </div>
      <img style={{ width: '150px', height: '150px', border: '1px solid #ddd', borderRadius: '5px' }} src={imageUrl} alt={description} />

      {isImageOpen && (
        <>
          <ImageDialogContent className='items-center justify-center'>
            <img src={imageUrl} alt={description} style={{ maxWidth: '50vw', maxHeight: '50vh' }} />
            <button onClick={handleClose}>Close</button>
          </ImageDialogContent>
        </>

      )}
    </div>
  );
};

export const NotificationsDialog: FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="flex  items-center justify-center space-x-4 text-xs">
        <p className="italic  text-center p-2">Users receive notifications, beginning when they are successfully added to Colorfull.</p>
        <Button className="mt-2" onClick={handleClickOpen}>See User Notifications</Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={handleClose}>
        <DialogContent className="max-h-[80vh] overflow-y-hidden  space-y-2">
          <DialogHeader className='sticky top-0 z-50 bg-secondary-creamer-beige lg:pt-6'>
            <div className='relative w-full flex-col justify-center items-center lg:pb-4'>
              <DialogTitle className='font-righteous py-4 lg:py-0'>
                User Email Notifications
              </DialogTitle>
              <DialogDescription>
                <p className='mt-2 text-xs text-center'>Here are some of the email notifications that users will receive from us.</p>
              </DialogDescription>
            </div>
            <div className='border-b border-primary-spinach-green' />
          </DialogHeader>
          <div className='max-h-[60vh] overflow-y-auto pt-5 '> 
            <NotificationItem title="Daily Reminder" description="This reminder is for people to place orders for the day.  This goes out at 9:30 to remind about the 10:30am cutoff time." imageUrl={images.dailyReminder} />
            <NotificationItem title="New User Welcome" description="This is a welcome message for new users when they are first added to Colorfull.  This typically happens when the users admin adds them to Colorfull in the settings." imageUrl={images.newUserWelcome} />
            <NotificationItem title="Order Canceled" description="This is a notification for canceled orders from the kitchen. We currently have a feature called 'Rebatching', that when an order is canceled by the kitchen, we notify the user and they can reorder.  Currently all of this works except the company not currently running rebatching in production at the moment.  Right now, users will be updated as soon as an order is canceled, they can reorder, but the order will not be fulfilled. " imageUrl={images.orderCanceled} />
            <NotificationItem title="Order Failed" description="This is a notification to the user if our system somehow fails to send the order over to the kitchen. There could be quite a bit of reasons.  This will work with rebatching when running.  Right now we still can substitute, or refund, based on the user settings." imageUrl={images.orderFailed} />
            <NotificationItem title="Orders Delivered" description="When a driver completes the delivery, a job is completed and an event goes out stated that the job has been completed to all admins for the job as well as Colorfulls internal Slack Channels." imageUrl={images.ordersDelivered} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};