"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import  {useParams} from "next/navigation"
import { useState } from "react"
import { GeneralModal } from "@/components/general-modal"
import { ConnectChildSection } from "@/components/connect-child-section"
import { toast } from "@/hooks/use-toast"
import { RefreshCcw } from "lucide-react"
import { parseDateWithLocale } from "@/lib/utils"
import { RabbitApi ,rabbitData} from "@/lib/rabbit_api"


export default function RabbitMQDetailPage({rabbitmq}: {rabbitmq: rabbitData }) {
  const [isConnectModelOpen, setIsConnectModelOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const params = useParams()
  const handleDeleteRabbitmq = async () => {
    try {
        setDeleteLoading(true)
        const id = params.id as string
        const response = await RabbitApi.deleteRabbitmq(id)
        if(!response.success){
          toast({
            title: "Error",
            description: "Failed to delete RabbitMQ",
            variant: "destructive",
          })
          setShowDeleteConfirm(false)
        }
        toast({
          title: "Success",
          description: "RabbitMQ deleted successfully",
          variant: "default",
        })
        setShowDeleteConfirm(false)
          
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete RabbitMQ",
        variant: "destructive",
      })
       setDeleteLoading(false)
    } finally {
        setDeleteLoading(false)
    }
        
  }
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
             
              <h2 className="text-3xl font-bold tracking-tight">{rabbitmq?.name}</h2>
              <Badge variant={rabbitmq?.is_provisioned === true ? "success" : "warning"}>{rabbitmq?.is_provisioned ? "Provisioned" : "Not Provisioned"}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="cursor-pointer " onClick={() => {setIsConnectModelOpen(true)}}>Connect</Button>
          </div>
        </div>


        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Current database settings and parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">CPU Limit:</span>
                  <span className="text-sm font-medium">{rabbitmq?.maxVCpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Memory Limit:</span>
                  <span className="text-sm font-medium">{rabbitmq?.maxMemory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <span className="text-sm font-medium">{rabbitmq?.region}</span>
                </div>
                <div className="flex justify-between items-start">
  <div className="flex flex-col">
    <span className="text-sm text-muted-foreground">Auto-scaling:</span>
    <small className="text-xs text-muted-foreground mt-1">
      * scaling in same instance, not add new machine
    </small>
  </div>
  <Badge variant={rabbitmq?.autoScale ? "success" : "secondary"}>
    {rabbitmq?.autoScale ? "Enabled" : "Disabled"}
  </Badge>
</div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm font-medium">{parseDateWithLocale(rabbitmq?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span className="text-sm font-medium">{parseDateWithLocale(rabbitmq?.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Query latency and throughput over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">

                  <span >coming soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common RabbitMQ operations and management tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent cursor-pointer">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span className="text-sm">Export Data</span>
                <span className="text-xs text-muted-foreground">coming soon</span>
              </Button>
            
            </div>
          </CardContent>
        </Card>
        <GeneralModal isOpen={isConnectModelOpen} onClose={() => setIsConnectModelOpen(false)} title="Connect to RabbitMQ" inputMode={false} onClick={() => {}} children={<ConnectChildSection api={RabbitApi} resourceId={params.id as string} label="RabbitMQ" />} />



          {/* Danger Zone */}
          <Card className="p-6 border-red-200 dark:border-red-900/50">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 border border-none rounded-lg">
              <div>
                <p className="font-medium">Delete PostgresSQL</p>
                <p className="text-sm text-muted-foreground">Permanently delete this PostgresSQL and all its data</p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent cursor-pointer"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete RabbitMQ
              </Button>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Delete RabbitMQ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete "{rabbitmq.name}"? This action cannot be undone and will permanently
                delete all associated data.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="cursor-pointer" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteRabbitmq}
                  disabled={deleteLoading}
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent cursor-pointer"
                >
                  {deleteLoading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : "Delete RabbitMQ"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
