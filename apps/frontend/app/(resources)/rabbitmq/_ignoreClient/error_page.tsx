import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage( {paragraph,cardTitle}: {paragraph: string,cardTitle: string}) {
    return (
        <DashboardLayout>
        <div className="flex-1 space-y-6 p-8">
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-600 dark:text-red-400">
                  {cardTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
              {paragraph}
              </p>
              <div className="flex items-center space-x-2">
            <Link href="/rabbitmq">
              <Button className="cursor-pointer"><ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to RabbitMQ</Button>
            </Link>
          </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
}