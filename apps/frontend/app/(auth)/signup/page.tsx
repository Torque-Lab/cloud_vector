"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setIsPasswordNotMatch(true);
      return;
    }
    if (!agreedToTerms) {
      setAgreedToTerms(false);

      return;
    }
    setIsLoading(true);
    try {
      interface User {
        success: boolean;
        message: string;
      }
      const {email,password,firstName,lastName} = formData
      localStorage.setItem("signupdata", JSON.stringify({email,password,firstName,lastName}));
      const response = await axios.post<User>("/api/auth/signup", formData);
      if (response.data.success) {
       toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
       })
        setIsLoading(false);
        router.push("/otp-verification");
      }else{
        setIsLoading(false);
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      })
      }

    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsPasswordNotMatch(false);
    setAgreedToTerms(false);
  };

  const handleSocialSignUp = (provider: "google" | "github") => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      `/api/auth/${provider}`,
      "SocialLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Vector Cloud
            </span>
          </Link>
          <p className="text-muted-foreground">
            Get started with your free account today
          </p>
        </div>

        <Card className="p-6">
          {/* Social Sign Up */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full bg-transparent cursor-pointer"
              onClick={() => handleSocialSignUp("google")}
            >
            <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent dark:bg-transparent dark:text-white fill-current cursor-pointer"
              onClick={() => handleSocialSignUp("github")}
            >
              <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
</svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="text-xs text-muted-foreground">
              <ol className="list-disc list-inside">
                <li>At least 8 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*)</li>
              </ol>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={isPasswordNotMatch ? "border-red-500" : ""}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={isPasswordNotMatch ? "border-red-500" : ""}
                required
              />
            </div>
            <div className="flex items-start">
            <label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    id="terms"
    className="hidden peer"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
  />
  <span
    className={`h-4 w-4 rounded-sm flex items-center justify-center 
      ${!agreedToTerms ? "border-2 border-red-500" : "border border-gray-400"} 
      peer-checked:bg-blue-600 peer-checked:text-white`}
  >
    { agreedToTerms && (
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </span>
</label>
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-muted-foreground"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-purple-600 hover:text-purple-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
