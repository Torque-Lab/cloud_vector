"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const projectData = {
  all: {
    metrics: [
      { title: "Total Databases", value: "12", change: "+2 this month", trend: "up" },
      { title: "API Requests", value: "4.1M", change: "+15% from last month", trend: "up" },
      { title: "Storage Used", value: "1.2 TB", change: "+8.3% from last month", trend: "up" },
      { title: "Avg Query Time", value: "21ms", change: "-12% from last month", trend: "down" },
    ],
    recentActivity: [
      {
        id: 1,
        action: "Database created",
        database: "product-search-v2",
        project: "Production App",
        timestamp: "2 minutes ago",
        status: "success",
      },
      {
        id: 2,
        action: "Index rebuilt",
        database: "user-embeddings",
        project: "Production App",
        timestamp: "15 minutes ago",
        status: "success",
      },
      {
        id: 3,
        action: "Query optimization",
        database: "content-similarity",
        project: "Analytics Platform",
        timestamp: "1 hour ago",
        status: "warning",
      },
      {
        id: 4,
        action: "Backup completed",
        database: "test-vectors",
        project: "Development",
        timestamp: "3 hours ago",
        status: "success",
      },
    ],
    topDatabases: [
      { name: "product-search-v2", project: "Production App", queries: "1.2M", size: "234 GB", status: "healthy" },
      { name: "user-embeddings", project: "Production App", queries: "890K", size: "156 GB", status: "healthy" },
      { name: "content-similarity", project: "Analytics Platform", queries: "567K", size: "89 GB", status: "warning" },
      { name: "recommendation-engine", project: "Development", queries: "234K", size: "67 GB", status: "healthy" },
    ],
    storageBreakdown: [
      { project: "Production App", storage: "390 GB", percentage: 32.5 },
      { project: "Analytics Platform", storage: "480 GB", percentage: 40 },
      { project: "Development", storage: "330 GB", percentage: 27.5 },
    ],
  },
  "1": {
    metrics: [
      { title: "Project Databases", value: "5", change: "+1 this month", trend: "up" },
      { title: "API Requests", value: "2.4M", change: "+12% from last month", trend: "up" },
      { title: "Storage Used", value: "390 GB", change: "+5.2% from last month", trend: "up" },
      { title: "Avg Query Time", value: "18ms", change: "-8% from last month", trend: "down" },
    ],
    recentActivity: [
      {
        id: 1,
        action: "Database created",
        database: "product-search-v2",
        project: "Production App",
        timestamp: "2 minutes ago",
        status: "success",
      },
      {
        id: 2,
        action: "Index rebuilt",
        database: "user-embeddings",
        project: "Production App",
        timestamp: "15 minutes ago",
        status: "success",
      },
      {
        id: 3,
        action: "Scale up completed",
        database: "product-search-v2",
        project: "Production App",
        timestamp: "2 hours ago",
        status: "success",
      },
      {
        id: 4,
        action: "Backup completed",
        database: "user-embeddings",
        project: "Production App",
        timestamp: "4 hours ago",
        status: "success",
      },
    ],
    topDatabases: [
      { name: "product-search-v2", project: "Production App", queries: "1.2M", size: "234 GB", status: "healthy" },
      { name: "user-embeddings", project: "Production App", queries: "890K", size: "156 GB", status: "healthy" },
    ],
    storageBreakdown: [{ project: "Production App", storage: "390 GB", percentage: 100 }],
  },
  "2": {
    metrics: [
      { title: "Project Databases", value: "3", change: "+1 this month", trend: "up" },
      { title: "API Requests", value: "246K", change: "+8% from last month", trend: "up" },
      { title: "Storage Used", value: "79 GB", change: "+15% from last month", trend: "up" },
      { title: "Avg Query Time", value: "25ms", change: "-5% from last month", trend: "down" },
    ],
    recentActivity: [
      {
        id: 1,
        action: "Database created",
        database: "test-vectors",
        project: "Development",
        timestamp: "1 hour ago",
        status: "success",
      },
      {
        id: 2,
        action: "Index optimization",
        database: "recommendation-engine",
        project: "Development",
        timestamp: "3 hours ago",
        status: "success",
      },
      {
        id: 3,
        action: "Backup completed",
        database: "test-vectors",
        project: "Development",
        timestamp: "6 hours ago",
        status: "success",
      },
    ],
    topDatabases: [
      { name: "recommendation-engine", project: "Development", queries: "234K", size: "67 GB", status: "healthy" },
      { name: "test-vectors", project: "Development", queries: "12K", size: "12 GB", status: "healthy" },
    ],
    storageBreakdown: [{ project: "Development", storage: "79 GB", percentage: 100 }],
  },
  "3": {
    metrics: [
      { title: "Project Databases", value: "2", change: "No change", trend: "neutral" },
      { title: "API Requests", value: "567K", change: "+18% from last month", trend: "up" },
      { title: "Storage Used", value: "480 GB", change: "+12% from last month", trend: "up" },
      { title: "Avg Query Time", value: "28ms", change: "+3% from last month", trend: "up" },
    ],
    recentActivity: [
      {
        id: 1,
        action: "Query optimization",
        database: "content-similarity",
        project: "Analytics Platform",
        timestamp: "1 hour ago",
        status: "warning",
      },
      {
        id: 2,
        action: "Data ingestion",
        database: "ml-features",
        project: "Analytics Platform",
        timestamp: "4 hours ago",
        status: "success",
      },
      {
        id: 3,
        action: "Index rebuilt",
        database: "content-similarity",
        project: "Analytics Platform",
        timestamp: "8 hours ago",
        status: "success",
      },
    ],
    topDatabases: [
      { name: "content-similarity", project: "Analytics Platform", queries: "567K", size: "89 GB", status: "warning" },
      { name: "ml-features", project: "Analytics Platform", queries: "123K", size: "391 GB", status: "healthy" },
    ],
    storageBreakdown: [{ project: "Analytics Platform", storage: "480 GB", percentage: 100 }],
  },
}

const projects = [
  { id: "all", name: "All Projects" },
  { id: "1", name: "Production App" },
  { id: "2", name: "Development" },
  { id: "3", name: "Analytics Platform" },
]

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState("all")
  const currentData = projectData[selectedProject as keyof typeof projectData]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              {selectedProject === "all"
                ? "Overview of all your projects and vector databases."
                : `${projects.find((p) => p.id === selectedProject)?.name} project overview.`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
            <Button>Create Database</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {currentData.metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">
                  {metric.trend === "up" ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : metric.trend === "down" ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Query Performance Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Query Performance</CardTitle>
              <CardDescription>
                {selectedProject === "all"
                  ? "Average response time across all projects over the last 7 days"
                  : `${projects.find((p) => p.id === selectedProject)?.name} response time over the last 7 days`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentData.metrics.find((m) => m.title.includes("Query Time"))?.value}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Query Time</p>
                  <div className="mt-4 flex justify-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>This Week</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span>Last Week</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {selectedProject === "all"
                  ? "Latest updates from all projects"
                  : `Latest updates from ${projects.find((p) => p.id === selectedProject)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.database}
                        {selectedProject === "all" && (
                          <span className="ml-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.project}
                            </Badge>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Databases</CardTitle>
              <CardDescription>
                {selectedProject === "all"
                  ? "Most active databases across all projects by query volume"
                  : `Most active databases in ${projects.find((p) => p.id === selectedProject)?.name} by query volume`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.topDatabases.map((db) => (
                  <div key={db.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{db.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {db.queries} queries • {db.size}
                          {selectedProject === "all" && <span className="ml-2">• {db.project}</span>}
                        </p>
                      </div>
                    </div>
                    <Badge variant={db.status === "healthy" ? "success" : "warning"}>{db.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                {selectedProject === "all"
                  ? "Storage utilization breakdown by project"
                  : `${projects.find((p) => p.id === selectedProject)?.name} storage utilization`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProject === "all" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Storage</span>
                      <span className="text-sm text-muted-foreground">1.2 TB / 2 TB</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <div className="space-y-2">
                      {currentData.storageBreakdown.map((item) => (
                        <div key={item.project} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  item.project === "Production App"
                                    ? "#3b82f6"
                                    : item.project === "Analytics Platform"
                                      ? "#10b981"
                                      : "#f59e0b",
                              }}
                            ></div>
                            <span className="text-muted-foreground">{item.project}</span>
                          </div>
                          <span className="font-medium">{item.storage}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Used Storage</span>
                      <span className="text-sm text-muted-foreground">
                        {currentData.storageBreakdown[0].storage} / 500 GB
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min(currentData.storageBreakdown[0].percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vector Data</p>
                        <p className="font-medium">
                          {Math.round(Number.parseFloat(currentData.storageBreakdown[0].storage) * 0.75)} GB
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Indexes</p>
                        <p className="font-medium">
                          {Math.round(Number.parseFloat(currentData.storageBreakdown[0].storage) * 0.25)} GB
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Create Database</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm">Create Project</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span className="text-sm">Generate API Key</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm">View Usage</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
