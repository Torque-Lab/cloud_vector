import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectDetailLoading() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="space-y-2  ">
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border border-gray-700 bg-black/30">
              <CardContent className="p-6 space-y-6">
            
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-7 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="h-7 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>

         
                <div className="space-y-3 pt-4 ">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                      <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

           
                <div className="flex items-center justify-between pt-3 ">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>

            
                <div className="flex items-center justify-between pt-4 ">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}