"use client";

import { useEffect } from "react";
import { setupRealtimeSubscriptions } from "@/lib/supabase/realtime";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }
    return setupRealtimeSubscriptions();
  }, []);

  return <>{children}</>;
}
