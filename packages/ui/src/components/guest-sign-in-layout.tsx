'use client'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { RedirectToSignIn, useSignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BackgroundBeamsWithCollision, Button, ColorfullLogo, CubeLoader, Share, useCreateGuestActorToken } from '..';

interface GuestSignInLayoutProps {
    share?: Share;
}

export const GuestSignInLayout: React.FC<GuestSignInLayoutProps> = ({ share }) => {
    const createActorTokenMutation = useCreateGuestActorToken();
    const [selectedToNotBeGuest, setSelectedNotToBeGuestSignIn] = React.useState(false);
    const [showLoader, setShowLoader] = useState(true); // Initially show the loader

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false); // Hide the loader after a delay
        }, 3000); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, []);

    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    async function handleGuestSignIn() {
        if (!isLoaded) return;
        try {
            const mutationResult = await createActorTokenMutation.mutateAsync();
            setSelectedNotToBeGuestSignIn(false);
            if (mutationResult) {
                try {
                    const { createdSessionId } = await signIn.create({
                        strategy: 'ticket',
                        ticket: mutationResult,
                    });
                    await setActive({ session: createdSessionId });
                    router.push('/');
                } catch (err) {
                    console.error('Error during sign-in with impersonated user:', JSON.stringify(err, null, 2));
                }
            } else {
                console.error('No token received from the impersonation token creation.');
            }
        } catch (err) {
            console.error('Error creating impersonation token:', JSON.stringify(err, null, 2));
        }
    }

    // Define navbar items
    const navItems = [
        { label: 'For Drivers', path: process.env.NEXT_PUBLIC_DRIVER_URL },
    ];


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col md:flex-row min-h-screen bg-primary-off-white justify-center items-center px-2 lg:px-0 ${showLoader ? 'bg-white/90' : 'bg-gray-100'}`}
        >
            <BackgroundBeamsWithCollision>
                {showLoader && (
                    <div className='fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50'>
                        <div className='flex flex-col justify-center items-center gap-4'>
                            <Player
                                autoplay
                                loop
                                src="https://res.cloudinary.com/dzmqies6h/raw/upload/v1726760831/burger_rrxzv7.json"
                                style={{ height: '200px', width: '200px' }}
                            >
                                <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                            </Player>
                            <ColorfullLogo />
                        </div>
                    </div>
                )}

                {selectedToNotBeGuest && (share ? <RedirectToSignIn redirectUrl={window.location.href} /> : <RedirectToSignIn />)}
                {isLoaded && (
                    <div className="flex justify-center items-center h-full">
                        <div className='absolute top-0 flex justify-center items-center w-full p-5 border-b-[1px] lg:border-b-2 border-black'>
                            <img src="https://res.cloudinary.com/dzmqies6h/image/upload/v1720793549/branding/Colorfull_PNG.png" alt="Colorfull Large Logo" className="w-40 h-auto" />
                            <div className="absolute -right-4 lg:right-0 p-2">
                                {navItems.map(item => (
                                    <div
                                        key={item.label}
                                        className="px-4 py-2 cursor-pointer rounded-full hover:bg-black text-primary-spinach-green hover:text-white transition-colors duration-200 ease-in-out"
                                        onClick={() => { if (item.path) router.push(item.path); }}
                                    >
                                        <span className="font-righteous text-base lg:text-2xl text-center">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex flex-col lg:flex-row justify-between items-center gap-4 bg-white rounded-2xl mx-2 p-2 pt-24'>
                            <img src="https://res.cloudinary.com/dzmqies6h/image/upload/v1726762735/sign-in-image_ngpsgh.webp" alt="Two bowls of food" className="w-full md:w-1/2 max-w-[900px] rounded-2xl" />
                            <div className="mt-4 w-full flex flex-col space-y-4">
                                {!isLoaded ? (
                                    <div className='w-full items-center'>
                                        <CubeLoader />
                                    </div>
                                ) : (
                                    <div className='mb-2 w-full flex-col gap-4 justify-center items-center flex'>
                                        <h1 className="text-3xl md:text-6xl font-bold text-primary-spinach-green font-righteous text-center">
                                            Welcome Back.
                                        </h1>
                                        <Button
                                            color="primary"
                                            onClick={handleGuestSignIn}
                                            className="text-base md:text-xl w-1/2 border border-2 border-primary-spinach-green bg-primary-off-white text-primary-spinach-green font-righteous rounded-sm text-center hover:text-white lg:p-6"
                                        >
                                            Sign in as Guest
                                        </Button>
                                        <Button
                                            color="default"
                                            className='text-base md:text-xl mb-2 w-1/2 border border-2 border-primary-spinach-green bg-primary-lime-green text-primary-spinach-green font-righteous rounded-t-sm rounded-b-full text-center hover:bg-primary-lime-green lg:p-6 hover:rotate-3 transition-transform duration-200'
                                            onClick={() => setSelectedNotToBeGuestSignIn(true)}
                                        >
                                            Sign in as User
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </BackgroundBeamsWithCollision>
        </motion.div>
    );
};