"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectData } from "@cloud/shared_types"
import { parseDateWithLocale } from "@/lib/utils"

export default function ProjectsPage({projectData}: {projectData: ProjectData[]}) {
  const router = useRouter()
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
          {projectData.map((project) => (
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
                {parseDateWithLocale(project.createdAt)}
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
