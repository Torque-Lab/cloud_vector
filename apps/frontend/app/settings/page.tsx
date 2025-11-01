"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { RefreshCcw } from "lucide-react"


export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAccountUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      const response = await axios.post<{ message: string,success: boolean }>("/api/v1/account-update", 
      {
        withCredentials: true,
       account
      });
    if (response.data.success) {
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  
  }catch(_){
    toast({
      title: "Error",
      description: "Failed to update account",
      variant: "destructive",
    });
    setIsLoading(false);
  }
}

  const handleSecurityUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }
    try{
      const response = await axios.post<{ message: string,success: boolean }>('/api/v1/security-update', 
      {
      withCredentials: true,
       security
      });
    if (response.data.success) {
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  
  }catch(_){
    toast({
      title: "Error",
      description: "Failed to update security",
      variant: "destructive",
    });
    setIsLoading(false);
  }
  };

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const account = await axios.get<{ firstName: string, lastName: string, email: string, company: string, jobTitle: string,success: boolean,message: string}>('/api/v1/account/settings/account', {
          withCredentials: true,
        });
        if (!account.data.success) {
          toast({
            title: "Error",
            description: account.data?.message || "Failed to load account",
            variant: "destructive",
          });
          return;
        }
        setAccount(account.data);
      
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load account",
          variant: "destructive",
        });
      }
    };
    loadAccount();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAccountUpdate}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input required placeholder="First Name" value={account.firstName} onChange={(e) => setAccount({ ...account, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input required placeholder="Last Name" value={account.lastName} onChange={(e) => setAccount({ ...account, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input readOnly placeholder="Email Address" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input required placeholder="Company" value={account.company} onChange={(e) => setAccount({ ...account, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input required placeholder="Job Title" value={account.jobTitle} onChange={(e) => setAccount({ ...account, jobTitle: e.target.value })} />
                </div>
                <Button type="submit" className="cursor-pointer" disabled={isLoading}>{!isLoading ? "Save Changes" : <RefreshCcw className="animate-spin" />}</Button>
                </form>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSecurityUpdate}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input required type="password" placeholder="Enter current password" value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}/>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input required type="password" placeholder="Enter new password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input required type="password" placeholder="Confirm new password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}/>
                  </div>
                </div>
                <Button type="submit" className="cursor-pointer"disabled={isLoading}>{!isLoading ? "Update Password" : <RefreshCcw className="animate-spin" />}</Button>
                </form>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center space-x-4">
                
                  <Button variant="outline" className="cursor-pointer">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Database Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified about database health and issues</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Usage Alerts</h4>
                      <p className="text-sm text-muted-foreground">Notifications when approaching usage limits</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-muted-foreground">Important security and access notifications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Product Updates</h4>
                      <p className="text-sm text-muted-foreground">News about new features and improvements</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-muted-foreground">Tips, best practices, and promotional content</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Overview of your account status and usage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">Pro</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Resources:</span>
                    <span>12 / 50</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

      

            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Get help and contact support.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Documentation
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4.5m0 0l3-3m-3 3l-3-3m3 3V21"
                    />
                  </svg>
                  Download Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
