"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { GeneralModal } from "@/components/general-modal"
import { Eye, EyeOff, RefreshCcw } from "lucide-react"
import axios from "axios"
// Mock data for a specific database
const database = {
  id: "db-1",
  name: "product-search-v2",
  description: "Product similarity search for e-commerce platform",
  status: "healthy",
  cpuLimit: "2 vCPU",
  memoryLimit: "4 GB",
  size: "234 GB",
  region: "us-east-1",
  created: "2024-01-15",
  lastActivity: "2 minutes ago",
  autoScaling: true,
}


export default function DatabaseDetailPage({ params }: { params: { id: string } }) {
  const [isConnectModelOpen, setIsConnectModelOpen] = useState(false)
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
             
              <h2 className="text-3xl font-bold tracking-tight">{database.name}</h2>
              <Badge variant={database.status === "healthy" ? "success" : "warning"}>{database.status}</Badge>
            </div>
            <p className="text-muted-foreground">{database.description}</p>
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
                  <span className="text-sm font-medium">{database.cpuLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Memory Limit:</span>
                  <span className="text-sm font-medium">{database.memoryLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <span className="text-sm font-medium">{database.region}</span>
                </div>
                <div className="flex justify-between items-start">
  <div className="flex flex-col">
    <span className="text-sm text-muted-foreground">Auto-scaling:</span>
    <small className="text-xs text-muted-foreground mt-1">
      * scaling in same instance, not add new machine
    </small>
  </div>
  <Badge variant={database.autoScaling ? "success" : "secondary"}>
    {database.autoScaling ? "Enabled" : "Disabled"}
  </Badge>
</div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm font-medium">{database.created}</span>
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
            <CardDescription>Common database operations and management tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
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
        <GeneralModal isOpen={isConnectModelOpen} onClose={() => setIsConnectModelOpen(false)} title="Connect to Redis" inputMode={false} onClick={() => {}} children={<ConnectChildSection reset_endpoint="/api/redis/reset" endpoint="/api/redis/connection" />} />
      </div>
    </DashboardLayout>
  )
}

interface ConnectChildSectionProps {
  endpoint: string 
  reset_endpoint: string
}

export function ConnectChildSection({
  endpoint,
  reset_endpoint,
}: ConnectChildSectionProps) {
  const [connectionString, setConnectionString] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios
      .get(endpoint)
      .then((res) => {
        if (mounted) {
          setConnectionString(res.data?.connectionString || "")
          setError(null)
        }
      })
      .catch((err) => {
        if (mounted){
          setError("Something went wrong")
        }
    
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [endpoint])

  const handleReset = async () => {
    try {
      setResetLoading(true)
      const reset =  await axios.post<{ connectionString: string ,success: boolean }>(reset_endpoint)
  if (reset.data.success) {
    setConnectionString(reset.data.connectionString)
    setResetLoading(false)
  }
      
    } catch (error) {
     setResetLoading(false)
     setError("Something went wrong")
    }
  }


  const maskConnectionString = useMemo(() => {
    if (!connectionString) return ""
    try {
      const url = new URL(connectionString)
      if (url.password) {
        const hidden = "*".repeat(url.password.length)
        url.password = showPassword ? url.password : hidden
      }
      return url.toString()
    } catch {
      return connectionString 
    }
  }, [connectionString, showPassword])

  return (
    <Card className="w-full border-none">

      <CardContent className="flex items-center space-x-2">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading connection string...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border px-3 py-2 text-sm">
              {maskConnectionString}
            </div>
            <Button
              variant="outline"
              className="cursor-pointer"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-end">
      <Button
    variant="secondary"
    className="cursor-pointer"
    onClick={handleReset}
    disabled={resetLoading}
  >
    <RefreshCcw className={`mr-2 h-4 w-4 ${resetLoading ? "animate-spin" : ""}`} />
    {resetLoading ? "Resetting..." : "Reset User & Password"}
  </Button>
      </CardFooter>
    </Card>
  )
}