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
      const response = await axios.post<User>("/api/auth/otp-verification", { otp })
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
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">Vector Cloud</span>
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
