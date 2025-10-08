"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { rabbitData } from "@/lib/rabbit_api"

export default function AllRabbitmqPage({rabbitmq,projects}: {rabbitmq: rabbitData[],projects: {id: string; name: string}[]}) {
  const [selectedProject, setSelectedProject] = useState("all")

  const filteredRabbitmq = rabbitmq.filter((rb) => {
    const matchesProject = selectedProject === "all" || rb.projectId === selectedProject
    return matchesProject
  })

  const getProjectStats = () => {
    const projectDbs =
      selectedProject === "all" ? rabbitmq : rabbitmq.filter((rb) => rb.projectId === selectedProject)
    const totalSize = projectDbs.reduce((sum, rb) => sum + Number.parseFloat(rb.initialStorage.replace(" GB", "")), 0)
    const healthyCount = projectDbs.filter((rb) => rb.is_provisioned=== true).length

    return {
      total: projectDbs.length,
      size: `${Math.round(totalSize)} GB`,
      healthy: healthyCount,
    }
  }

  const stats = getProjectStats()

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All RabbitMQ</h2>
            <p className="text-muted-foreground">Manage your RabbitMQ and configurations.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/rabbitmq/create">
              <Button className="cursor-pointer">Launch RabbitMQ</Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Project:</span>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProject !== "all" && (
            <Badge variant="outline">{projects.find((p) => p.id === selectedProject)?.name}</Badge>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {selectedProject === "all" ? "Total RabbitMQ" : "Project RabbitMQ"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {selectedProject === "all" ? "Across all projects" : "In this project"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.size}</div>
              <p className="text-xs text-muted-foreground">
                {selectedProject === "all" ? "Total usage" : "Project usage"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy RabbitMQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthy}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total - stats.healthy > 0 ? `${stats.total - stats.healthy} need attention` : "All healthy"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RabbitMQ Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProject === "all"
                ? "All RabbitMQ"
                : `${projects.find((p) => p.id === selectedProject)?.name} RabbitMQ`}
            </CardTitle>
            <CardDescription>
              {selectedProject === "all"
                ? "A list of all your RabbitMQ across all projects."
                : `RabbitMQ in the ${projects.find((p) => p.id === selectedProject)?.name} project.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {selectedProject === "all" && <TableHead>Project</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Region</TableHead>
            
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRabbitmq.map((rb) => (
                  <TableRow key={rb.id}>
                    <TableCell>
                      <div>
                        <Link href={`/rabbitmq/${rb.id}`} className="font-medium hover:underline">
                          {rb.name}
                        </Link>
        
                      </div>
                    </TableCell>
                    {selectedProject === "all" && (
                      <TableCell>
                          <Badge variant="outline">{rb.projectName}</Badge>
                        </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={rb.is_provisioned === true ? "success" : "warning"}>{rb.is_provisioned ? "Provisioned" : "Not Provisioned"}</Badge>
                    </TableCell>
                    <TableCell>{rb.initialStorage}</TableCell>
                    <TableCell>{rb.region}</TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
