'use client';

import { SignIn } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';

export default function Page() {
  return (
    <div className='flex items-start justify-center min-h-screen py-16'>
      <SignIn 
        appearance={{
          baseTheme: neobrutalism,
          variables: {
            colorPrimary: "green",
            // colorText: "white"
          }
        }}
      />
    </div>
  );
}