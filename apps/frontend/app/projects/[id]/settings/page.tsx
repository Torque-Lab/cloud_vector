"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"

const mockProjectData = {
  "1": {
    id: "1",
    name: "Production App",
    description: "Main production environment for customer-facing applications",
    status: "active",
    region: "us-east-1",
    owner: "john.doe@company.com",
    created: "2024-01-15",
  },
  "2": {
    id: "2",
    name: "Development",
    description: "Development and testing environment",
    status: "active",
    region: "us-west-2",
    owner: "jane.smith@company.com",
    created: "2024-02-01",
  },
  "3": {
    id: "3",
    name: "Analytics Platform",
    description: "Data analytics and machine learning workloads",
    status: "active",
    region: "eu-west-1",
    owner: "mike.wilson@company.com",
    created: "2024-01-28",
  },
  "4": {
    id: "4",
    name: "Staging Environment",
    description: "Pre-production testing and validation",
    status: "paused",
    region: "us-east-1",
    owner: "sarah.johnson@company.com",
    created: "2024-02-10",
  },
}

const mockCollaborators = [
  { id: 1, name: "John Doe", email: "john.doe@company.com", role: "Owner", avatar: "JD" },
  { id: 2, name: "Jane Smith", email: "jane.smith@company.com", role: "Admin", avatar: "JS" },
  { id: 3, name: "Mike Wilson", email: "mike.wilson@company.com", role: "Developer", avatar: "MW" },
  { id: 4, name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Viewer", avatar: "SJ" },
]

export default function ProjectSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const project = mockProjectData[projectId as keyof typeof mockProjectData]

  const [projectName, setProjectName] = useState(project?.name || "")
  const [projectDescription, setProjectDescription] = useState(project?.description || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
            <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${projectId}`)}>
              ← Back to Project
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Project Settings</h1>
              <p className="text-muted-foreground">{project.name}</p>
            </div>
          </div>
          <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
        </div>

        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                rows={3}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                <option value={project.region}>{project.region}</option>
                <option>us-east-1 (N. Virginia)</option>
                <option>us-west-2 (Oregon)</option>
                <option>eu-west-1 (Ireland)</option>
                <option>ap-southeast-1 (Singapore)</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>

        {/* Team & Access */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Team & Access</h2>
            <Button variant="outline">Invite Member</Button>
          </div>
          <div className="space-y-3">
            {mockCollaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{collaborator.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium">{collaborator.name}</p>
                    <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{collaborator.role}</Badge>
                  {collaborator.role !== "Owner" && (
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* API Keys */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <Button variant="outline">Generate New Key</Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium">Production API Key</p>
                <p className="text-sm text-muted-foreground font-mono">vdb_prod_••••••••••••••••</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Active</Badge>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium">Development API Key</p>
                <p className="text-sm text-muted-foreground font-mono">vdb_dev_••••••••••••••••</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Active</Badge>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 dark:border-red-900/50">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg">
              <div>
                <p className="font-medium">Pause Project</p>
                <p className="text-sm text-muted-foreground">Temporarily disable all databases and API access</p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent"
              >
                {project.status === "active" ? "Pause Project" : "Resume Project"}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg">
              <div>
                <p className="font-medium">Delete Project</p>
                <p className="text-sm text-muted-foreground">Permanently delete this project and all its data</p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Delete Project</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently
                delete all databases, data, and configurations.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent"
                >
                  Delete Project
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
