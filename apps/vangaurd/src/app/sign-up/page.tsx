'use client';

import { SignUp } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';

export default function Page() {
  return (
    <div className='flex items-start justify-center min-h-screen py-16'>
      <SignUp 
        appearance={{
          baseTheme: neobrutalism,
          // Add your custom styles here
          variables: {
            colorPrimary: "green",
          }
        }}
      />
    </div>
  );
}