"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { OtpInput } from "@/components/ui/otpInput"
import router from "next/router"
import { toast } from "@/hooks/use-toast"
import { VerifySchema } from "@cloud/shared_types"
export default function ForgotPasswordPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      interface User {
        success: boolean;
        message: string;
      }
      if(otp.length < 6){
        toast({
          title: "Error",
          description: "OTP must be 6 digits",
          variant: "destructive",
        })
        return
      }

      const data: VerifySchema | null = JSON.parse(localStorage.getItem("signupdata") ?? "null");
      if (!data) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
        return
      }
      localStorage.removeItem("signupdata")
      data.otp = otp
      const response = await axios.post<User>("/api/v1/auth/otp-verification", data)
      if(response.data.success){
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
         })
        setIsLoading(false)
        setTimeout(() => {
          router.push("/signin")
        }, 2000)

      }else{
        setIsLoading(false)
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
           <Link href="/" className="flex items-center space-x-1">
  <span className="text-logo-teal font-bold text-xl">V</span>
  <span className="text-logo-mint font-bold text-xl">e</span>
  <span className="text-logo-amber font-bold text-xl">c</span>
  <span className="text-logo-violet font-bold text-xl">t</span>
  <span className="text-logo-gray font-bold text-xl">or</span>
  <span className="text-foreground font-bold text-xl"> Cloud</span>
</Link>
          <p className="text-muted-foreground">Enter your OTP to verify your account</p>
        
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
        <OtpInput length={6} 
        value={otp} onChange={setOtp}
        className="w-full justify-center"
        
        
        />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Card>

     
      </div>
    </div>
  )
}
