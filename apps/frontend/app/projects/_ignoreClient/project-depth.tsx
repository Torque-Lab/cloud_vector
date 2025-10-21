"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {projectDataDetails} from "@cloud/shared_types"


export default function ProjectSettingsDetailsPage({projectDataDetails}: {projectDataDetails: projectDataDetails    }) {

const router = useRouter()
  const [projectName, setProjectName] = useState(projectDataDetails.name || "")
  const [projectDescription, setProjectDescription] = useState(projectDataDetails.description || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!projectDataDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Project not found</h1>
          <Button className="cursor-pointer" onClick={() => router.push("/projects")}>
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
            <Button size="sm" className="cursor-pointer" onClick={() => router.push(`/projects`)}>
              ← Back to Project
            </Button>
          </div>
        
        </div>

        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <Input
              readOnly
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
            <div className="flex justify-end">
              <Button className="cursor-pointer">Save Changes</Button>
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
            {projectDataDetails.team.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center space-x-3">
                
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
                {projectDataDetails?.status === "active" ? "Pause Project" : "Resume Project"}
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
                Are you sure you want to delete "{projectDataDetails?.name}"? This action cannot be undone and will permanently
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
