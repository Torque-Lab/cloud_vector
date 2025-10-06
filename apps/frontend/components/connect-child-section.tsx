"use client"

import { use, useState, useMemo ,useEffect } from "react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { EyeOff, Eye, RefreshCcw } from "lucide-react"
import { PostgresApi } from "@/lib/pg_api"
import { toast } from "@/hooks/use-toast"

interface ConnectChildSectionProps {
  postgresId: string
}

export function ConnectChildSection({ postgresId }: ConnectChildSectionProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [connectionString, setConnectionString] = useState("")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
  async function getConnection() {
    try {
      const connection = await PostgresApi.getConnection(postgresId)
      if (connection.success) setConnectionString(connection.connectionString)
        toast({
          title: "Success",
          description: "Connection String fetched successfully",
          variant: "default",
        })
    } catch {
    toast({
      title: "Error",
      description: "Failed to get connection string",
      variant: "destructive",
    })
    } finally {
      setLoading(false)
    }
  }

  getConnection()

  }, [postgresId])

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

  const handleReset = async () => {
    try {
      setResetLoading(true)
      const reset = await PostgresApi.resetConnection(postgresId)
      if (reset.success) setConnectionString(reset.connectionString)
    } catch {
      toast({
        title: "Error",
        description: "Failed to reset connection string",
        variant: "destructive",
      })
    } finally {
      setResetLoading(false)
    }
  }

  return (
<Card className="w-full border-none">
  <CardContent className="flex items-center space-x-2">
    <div
      className="flex-1 rounded-md border px-3 py-2 text-sm bg-muted/30 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-md"
    >
      {loading ? (
        <RefreshCcw className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <span className="text-base text-muted-foreground font-mono select-text">
          {maskConnectionString}
        </span>
      )}
    </div>

    <Button
      variant="outline"
      size="icon"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </CardContent>

  <CardFooter className="justify-end">
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={handleReset}
      disabled={resetLoading}
    >
      <RefreshCcw
        className={`mr-2 h-4 w-4 ${resetLoading ? "animate-spin" : ""}`}
      />
      {resetLoading ? "Resetting..." : "Reset User & Password"}
    </Button>
  </CardFooter>
</Card>
  )
}
