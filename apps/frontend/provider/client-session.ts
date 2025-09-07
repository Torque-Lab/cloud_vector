
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
interface User {
  id: string;
  role: string;
  email: string; 
  name: string;
}

interface Session {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

let isRefreshing = false;

export function useSession(): Session {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
     const response=await axios.get<User>(`/api/auth/session`);

      if (response.status === 401) {
        await axios.post(`/api/auth/refresh`, {
        });

        const retry = await axios.get<User>(`/api/auth/session`);

        if (retry.status === 200) {
          const retryData = retry.data;
          setUser(retryData);
        } else {
          setUser(null);
          router.push("/signin");
        }
      }
    } catch (err) {
      console.error("Session fetch failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
      isRefreshing = false;
    }
  }, [router]);
  

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refresh = async () => {
    await fetchUser();
  };

  return { user, loading, refresh };
}