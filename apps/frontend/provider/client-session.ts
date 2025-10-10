
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export interface User {
  id: string,
  email: string,
  role: string,
  first_name: string,
  last_name: string,
  createdAt: string,
}

interface Session {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

let isRefreshing = false;

export function useClientSession(): Session {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
     const response=await axios.get<{User:User,message:string,success:boolean}>(`/api/v1/auth/session`);
      if (response.status === 401) {
        await axios.post(`/api/v1/auth/refresh`, {
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const retry = await axios.get<{User:User,message:string,success:boolean}>(`/api/v1/auth/session`);

        if (retry.status === 200) {
          const retryData = retry.data;
          setUser(retryData.User);
        } else {
          setUser(null);
          router.push("/signin");
        }
      }
      setUser(response.data.User);
    } catch (err) {
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