"use client"

import { use, useState, useMemo } from "react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { EyeOff, Eye, RefreshCcw } from "lucide-react"
import { PostgresApi } from "@/lib/pg_api"

interface ConnectChildSectionProps {
  postgresId: string
}
const connectionPromiseCache = new Map<string, Promise<{message: string;success: boolean;connectionString: string;}>>()
function getConnectionOnce(postgresId: string) {
  const key = `${postgresId}`
  if (!connectionPromiseCache.has(key)) {
    console.log(typeof PostgresApi.getConnection(postgresId),"type")
    connectionPromiseCache.set(key, PostgresApi.getConnection(postgresId))
  }
  return connectionPromiseCache.get(key)!
}

export function ConnectChildSection({ postgresId }: ConnectChildSectionProps) {
  const result = use(getConnectionOnce(postgresId))

  const [showPassword, setShowPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [connectionString, setConnectionString] = useState(result.connectionString || "")

  const maskConnectionString = useMemo(() => {
    if (!connectionString) return ""
    try {
      const url = new URL(connectionString)
      console.log(url,"url")
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
      console.error("Reset failed")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Card className="w-full border-none">
      <CardContent className="flex items-center space-x-2">
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border px-3 py-2 text-sm">
          {maskConnectionString}
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
          <RefreshCcw className={`mr-2 h-4 w-4 ${resetLoading ? "animate-spin" : ""}`} />
          {resetLoading ? "Resetting..." : "Reset User & Password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
