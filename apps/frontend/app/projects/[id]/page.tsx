"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"

const mockProjectData = {
  "1": {
    id: "1",
    name: "Production App",
    description: "Main production environment for customer-facing applications",
    status: "active",
    databases: 5,
    apiCalls: "2.4M",
    storage: "45.2 GB",
    cost: "$234.50",
    created: "2024-01-15",
    region: "us-east-1",
    owner: "john.doe@company.com",
    collaborators: 8,
    lastActivity: "2024-03-15T10:30:00Z",
  },
  "2": {
    id: "2",
    name: "Development",
    description: "Development and testing environment",
    status: "active",
    databases: 3,
    apiCalls: "156K",
    storage: "8.7 GB",
    cost: "$45.20",
    created: "2024-02-01",
    region: "us-west-2",
    owner: "jane.smith@company.com",
    collaborators: 3,
    lastActivity: "2024-03-14T15:45:00Z",
  },
  "3": {
    id: "3",
    name: "Analytics Platform",
    description: "Data analytics and machine learning workloads",
    status: "active",
    databases: 2,
    apiCalls: "890K",
    storage: "128.5 GB",
    cost: "$156.80",
    created: "2024-01-28",
    region: "eu-west-1",
    owner: "mike.wilson@company.com",
    collaborators: 5,
    lastActivity: "2024-03-15T09:20:00Z",
  },
  "4": {
    id: "4",
    name: "Staging Environment",
    description: "Pre-production testing and validation",
    status: "paused",
    databases: 2,
    apiCalls: "45K",
    storage: "12.1 GB",
    cost: "$18.90",
    created: "2024-02-10",
    region: "us-east-1",
    owner: "sarah.johnson@company.com",
    collaborators: 2,
    lastActivity: "2024-03-10T14:15:00Z",
  },
}

const mockDatabases = [
  { id: "db1", name: "user-profiles", status: "active", size: "12.3 GB", queries: "45K/day" },
  { id: "db2", name: "product-catalog", status: "active", size: "8.7 GB", queries: "32K/day" },
  { id: "db3", name: "analytics-data", status: "active", size: "24.2 GB", queries: "18K/day" },
]

const mockActivity = [
  { id: 1, action: "Database created", target: "user-profiles", time: "2 hours ago", user: "John Doe" },
  { id: 2, action: "API key generated", target: "prod-api-key", time: "5 hours ago", user: "Jane Smith" },
  { id: 3, action: "Database backup", target: "product-catalog", time: "1 day ago", user: "System" },
  { id: 4, action: "Settings updated", target: "Project settings", time: "2 days ago", user: "Mike Wilson" },
]

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const project = mockProjectData[projectId as keyof typeof mockProjectData]

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Project not found</h1>
          <Button onClick={() => router.push("/projects")} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/projects")}>
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
            <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/settings`)}>
              Settings
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Databases</p>
                <p className="text-2xl font-bold">{project.databases}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
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
                    d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Calls</p>
                <p className="text-2xl font-bold">{project.apiCalls}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold">{project.storage}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{project.cost}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium">{project.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">{project.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{new Date(project.created).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collaborators</span>
                <span className="font-medium">{project.collaborators}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Activity</span>
                <span className="font-medium">{new Date(project.lastActivity).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.target} • {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Databases */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Databases</h2>
            <Button onClick={() => router.push("/databases/create")}>Create Database</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Size</th>
                  <th className="text-left py-3 px-4 font-medium">Queries/Day</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDatabases.map((db) => (
                  <tr key={db.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{db.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant={db.status === "active" ? "default" : "secondary"}>{db.status}</Badge>
                    </td>
                    <td className="py-3 px-4">{db.size}</td>
                    <td className="py-3 px-4">{db.queries}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
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
