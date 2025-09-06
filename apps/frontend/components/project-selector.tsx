"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const mockProjects = [
  { id: "1", name: "Production App", description: "Main production environment" },
  { id: "2", name: "Development", description: "Development and testing" },
  { id: "3", name: "Analytics Platform", description: "Data analytics workloads" },
]

export function ProjectSelector() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project</span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </Button>
      </div>

      <Select
        value={selectedProject.id}
        onValueChange={(value) => {
          const project = mockProjects.find((p) => p.id === value)
          if (project) setSelectedProject(project)
        }}
      >
        {mockProjects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </Select>

      <p className="text-xs text-muted-foreground mt-1 truncate">{selectedProject.description}</p>
    </div>
  )
}
