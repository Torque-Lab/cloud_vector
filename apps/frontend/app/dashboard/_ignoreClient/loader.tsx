import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone Skeleton */}
        <Card className="p-6 border-red-200 dark:border-red-900/50">
          <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
