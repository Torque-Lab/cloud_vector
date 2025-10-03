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
    postgres: 5,
    redis: 2,
    rabbitMQ: 1,
    vm: 1,
    cost: "$234.50",
    created: "2024-01-15",
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
            <p className="text-muted-foreground">Manage All projects</p>
          </div>
        </div>

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
                  <span className="text-muted-foreground">Postgres</span>
                  <span className="font-medium">{project.postgres}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Redis</span>
                  <span className="font-medium">{project.redis}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">RabbitMQ</span>
                  <span className="font-medium">{project.rabbitMQ}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VM</span>
                  <span className="font-medium">{project.vm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium text-green-600">{project.cost}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(project.created).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" className="cursor-pointer" onClick={() => handleProjectSettings(project.id)}>
                    Settings
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
