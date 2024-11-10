"use client"

import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { useState } from "react";
import { DayPickerProvider } from 'react-day-picker';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <DayPickerProvider initialProps={{}}> {/* Wrap DayPicker with DayPickerProvider */}

    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </DayPickerProvider> 
  );
}
