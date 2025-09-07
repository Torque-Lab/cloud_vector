"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { databaseApi } from "@/lib/api"
import Link from "next/link"
import { useEffect } from "react"

interface Project {
  id: string
  name: string
}

export default function CreateDatabasePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "my-postgres-db",
    projectId: "",
    region: "us-east-1",
   initialMemory: "200",
   maxMemory: "200",
   initialStorage: "200",
   maxStorage: "200",
   initialVCpu: "2",
   maxVCpu: "2",
   autoScale: "false",
   backFrequency: "daily",
    
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await databaseApi.getProjects()
        setProjects(projects)
        if (projects.length > 0) {
          setFormData(prev => ({
            ...prev,
            projectId: projects[0]!.id
          }))
        }
      } catch (error) {
        console.error("Failed to load projects:", error)
        setProjectsError("Failed to load projects. Please try again later.")
      } finally {
        setIsProjectsLoading(false)
      }
    }
    
    loadProjects()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Database name is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.projectId) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const newDb = await databaseApi.createDatabase({
        name: formData.name,
        projectId: formData.projectId,
        region: formData.region,
            initialMemory: parseInt(formData.initialMemory, 10),
            maxMemory: parseInt(formData.maxMemory, 10),
            initialStorage: parseInt(formData.initialStorage, 10),
            maxStorage: parseInt(formData.maxStorage, 10),
            initialVCpu: parseInt(formData.initialVCpu, 10),
            maxVCpu: parseInt(formData.maxVCpu, 10),
            autoScale: formData.autoScale,
            backFrequency: formData.backFrequency as "daily" | "weekly" | "monthly"
      })

      toast({
        title: "Database created",
        description: `${formData.name} has been created successfully!`,
      })
      
      // Redirect to the new database
      router.push(`/postgres/${newDb.id}`)
    } catch (error) {
      console.error("Failed to create database:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create database",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Postgres instance</h2>
            <p className="text-muted-foreground">Set up a new Postgres instance with your preferred configuration.</p>
          </div>
          <Link href="/postgres">
            <Button variant="outline">Back to Postgres</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter your database details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Database Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="my-vector-db"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      A unique name for your database. Only lowercase letters, numbers, and hyphens are allowed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    {isProjectsLoading ? (
                      <div className="h-10 w-full rounded-md border bg-muted animate-pulse" />
                    ) : projectsError ? (
                      <div className="text-sm text-red-500">{projectsError}</div>
                    ) : (
                      <Select
                        name="projectId"
                        value={formData.projectId}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, projectId: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>Configure your database settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="initialMemory">Initial Memory</Label>
                      <Select
                        name="initialMemory"
                        value={formData.initialMemory}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, initialMemory: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select initial memory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">200MB</SelectItem>
                          <SelectItem value="500">500MB</SelectItem>
                          <SelectItem value="1024">1GB</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Initial memory for your database (e.g., 200MB )
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialStorage">Initial Storage</Label>
                      <Select
                        name="initialStorage"
                        value={formData.initialStorage}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, initialStorage: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select initial storage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5GB</SelectItem>
                          <SelectItem value="10">10GB</SelectItem>
                          <SelectItem value="20">20GB</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Initial storage for your database (e.g., 5GB for OpenAI embeddings)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialVCpu">Initial VCPU</Label>
                      <Select
                        name="initialVCpu"
                        value={formData.initialVCpu}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, initialVCpu: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select initial vcpu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1vCPU</SelectItem>
                          <SelectItem value="2">2vCPU</SelectItem>
                          <SelectItem value="4">4vCPU</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxVCpu">Max VCPU</Label>
                    <Select
                      name="maxVCpu"
                      value={formData.maxVCpu}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, maxVCpu: value }))
                      }
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max vcpu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1vCPU</SelectItem>
                      <SelectItem value="2">2vCPU</SelectItem>
                      <SelectItem value="4">4vCPU</SelectItem>
                    </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="autoScale">Auto Scale</Label>
                    <Select
                      name="autoScale"
                      value={formData.autoScale}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, autoScale: value }))
                      }
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Auto scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        name="region"
                        value={formData.region}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, region: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Review your configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Project</span>
                      <span className="text-sm font-medium">
                        {projects.find(p => p.id === formData.projectId)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Initial Memory</span>
                      <span className="text-sm font-medium">{formData.initialMemory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max storage</span>
                      <span className="text-sm font-medium">{formData.maxStorage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max vcpu</span>
                      <span className="text-sm font-medium">{formData.maxVCpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Auto scale</span>
                      <span className="text-sm font-medium">{formData.autoScale}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Cost</span>
                      <span className="font-bold">$29.99/month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed monthly. 30-day money-back guarantee.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || projectsError !== null}
                >
                  {isLoading ? "Creating..." : "Create Database"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By creating a database, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
