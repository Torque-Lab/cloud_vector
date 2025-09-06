import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function SettingsPage() {
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input defaultValue="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input defaultValue="Senior Developer" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Button>Update Password</Button>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            {/* API Settings */}
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>Configure API limits and default settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Rate Limit</label>
                    <Select defaultValue="1000">
                      <option value="100">100 requests/minute</option>
                      <option value="500">500 requests/minute</option>
                      <option value="1000">1000 requests/minute</option>
                      <option value="5000">5000 requests/minute</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Key Expiration</label>
                    <Select defaultValue="1year">
                      <option value="30days">30 days</option>
                      <option value="90days">90 days</option>
                      <option value="1year">1 year</option>
                      <option value="never">Never</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook URL</label>
                  <Input placeholder="https://your-app.com/webhooks/vectordb" />
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about database events and API usage
                  </p>
                </div>
                <Button>Save API Settings</Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
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
                    <span className="text-muted-foreground">Databases:</span>
                    <span>12 / 50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Keys:</span>
                    <span>4 / 20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>847 GB / 1 TB</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Current month's usage statistics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Requests:</span>
                    <span>4.3M</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "43%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">43% of 10M monthly limit</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>847 GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "84.7%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">84.7% of 1TB limit</p>
                </div>
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
