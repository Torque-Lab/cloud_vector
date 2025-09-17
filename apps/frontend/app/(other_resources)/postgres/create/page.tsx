"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
    name: "",
    projectId: "",
    region: "",
   initialMemory: "",
   maxMemory: "",
   initialStorage: "",
   maxStorage: "",
   initialVCpu: "",
   maxVCpu: "",
   autoScale: "",
   backFrequency: "",
    
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await databaseApi.getProjects()
        setProjects(projects ?? [])
        if (projects?.length > 0) {
          setFormData(prev => ({
            ...prev,
            projectId: projects[0]?.id || ""
          }))
        }
      } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load projects",
        variant: "destructive"
      })
      } finally {
        setIsProjectsLoading(false)
      }
    }
    
    loadProjects()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

function parseSizeToBytes(value: string | undefined | null): number | null {
  if (value == null) return null
  const s = String(value).trim()
  if (!s) return null

  // Accept "200Mi", "2Gi", "10GiB", "512M", "123", "1.5G", "1T", "1TiB"
  const m = s.match(/^([0-9]*\.?[0-9]+)\s*([a-zA-Z]+)?$/)
  if (!m) return null

  const num = parseFloat(m[1]!)
  if (Number.isNaN(num)) return null

  // normalize unit: remove trailing "b" or "ib" e.g. "MiB" -> "mi", "GiB" -> "gi"
  let unit = (m[2] || "").toLowerCase()
  unit = unit.replace(/i?b$/i, "") // removes "b" or "ib" if present

  // decimal (SI) vs binary (IEC)
  const multipliers: Record<string, number> = {
    // binary (iec)
    ki: 1024,
    mi: 1024 ** 2,
    gi: 1024 ** 3,
    ti: 1024 ** 4,
    pi: 1024 ** 5,
    ei: 1024 ** 6,
    // decimal (si)
    k: 1000,
    m: 1000 ** 2,
    g: 1000 ** 3,
    t: 1000 ** 4,
    p: 1000 ** 5,
    e: 1000 ** 6,
  }

  // no unit => treat as bytes (you can change to assume bytes or MiB as you prefer)
  if (!unit) return num

  // allow single-letter units like "M" or "G" and "Mi"/"Gi"
  const mult = multipliers[unit]
  return mult ? num * mult : null
}

function parseCpuToCores(value: string | undefined | null): number | null {
  if (value == null) return null
  const s = String(value).trim()
  if (!s) return null

  // Accept "500m" (millicores), "0.5", "2"
  const m = s.match(/^([0-9]*\.?[0-9]+)\s*(m)?$/i)
  if (!m) return null
  const num = parseFloat(m[1]!)
  if (Number.isNaN(num)) return null
  // if "m" suffix => millicores => divide by 1000
  return m[2] ? num / 1000 : num
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validations = [
      { field: "name", message: "Database name is required" },
      { field: "projectId", message: "Please select a project" },
      { field: "region", message: "Please select a region" },
      { field: "initialMemory", message: "Initial memory is required" },
      { field: "maxMemory", message: "Max memory is required" },
      { field: "initialStorage", message: "Initial storage is required" },
      { field: "maxStorage", message: "Max storage is required" },
      { field: "initialVCpu", message: "Initial vCPU is required" },
      { field: "maxVCpu", message: "Max vCPU is required" },
      { field: "autoScale", message: "Auto scale setting is required" },
      { field: "backFrequency", message: "Backup frequency is required" },
    ]
    const numericChecks = [
      { min: "initialMemory", max: "maxMemory", label: "Memory", kind: "bytes" },
      { min: "initialStorage", max: "maxStorage", label: "Storage", kind: "bytes" },
      { min: "initialVCpu", max: "maxVCpu", label: "vCPU", kind: "cpu" },
    ]
    for (const { field, message } of validations) {
      const value = formData[field as keyof typeof formData]
      if (!value || (typeof value === "string" && !value.trim())) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
        return
      }
    }
  
    for (const { min, max, label, kind } of numericChecks) {
      const minRaw = (formData as unknown as Record<string, string>)[min]
      const maxRaw = (formData as unknown as Record<string, string>)[max]
  
      const minVal =
        kind === "cpu" ? parseCpuToCores(minRaw) : parseSizeToBytes(minRaw)
      const maxVal =
        kind === "cpu" ? parseCpuToCores(maxRaw) : parseSizeToBytes(maxRaw)
  
      if (minVal === null) {
        toast({
          title: "Error",
          description: `${label}: invalid value for ${min} ("${minRaw}")`,
          variant: "destructive",
        })
        return
      }
      if (maxVal === null) {
        toast({
          title: "Error",
          description: `${label}: invalid value for ${max} ("${maxRaw}")`,
          variant: "destructive",
        })
        return
      }
  
      if (maxVal < minVal) {
        toast({
          title: "Error",
          description: `${label}: Max should be greater than or equal to Initial`,
          variant: "destructive",
        })
        return
      }
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
        title: "Database provisioning added to Task Queue",
        description: `${formData.name} will be created soon!`,
      })
      
      // Redirect to the new database
      router.push(`/postgres/${newDb.id}`)
    } catch (error) {
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
      <div className="flex-1 space-y-6 p-6 h-full ">
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
                      placeholder="my-postgres-db"
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
                     ):(
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
  {projects?.length > 0 ? (
    projects.map((project) => (
      <SelectItem key={project.id} value={project.id}>
        {project.name}
      </SelectItem>
    ))
  ) : (
    <SelectItem key="no-projects" value="1">
      No projects found
    </SelectItem>
  )}
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
                          <SelectItem value="200Mi">200MB</SelectItem>
                          <SelectItem value="500Mi">500MB</SelectItem>
                          <SelectItem value="1Gi">1GB</SelectItem>
                          <SelectItem value="2Gi">2GB</SelectItem>
                          <SelectItem value="4Gi">4GB</SelectItem>
                          <SelectItem value="8Gi">8GB</SelectItem>
                         
                        </SelectContent>
                      </Select>
              
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxMemory">Max Memory</Label>
                      <Select
                        name="maxMemory"
                        value={formData.maxMemory}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, maxMemory: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select max memory" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="4Gi">4GB</SelectItem>
                        <SelectItem value="8Gi">8GB</SelectItem>
                        <SelectItem value="16Gi">16GB</SelectItem>
                          <SelectItem value="32Gi">32GB</SelectItem>
                          <SelectItem value="64Gi">64GB</SelectItem>
                          <SelectItem value="128Gi">128GB</SelectItem>
                          <SelectItem value="256Gi">256GB</SelectItem>
                          <SelectItem value="512Gi">512GB</SelectItem>
                        </SelectContent>
                      </Select>
                      
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
                        <SelectItem value="5Gi">5GB</SelectItem>
                          <SelectItem value="10Gi">10GB</SelectItem>
                          <SelectItem value="20Gi">20GB</SelectItem>
                          <SelectItem value="40Gi">40GB</SelectItem>
                          <SelectItem value="80Gi">80GB</SelectItem>
                          <SelectItem value="160Gi">160GB</SelectItem>
                        </SelectContent>
                      </Select>
                      
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxStorage">Max Storage</Label>
                      <Select
                        name="maxStorage"
                        value={formData.maxStorage}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, maxStorage: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select max storage" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="5Gi">5GB</SelectItem>
                          <SelectItem value="10Gi">10GB</SelectItem>
                          <SelectItem value="20Gi">20GB</SelectItem>
                          <SelectItem value="40Gi">40GB</SelectItem>
                          <SelectItem value="80Gi">80GB</SelectItem>
                          <SelectItem value="160Gi">160GB</SelectItem>
                        </SelectContent>
                      </Select>
                      
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialVCpu">Initial vCPU</Label>
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
                          <SelectItem value="8">8vCPU</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxVCpu">Max vCPU</Label>
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
                      <SelectItem value="4">4vCPU</SelectItem>
                      <SelectItem value="8">8vCPU</SelectItem>
                      <SelectItem value="16">16vCPU</SelectItem>
                      <SelectItem value="32">32vCPU</SelectItem>
                      <SelectItem value="64">64vCPU</SelectItem>
                     
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
                      <Label htmlFor="backFrequency">Backup Frequency</Label>
                    <Select
                      name="backFrequency"
                      value={formData.backFrequency}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, backFrequency: value }))
                      }
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                     
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
                          <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                          <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                    
                          <SelectItem value="eu-west-2">EU (London)</SelectItem>
                          <SelectItem value="eu-west-3">EU (Paris)</SelectItem>
                          <SelectItem value="eu-west-4">EU (Frankfurt)</SelectItem>
                          <SelectItem value="eu-west-5">EU (Zurich)</SelectItem>
                  
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
                      <span className="text-sm text-muted-foreground">Max Memory</span>
                      <span className="text-sm font-medium">{formData.maxMemory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Initial Storage</span>
                      <span className="text-sm font-medium">{formData.initialStorage}</span>
                    </div>


                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Storage</span>
                      <span className="text-sm font-medium">{formData.maxStorage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Initial VCPU</span>
                      <span className="text-sm font-medium">{formData.initialVCpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max VCPU</span>
                      <span className="text-sm font-medium">{formData.maxVCpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Auto scale</span>
                      <span className="text-sm font-medium">{formData.autoScale}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Region</span>
                      <span className="text-sm font-medium">{formData.region}</span>
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
                  className="w-full cursor-pointer"
                  disabled={isLoading }
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
