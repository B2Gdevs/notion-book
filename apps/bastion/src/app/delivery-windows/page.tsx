'use client';

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, DeliveryWindowForm, DeliveryWindowsTable, Dialog, DialogContent } from "ui";

export default function DeliveryWindowPage() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleNewWindowSubmit = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <div className="flex justify-start items-center gap-2 m-2 border-2 p-2 border-black rounded-lg w-fit">
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-6 w-6" />
                </Button>
                <span>Create New Delivery Window</span>
            </div>

            <DeliveryWindowsTable />


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-transparent border-transparent'>
                    <DeliveryWindowForm onSubmit={handleNewWindowSubmit} onCancel={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
