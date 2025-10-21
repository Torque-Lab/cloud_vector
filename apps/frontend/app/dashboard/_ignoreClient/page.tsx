"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gem } from "lucide-react"
import { useRouter } from "next/navigation"
import {DashboardDataType} from "@cloud/shared_types"

export default function DashboardClientPage({data,projects}: {data: DashboardDataType,projects: {id: string; name: string;}[]}) {
  const [selectedProject, setSelectedProject] = useState("all")
  const currentData = data.allData[selectedProject]
  const router=useRouter()
  const parseStorage = (str: string) => {
  const value = parseFloat(str);
  if (str.toLowerCase().includes("ti")) return value * 1024;
  if (str.toLowerCase().includes("gi")) return value;
  if (str.toLowerCase().includes("mi")) return value / 1024;
  return value; 
};
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              {selectedProject === "all"
                ? "Overview of all your projects and Resources."
                : `${projects?.find((p) => p.id === selectedProject)?.name} project overview.`}
            </p>
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
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {currentData?.metrics?.map((metric) => (
            <Card key={metric?.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric?.title}</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">
                  {metric?.trend === "up" ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : metric?.trend === "down" ? (
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
                <div className="text-2xl font-bold">{metric?.value}</div>
                <p className="text-xs text-muted-foreground">{metric?.change}</p>
              </CardContent>
            </Card>
          ))}
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
                {currentData?.topDatabases?.map((db) => (
                  <div key={db?.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{db?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {db?.queries} queries • {db?.size}
                          {selectedProject === "all" && <span className="ml-2">• {db?.project}</span>}
                        </p>
                      </div>
                    </div>
                    <Badge variant={db?.status === "healthy" ? "success" : "warning"}>{db?.status}</Badge>
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
                  : `${projects?.find((p) => p.id === selectedProject)?.name} storage utilization`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProject === "all" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Storage</span>
                      <span className="text-sm text-muted-foreground">{data.allData.all?.storageBreakdown?.reduce((total, item) => total + parseStorage(item.storage), 0).toFixed(2)} GB</span>
                    </div>

                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Storage</span>
                      <span className="text-sm text-muted-foreground">
                        {currentData?.storageBreakdown?.[0]?.storage}
                      </span>
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
            <Button 
             onClick={()=>router.push("/iam")}
            variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
              <Gem/>
                <span className="text-sm">IAM</span>
              </Button>
              <Button 
              onClick={()=>router.push("postgres/create")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Launch PostgreSQL</span>
              </Button>
            
              <Button 
              onClick={()=>router.push("/vm/launch")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Launch VM</span>
              </Button>
              <Button 
              onClick={()=>router.push("/redis/create")}
              
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Launch Redis</span>
              </Button>
              <Button 
              onClick={()=>router.push("rabbitmq/create")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Launch RabbitMQ</span>
              </Button>
              <Button 
              onClick={()=>router.push("/api-keys")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
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
              <Button 
              onClick={()=>router.push("/iam/users/invite")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Add Team</span>
              </Button>
              <Button 
              onClick={()=>router.push("/usage")}
              variant="outline" className="h-20 flex-col space-y-2 cursor-pointer">
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
