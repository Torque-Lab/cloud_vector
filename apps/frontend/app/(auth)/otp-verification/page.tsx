"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { OtpInput } from "@/components/ui/otpInput"
import router from "next/router"

export default function ForgotPasswordPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      interface User {
        success: boolean;
        message: string;
      }
      if(otp.length < 6){
        setError("OTP must be 6 digits")
        return
      }
      const response = await axios.post<User>("/api/auth/otp-verification", { otp })
      if(response.data.success){
        setIsSuccess(response.data.message)
        setIsLoading(false)
        setTimeout(() => {
          router.push("/signin")
        }, 2000)

      }else{
        setIsLoading(false)
        setError(response.data.message)
      }
    } catch (error) {
      setIsLoading(false)
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-foreground">VectorDB Cloud</span>
            </Link>
          </div>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-muted-foreground mb-6">
              {isSuccess}
            </p>
          </Card>
        </div>
      </div>
    )
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
            <span className="text-xl font-bold text-foreground">VectorDB Cloud</span>
          </Link>
          <p className="text-muted-foreground">Enter your OTP to verify your account</p>
          {error && <p className="text-red-500">{error}</p>}
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
