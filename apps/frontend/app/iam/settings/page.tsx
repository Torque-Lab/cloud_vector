"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function IAMSettingsPage() {
  const [settings, setSettings] = useState({
    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      maxAge: 90,
    },
    sessionSettings: {
      maxDuration: 8,
      idleTimeout: 30,
      requireMFA: false,
    },
    // Access Settings
    defaultRole: "Viewer",
    autoApproveInvites: false,
    allowSelfRegistration: false,
    // Integration Settings
    ssoEnabled: false,
    ldapEnabled: false,
    // Audit Settings
    auditRetention: 365,
    logAllAccess: true,
    alertOnSuspiciousActivity: true,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle settings save logic here
    console.log("Saving IAM settings:", settings)
  }

  return (
    <DashboardLayout>


    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IAM Settings</h1>
          <p className="text-muted-foreground">Configure organization-wide identity and access management settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/iam/audit">
            <Button variant="outline">View Audit Log</Button>
          </Link>
          <Link href="/iam/compliance">
            <Button variant="outline">Compliance Report</Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Security Policies */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Security Policies</h2>
              <Badge variant="outline">Organization-wide</Badge>
            </div>

            {/* Password Policy */}
            <div className="space-y-4 border-l-2 border-blue-200 dark:border-blue-800 pl-4">
              <h3 className="font-medium">Password Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Length</label>
                  <Input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        passwordPolicy: { ...settings.passwordPolicy, minLength: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Expiry (days)</label>
                  <Input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.passwordPolicy.maxAge}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        passwordPolicy: { ...settings.passwordPolicy, maxAge: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "requireUppercase", label: "Uppercase Letters" },
                  { key: "requireLowercase", label: "Lowercase Letters" },
                  { key: "requireNumbers", label: "Numbers" },
                  { key: "requireSymbols", label: "Symbols" },
                ].map((requirement) => (
                  <div key={requirement.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={requirement.key}
                      checked={
                        settings.passwordPolicy[requirement.key as keyof typeof settings.passwordPolicy] as boolean
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, [requirement.key]: e.target.checked },
                        })
                      }
                    />
                    <label htmlFor={requirement.key} className="text-sm">
                      {requirement.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Settings */}
            <div className="space-y-4 border-l-2 border-green-200 dark:border-green-800 pl-4">
              <h3 className="font-medium">Session Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Session Duration (hours)</label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={settings.sessionSettings.maxDuration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionSettings: { ...settings.sessionSettings, maxDuration: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idle Timeout (minutes)</label>
                  <Input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.sessionSettings.idleTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionSettings: { ...settings.sessionSettings, idleTimeout: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireMFA"
                  checked={settings.sessionSettings.requireMFA}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionSettings: { ...settings.sessionSettings, requireMFA: e.target.checked },
                    })
                  }
                />
                <label htmlFor="requireMFA" className="text-sm">
                  Require Multi-Factor Authentication for all users
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Access Control Settings */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Access Control</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Role for New Users</label>
                <Select
                  value={settings.defaultRole}
                  onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value })}
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoApproveInvites"
                  checked={settings.autoApproveInvites}
                  onChange={(e) => setSettings({ ...settings, autoApproveInvites: e.target.checked })}
                />
                <label htmlFor="autoApproveInvites" className="text-sm">
                  Auto-approve user invitations
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowSelfRegistration"
                  checked={settings.allowSelfRegistration}
                  onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })}
                />
                <label htmlFor="allowSelfRegistration" className="text-sm">
                  Allow self-registration with email verification
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Integration Settings */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">External Integrations</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Single Sign-On (SSO)</h3>
                  <p className="text-sm text-muted-foreground">Enable SAML/OAuth SSO integration</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ssoEnabled"
                    checked={settings.ssoEnabled}
                    onChange={(e) => setSettings({ ...settings, ssoEnabled: e.target.checked })}
                  />
                  <Button variant="outline" size="sm" disabled={!settings.ssoEnabled}>
                    Configure
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">LDAP Integration</h3>
                  <p className="text-sm text-muted-foreground">Connect to Active Directory or LDAP server</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ldapEnabled"
                    checked={settings.ldapEnabled}
                    onChange={(e) => setSettings({ ...settings, ldapEnabled: e.target.checked })}
                  />
                  <Button variant="outline" size="sm" disabled={!settings.ldapEnabled}>
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Audit & Compliance */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Audit & Compliance</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Audit Log Retention (days)</label>
                <Input
                  type="number"
                  min="30"
                  max="2555"
                  value={settings.auditRetention}
                  onChange={(e) => setSettings({ ...settings, auditRetention: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="logAllAccess"
                  checked={settings.logAllAccess}
                  onChange={(e) => setSettings({ ...settings, logAllAccess: e.target.checked })}
                />
                <label htmlFor="logAllAccess" className="text-sm">
                  Log all resource access attempts
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="alertOnSuspiciousActivity"
                  checked={settings.alertOnSuspiciousActivity}
                  onChange={(e) => setSettings({ ...settings, alertOnSuspiciousActivity: e.target.checked })}
                />
                <label htmlFor="alertOnSuspiciousActivity" className="text-sm">
                  Alert administrators on suspicious activity
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button variant="outline" type="button">
            Reset to Defaults
          </Button>
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  )
}
