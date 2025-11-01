"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import router from "next/router"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      interface User {
        success: boolean;
        message: string;
      }
      const response = await axios.post<User>("/api/v1/auth/forgot-password", { email })
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Forgot your password?</h1>
          <p className="text-muted-foreground">Enter your email and we&apos;ll send you a reset link</p>

        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link href="/signin" className="text-purple-600 hover:text-purple-500 transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
