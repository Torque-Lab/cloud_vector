import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { EyeOff, Eye, RefreshCcw } from "lucide-react"

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
        .get(endpoint,{
          withCredentials: true,
        })
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
        const reset =  await axios.post<{ connectionString: string ,success: boolean }>(reset_endpoint,{
          withCredentials: true,
        })
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