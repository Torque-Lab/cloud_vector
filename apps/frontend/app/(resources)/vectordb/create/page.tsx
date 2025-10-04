"use client"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import Link from "next/link"

const projects = [
  { id: "1", name: "Production App" },
  { id: "2", name: "Development" },
  { id: "3", name: "Analytics Platform" },
]

export default function CreateDatabasePage() {
  const [selectedProject, setSelectedProject] = useState("1")
  const [databaseName, setDatabaseName] = useState("my-vector-database")
  const [region, setRegion] = useState("us-east-1")
  const [dimensions, setDimensions] = useState("768")
  const [distanceMetric, setDistanceMetric] = useState("cosine")
  const [indexType, setIndexType] = useState("hnsw")
  const [capacity, setCapacity] = useState("medium")

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Database</h2>
            <p className="text-muted-foreground">Set up a new vector database with your preferred configuration.</p>
          </div>
          <Link href="/databases">
            <Button variant="outline">Back to Databases</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Project Selection</CardTitle>
                <CardDescription>Choose the project where this database will be created.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project</label>
                  <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The database will be created under the selected project and inherit its billing and access controls.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>Essential settings for your vector database.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Database Name</label>
                    <Input
                      placeholder="my-vector-database"
                      value={databaseName}
                      onChange={(e) => setDatabaseName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be unique within the project and contain only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region</label>
                    <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">Europe (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Brief description of your database purpose" />
                </div>
              </CardContent>
            </Card>

            {/* Vector Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Vector Configuration</CardTitle>
                <CardDescription>Configure vector dimensions and similarity metrics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vector Dimensions</label>
                    <Select value={dimensions} onChange={(e) => setDimensions(e.target.value)}>
                      <option value="128">128 dimensions</option>
                      <option value="256">256 dimensions</option>
                      <option value="512">512 dimensions</option>
                      <option value="768">768 dimensions</option>
                      <option value="1024">1024 dimensions</option>
                      <option value="1536">1536 dimensions</option>
                      <option value="custom">Custom</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance Metric</label>
                    <Select value={distanceMetric} onChange={(e) => setDistanceMetric(e.target.value)}>
                      <option value="cosine">Cosine Similarity</option>
                      <option value="euclidean">Euclidean Distance</option>
                      <option value="dot-product">Dot Product</option>
                      <option value="manhattan">Manhattan Distance</option>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Index Type</label>
                    <Select value={indexType} onChange={(e) => setIndexType(e.target.value)}>
                      <option value="hnsw">HNSW (Hierarchical NSW)</option>
                      <option value="ivf">IVF (Inverted File)</option>
                      <option value="flat">Flat (Exact Search)</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Index Parameters</label>
                    <Input placeholder="ef_construction=200, M=16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance & Scaling */}
            <Card>
              <CardHeader>
                <CardTitle>Performance & Scaling</CardTitle>
                <CardDescription>Configure performance and scaling options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Capacity</label>
                    <Select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                      <option value="small">Small (up to 100K vectors)</option>
                      <option value="medium">Medium (up to 1M vectors)</option>
                      <option value="large">Large (up to 10M vectors)</option>
                      <option value="xlarge">X-Large (up to 100M vectors)</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Auto-scaling</label>
                    <Select>
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Replicas</label>
                    <Select>
                      <option value="1">1 Replica</option>
                      <option value="2">2 Replicas</option>
                      <option value="3">3 Replicas</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Frequency</label>
                    <Select>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="disabled">Disabled</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-4">
              <Button className="flex-1">Create Database</Button>
              <Link href="/databases">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Summary</CardTitle>
                <CardDescription>Review your database configuration before creating.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Project:</span>
                    <span>{projects.find((p) => p.id === selectedProject)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{databaseName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Region:</span>
                    <span>
                      {region === "us-east-1"
                        ? "US East (N. Virginia)"
                        : region === "us-west-2"
                          ? "US West (Oregon)"
                          : region === "eu-west-1"
                            ? "Europe (Ireland)"
                            : "Asia Pacific (Singapore)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>{dimensions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance Metric:</span>
                    <span>
                      {distanceMetric === "cosine"
                        ? "Cosine Similarity"
                        : distanceMetric === "euclidean"
                          ? "Euclidean Distance"
                          : distanceMetric === "dot-product"
                            ? "Dot Product"
                            : "Manhattan Distance"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Index Type:</span>
                    <span>{indexType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span>
                      {capacity === "small"
                        ? "Small (100K vectors)"
                        : capacity === "medium"
                          ? "Medium (1M vectors)"
                          : capacity === "large"
                            ? "Large (10M vectors)"
                            : "X-Large (100M vectors)"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimated Costs</CardTitle>
                <CardDescription>Monthly cost estimation based on your configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>$12.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Compute:</span>
                    <span>$45.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Queries:</span>
                    <span>$8.00</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>$65.00/month</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Costs will be attributed to the {projects.find((p) => p.id === selectedProject)?.name} project.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
