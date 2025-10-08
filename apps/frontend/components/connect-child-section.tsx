"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { EyeOff, Eye, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GenericApi {
  getConnection: (id: string,token?:string) => Promise<{ success: boolean; message:string,connectionString: string }>
  resetConnection: (id: string,token?:string) => Promise<{ success: boolean; message:string,connectionString: string }>
}

interface ConnectChildSectionProps {
  api: GenericApi
  resourceId: string
  label?: string
}

export function ConnectChildSection({ api, resourceId, label }: ConnectChildSectionProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [connectionString, setConnectionString] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchConnection() {
      setLoading(true)
      try {
        const connection = await api.getConnection(resourceId)
        if (connection.success) {
          setConnectionString(connection.connectionString)
          toast({
            title: "Success",
            description: `${label ?? "Connection"} string fetched successfully`,
          })
        }
      } catch {
        toast({
          title: "Error",
          description: `Failed to get ${label ?? "connection"} string`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConnection()
  }, [api, resourceId, label])

  const maskedConnection = useMemo(() => {
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

  const handleReset = async () => {
    try {
      setResetLoading(true)
      const reset = await api.resetConnection(resourceId)
      if (reset.success) setConnectionString(reset.connectionString)
    } catch {
      toast({
        title: "Error",
        description: `Failed to reset ${label ?? "connection"} string`,
        variant: "destructive",
      })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Card className="w-full border-none">
      <CardContent className="flex items-center space-x-2">
        <div className="flex-1 rounded-md border px-3 py-2 text-sm bg-muted/30 overflow-x-auto whitespace-nowrap scrollbar-thin">
          {loading ? (
            <RefreshCcw className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-base text-muted-foreground font-mono select-text">
              {maskedConnection}
            </span>
          )}
        </div>

        <Button variant="outline" size="icon" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </CardContent>

      <CardFooter className="justify-end">
        <Button variant="secondary" onClick={handleReset} disabled={resetLoading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${resetLoading ? "animate-spin" : ""}`} />
          {resetLoading ? "Resetting..." : "Reset User & Password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
