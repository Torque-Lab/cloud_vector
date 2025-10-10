import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RabbitMQDetailLoading() {
  return (
    <DashboardLayout>
    <div className="flex-1 space-y-6 p-8">
   
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-10 w-56 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-80 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

   
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-700 bg-black/30">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

   
      <Card className="border border-gray-700 bg-black/30">
        <CardHeader>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-3 w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
     
          <div className="grid grid-cols-5 gap-4 pb-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4 items-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-6 w-28 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
   
  );
}



