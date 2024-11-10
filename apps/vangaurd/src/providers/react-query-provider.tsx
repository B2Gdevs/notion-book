"use client"

import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
