"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select } from "@/components/ui/select"
import Link from "next/link"

const databases = [
  {
    id: "db-1",
    name: "product-search-v2",
    description: "Product similarity search for e-commerce",
    status: "healthy",
    dimensions: 768,
    vectors: "2.4M",
    size: "234 GB",
    queries: "1.2M/day",
    region: "us-east-1",
    created: "2024-01-15",
    lastActivity: "2 minutes ago",
    project: "Production App",
    projectId: "1",
  },
  {
    id: "db-2",
    name: "user-embeddings",
    description: "User behavior and preference embeddings",
    status: "healthy",
    dimensions: 512,
    vectors: "890K",
    size: "156 GB",
    queries: "890K/day",
    region: "us-west-2",
    created: "2024-01-10",
    lastActivity: "15 minutes ago",
    project: "Production App",
    projectId: "1",
  },
  {
    id: "db-3",
    name: "content-similarity",
    description: "Content recommendation system",
    status: "warning",
    dimensions: 1024,
    vectors: "567K",
    size: "89 GB",
    queries: "567K/day",
    region: "eu-west-1",
    created: "2024-01-08",
    lastActivity: "1 hour ago",
    project: "Analytics Platform",
    projectId: "3",
  },
  {
    id: "db-4",
    name: "recommendation-engine",
    description: "ML recommendation pipeline",
    status: "healthy",
    dimensions: 256,
    vectors: "234K",
    size: "67 GB",
    queries: "234K/day",
    region: "us-east-1",
    created: "2024-01-05",
    lastActivity: "3 hours ago",
    project: "Development",
    projectId: "2",
  },
  {
    id: "db-5",
    name: "test-vectors",
    description: "Testing and development database",
    status: "healthy",
    dimensions: 384,
    vectors: "45K",
    size: "12 GB",
    queries: "12K/day",
    region: "us-west-2",
    created: "2024-02-01",
    lastActivity: "30 minutes ago",
    project: "Development",
    projectId: "2",
  },
]

const projects = [
  { id: "all", name: "All Projects" },
  { id: "1", name: "Production App" },
  { id: "2", name: "Development" },
  { id: "3", name: "Analytics Platform" },
]

export default function DatabasesPage() {
  const [selectedProject, setSelectedProject] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDatabases = databases.filter((db) => {
    const matchesProject = selectedProject === "all" || db.projectId === selectedProject
    const matchesSearch =
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesProject && matchesSearch
  })

  const getProjectStats = () => {
    const projectDbs =
      selectedProject === "all" ? databases : databases.filter((db) => db.projectId === selectedProject)
    const totalVectors = projectDbs.reduce((sum, db) => {
      const vectorCount =
        Number.parseFloat(db.vectors.replace(/[MK]/g, "")) * (db.vectors.includes("M") ? 1000000 : 1000)
      return sum + vectorCount
    }, 0)
    const totalSize = projectDbs.reduce((sum, db) => sum + Number.parseFloat(db.size.replace(" GB", "")), 0)
    const healthyCount = projectDbs.filter((db) => db.status === "healthy").length

    return {
      total: projectDbs.length,
      vectors:
        totalVectors > 1000000 ? `${(totalVectors / 1000000).toFixed(1)}M` : `${Math.round(totalVectors / 1000)}K`,
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
            <h2 className="text-3xl font-bold tracking-tight">Databases</h2>
            <p className="text-muted-foreground">Manage your vector databases and configurations.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search databases..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href="/databases/create">
              <Button>Create Database</Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Project:</span>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
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
              <CardTitle className="text-sm font-medium">Total Vectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vectors}</div>
              <p className="text-xs text-muted-foreground">
                {selectedProject === "all" ? "All projects" : "This project"}
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
                : `${projects.find((p) => p.id === selectedProject)?.name} Databases`}
            </CardTitle>
            <CardDescription>
              {selectedProject === "all"
                ? "A list of all your vector databases across all projects."
                : `Vector databases in the ${projects.find((p) => p.id === selectedProject)?.name} project.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {selectedProject === "all" && <TableHead>Project</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Vectors</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Queries/Day</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatabases.map((db) => (
                  <TableRow key={db.id}>
                    <TableCell>
                      <div>
                        <Link href={`/databases/${db.id}`} className="font-medium hover:underline">
                          {db.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{db.description}</p>
                      </div>
                    </TableCell>
                    {selectedProject === "all" && (
                      <TableCell>
                        <Badge variant="outline">{db.project}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={db.status === "healthy" ? "success" : "warning"}>{db.status}</Badge>
                    </TableCell>
                    <TableCell>{db.vectors}</TableCell>
                    <TableCell>{db.dimensions}</TableCell>
                    <TableCell>{db.size}</TableCell>
                    <TableCell>{db.queries}</TableCell>
                    <TableCell>{db.region}</TableCell>
                    <TableCell className="text-muted-foreground">{db.lastActivity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/databases/${db.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
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
