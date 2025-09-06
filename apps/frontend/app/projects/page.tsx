"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const mockProjects = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenProject = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const handleProjectSettings = (projectId: string) => {
    router.push(`/projects/${projectId}/settings`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your vector database projects</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {showCreateForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <Input placeholder="Enter project name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                  <option>us-east-1 (N. Virginia)</option>
                  <option>us-west-2 (Oregon)</option>
                  <option>eu-west-1 (Ireland)</option>
                  <option>ap-southeast-1 (Singapore)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button>Create Project</Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                </div>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Databases</span>
                  <span className="font-medium">{project.databases}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Calls</span>
                  <span className="font-medium">{project.apiCalls}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium">{project.storage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium text-green-600">{project.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{project.region}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(project.created).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleProjectSettings(project.id)}>
                    Settings
                  </Button>
                  <Button size="sm" onClick={() => handleOpenProject(project.id)}>
                    Open
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
