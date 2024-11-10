"use client";
import React from "react";
import { ColorfullIcon, useGetCurrentColorfullUser } from "..";
import { useSendmail } from "../hooks/notificationHooks";
import { cn } from "../lib/utils";
import { EmailMessage } from "../models/notificationModels";
import { Input } from "./aceternity-ui/anim-input";
import { Label } from "./aceternity-ui/anim-label";
import { AnimTextArea } from "./anim-textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

interface ContactFormProps {
    handleCloseContactForm: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ handleCloseContactForm }) => {
    const { data: user } = useGetCurrentColorfullUser()
    const sendmailMutation = useSendmail();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const emailMessage: EmailMessage = {
            from_email: user?.email as string,
            to_email: "help@colorfull.ai",
            subject: formData.get("subject") as string,
            body: formData.get("body") as string,
        };

        try {
            await sendmailMutation.mutateAsync(emailMessage);
            toast({
                title: "Email sent successfully",
                duration: 5000,
            })
            handleCloseContactForm();
        } catch (error) {
            // Show error message to the user
            toast({
                title: "Failed to send email",
                description: "Please try again later",
                duration: 5000,
                variant: "destructive"
            });
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-lg md:rounded-2xl p-4 md:p-8 shadow-input bg-primary-off-white dark:bg-black">
            <ColorfullIcon variant="secondary" className="w-8 h-8 lg:w-16 lg:h-16 mx-auto shadow-md rounded-lg absolute top-0 left-0 lg:left-12" />
            <h2 className="flex w-full justify-center items-center font-righteous text-xl text-neutral-800 dark:text-neutral-200">
                Thanks for getting in touch! 😊
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Got feedback or need help? Share your thoughts or detail any issues here.
            </p>
            <Separator />

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="recipient" >Recipient</Label>
                    <Input
                        id="recipient"
                        name="recipient"
                        placeholder="Enter a subject"
                        type="text"
                        value="help@colorfull.ai"
                        required
                        disabled
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="subject" >Subject</Label>
                    <Input
                        id="subject"
                        name="subject"
                        placeholder="Enter a subject"
                        type="text"
                        required
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="body">Message</Label>
                    <AnimTextArea
                        id="body"
                        name="body"
                        placeholder="Describe your issue in detail"
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        rows={4}
                        required
                    ></AnimTextArea>
                </LabelInputContainer>

                <Button
                    className="hover:text-secondary-peach-orange bg-gradient-to-br relative group/btn from-primary-almost-black dark:from-zinc-900 dark:to-zinc-900 to-primary-spinach-green block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Submit
                    <BottomGradient />
                </Button>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-secondary-peach-orange to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};