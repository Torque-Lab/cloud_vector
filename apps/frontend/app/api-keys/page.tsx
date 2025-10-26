"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PostgresApi, Project } from "@/lib/pg_api"
import { toast } from "@/hooks/use-toast"
const apiKeys = [
  {
    id: "key-1",
    name: "Production API Key",
    description: "Main production key for product search",
    key: "vdb_prod_1234567890abcdef",
    permissions: ["READ_PROJECT", "WRITE_PROJECT"],
    resources: ["product-search-v2", "user-embeddings"],
    created: "2024-01-15",
    lastUsed: "2 minutes ago",
    status: "active",
    expires: "2024-12-31",
  },
]

export default function ApiKeysPage() {
  const [formData, setFormData] = useState({
    keyName: "",
    description: "",
    permissions: [] as string[],
    expiration: "",
    projectId: "",
  })
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    useEffect(() => {
      const loadProjects = async () => {
        try {
          const projects = await PostgresApi.getProjects();
          setProjects(projects ?? []);
          if (projects?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              projectId: projects[0]?.id || "",
            }));
          }
        } catch (error) {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to load projects",
            variant: "destructive",
          });
        } finally {
          setIsProjectsLoading(false);
        }
      };
  
      loadProjects();
    }, [toast]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const togglePermission = (perm: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting:", formData)
   
  }

 const allPermissions = [
  "NONE",
  "CREATE_USER",
  "READ_USER",
  "UPDATE_USER",
  "DELETE_USER",
  "CREATE_PROJECT",
  "READ_PROJECT",
  "UPDATE_PROJECT",
  "DELETE_PROJECT",
  "CREATE_POSTGRES",
  "READ_POSTGRES",
  "UPDATE_POSTGRES",
  "DELETE_POSTGRES",
  "DOWNLOAD_BACKUP",
  "CREATE_RABBITMQ",
  "READ_RABBITMQ",
  "UPDATE_RABBITMQ",
  "DELETE_RABBITMQ",
  "CREATE_REDIS",
  "READ_REDIS",
  "UPDATE_REDIS",
  "DELETE_REDIS",
  "CREATE_VECTORDB",
  "READ_VECTORDB",
  "UPDATE_VECTORDB",
  "DELETE_VECTORDB",
] as const;


  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
            <p className="text-muted-foreground">Manage your API keys and access permissions.</p>
          </div>
        </div>

        {/* Existing API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>Manage and monitor your API keys and their usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div className="font-medium">{key.name}</div>
                      <p className="text-sm text-muted-foreground">{key.description}</p>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {key.key.substring(0, 16)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{key.resources.join(", ")}</TableCell>
                    <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                    <TableCell>
                      <Badge variant={key.status === "active" ? "success" : "secondary"}>
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{key.expires}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create API Key Form */}
        <Card className="w-full mx-auto relative overflow-visible">
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>
              Generate a new API key with specific permissions and access controls.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Key Name & Description */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="My API Key"
                    value={formData.keyName}
                    onChange={(e) => handleChange("keyName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the key's purpose"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allPermissions.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm}
                        className="h-5 w-5 cursor-pointer"
                        checked={formData.permissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <Label
                        htmlFor={perm}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {perm.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>


              <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    {isProjectsLoading ? (
                      <div className="h-10 w-full rounded-md border bg-muted animate-pulse" />
                    ) : (
                      <Select
                        name="projectId"
                        value={formData.projectId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, projectId: value }))
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



              {/* Expiration */}
              <div className="space-y-2">
                <Label>Expiration</Label>
                <Select
                  value={formData.expiration}
                  onValueChange={(value) => handleChange("expiration", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent className="z-60">
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="6 hours">6 hours</SelectItem>
                    <SelectItem value="12 hours">12 hours</SelectItem>
                    <SelectItem value="24 hours">24 hours</SelectItem>
                    <SelectItem value="7 days">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="submit" className="cursor-pointer">
                  Generate API Key
                </Button>
                <Button type="button" variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
