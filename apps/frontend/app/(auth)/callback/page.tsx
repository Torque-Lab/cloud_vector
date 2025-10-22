
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CallbackHandlingPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  }, [router]);

  return (
<DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
    
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

     
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-gray-700 bg-black/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

       
        <div className="grid gap-6 md:grid-cols-2">
       
          <Card className="border border-gray-700 bg-black/30">
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          
          <Card className="border border-gray-700 bg-black/30">
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-56 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <Card className="border border-gray-700 bg-black/30">
          <CardHeader>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-600 flex flex-col items-center justify-center gap-2 animate-pulse"
              >
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}