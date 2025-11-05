"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { pgData } from "@/lib/pg_api"

export default function AllDatabasesPage({databases,projects}: {databases: pgData[],projects: {id: string; name: string}[]}) {
  const [selectedProject, setSelectedProject] = useState("all")

  const filteredDatabases = databases.filter((db) => {
    const matchesProject = selectedProject === "all" || db?.projectId === selectedProject
    return matchesProject
  })

  const getProjectStats = () => {
    const projectDbs =
      selectedProject === "all" ? databases : databases?.filter((db) => db?.projectId === selectedProject)
    const totalSize = projectDbs?.reduce((sum, db) => sum + Number.parseFloat(db?.initialStorage.replace(" GB", "")), 0)
    const healthyCount = projectDbs?.filter((db) => db?.is_provisioned=== true).length

    return {
      total: projectDbs?.length,
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
            <h2 className="text-3xl font-bold tracking-tight">All PostgresSQL</h2>
            <p className="text-muted-foreground">Manage your PostgresSQL databases and configurations.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/postgres/create">
              <Button className="cursor-pointer">Launch PostgresSQL</Button>
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
                  <SelectItem key={project?.id} value={project?.id}>
                    {project?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProject !== "all" && (
            <Badge variant="outline">{projects.find((p) => p?.id === selectedProject)?.name}</Badge>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {selectedProject === "all" ? "Total Databases" : "Project Databases"}
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
              <CardTitle className="text-sm font-medium">Healthy Databases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthy}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total - stats.healthy > 0 ? `${stats.total - stats.healthy} need attention` : "All healthy"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Databases Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProject === "all"
                ? "All Databases"
                : `${projects.find((p) => p?.id === selectedProject)?.name} Databases`}
            </CardTitle>
            <CardDescription>
              {selectedProject === "all"
                ? "A list of all your databases across all projects."
                : `Databases in the ${projects.find((p) => p.id === selectedProject)?.name} project.`}
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
                {filteredDatabases.map((db) => (
                  <TableRow key={db?.id}>
                    <TableCell>
                      <div>
                        <Link href={`/postgres/${db?.id}`} className="font-medium hover:underline">
                          {db?.database_name}
                        </Link>
        
                      </div>
                    </TableCell>
                    {selectedProject === "all" && (
                      <TableCell>
                        <Badge variant="outline">{db?.projectName}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={db?.is_provisioned === true ? "success" : "warning"}>{db?.is_provisioned ? "Provisioned" : "Not Provisioned"}</Badge>
                    </TableCell>
                    <TableCell>{db?.initialStorage}</TableCell>
                    <TableCell>{db?.region}</TableCell>
                   
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
