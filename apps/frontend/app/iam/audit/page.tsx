"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7")

  // Mock audit log data
  const auditLogs = [
    {
      id: "1",
      timestamp: "2024-01-20T10:30:00Z",
      user: "john@example.com",
      action: "user.login",
      resource: "Dashboard",
      details: "Successful login from IP 192.168.1.100",
      severity: "info",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
    },
    {
      id: "2",
      timestamp: "2024-01-20T10:25:00Z",
      user: "admin@example.com",
      action: "role.created",
      resource: "Project Manager Role",
      details: "Created new role with permissions: projects:write, databases:read",
      severity: "medium",
      ipAddress: "192.168.1.50",
      userAgent: "Firefox 121.0.0.0",
    },
    {
      id: "3",
      timestamp: "2024-01-20T10:20:00Z",
      user: "jane@example.com",
      action: "database.accessed",
      resource: "Production Database",
      details: "Executed query on production database",
      severity: "high",
      ipAddress: "192.168.1.75",
      userAgent: "Chrome 120.0.0.0",
    },
    {
      id: "4",
      timestamp: "2024-01-20T10:15:00Z",
      user: "system",
      action: "policy.applied",
      resource: "Project Alpha Access",
      details: "Applied access policy to 5 users",
      severity: "info",
      ipAddress: "internal",
      userAgent: "System",
    },
    {
      id: "5",
      timestamp: "2024-01-20T10:10:00Z",
      user: "bob@example.com",
      action: "login.failed",
      resource: "Authentication",
      details: "Failed login attempt - invalid password",
      severity: "warning",
      ipAddress: "192.168.1.200",
      userAgent: "Chrome 119.0.0.0",
    },
  ]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter)
    const matchesUser = userFilter === "all" || log.user === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "warning":
        return "outline"
      case "info":
        return "default"
      default:
        return "outline"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login")) {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      )
    }
    if (action.includes("created") || action.includes("added")) {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
    if (action.includes("deleted") || action.includes("removed")) {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )
    }
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }

  return (
    <DashboardLayout>

  
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground">Monitor all IAM-related activities and security events</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Log</Button>
          <Link href="/iam/settings">
            <Button variant="outline">Audit Settings</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{auditLogs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Severity</p>
              <p className="text-2xl font-bold">{auditLogs.filter((log) => log.severity === "high").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
              <p className="text-2xl font-bold">{auditLogs.filter((log) => log.action.includes("failed")).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
              <p className="text-2xl font-bold">{new Set(auditLogs.map((log) => log.user)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by user, action, resource, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={actionFilter}>
              <option value="all">All Actions</option>
              <option value="login">Login Events</option>
              <option value="created">Create Events</option>
              <option value="deleted">Delete Events</option>
              <option value="accessed">Access Events</option>
            </Select>
            <Select value={dateRange}>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Timestamp</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Action</th>
                <th className="text-left p-4 font-medium">Resource</th>
                <th className="text-left p-4 font-medium">Severity</th>
                <th className="text-left p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">{log.user.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium">{log.user}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm font-medium">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{log.resource}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate" title={log.details}>
                        {log.details}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{log.ipAddress}</span>
                        <span>•</span>
                        <span>{log.userAgent}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    </DashboardLayout>
  )
}
