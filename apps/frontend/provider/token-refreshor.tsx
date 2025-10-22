"use client";

import { useEffect, useRef } from "react";

export default function TokenRefresher() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ACCESS_TOKEN_LIFETIME_MS = 60 * 60 * 1000*24*2;   
    const REFRESH_BEFORE_MS = 5 * 60 * 1000;           
    function scheduleRefresh() {
      const delay = Math.max(ACCESS_TOKEN_LIFETIME_MS - REFRESH_BEFORE_MS, 5_000);
      timerRef.current = setTimeout(refreshToken, delay);
    }
    async function refreshToken() {
      try {
        await fetch("/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include", 
        });
      } catch (_) {
      } finally {
        scheduleRefresh(); 
      }
    }

    scheduleRefresh();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
