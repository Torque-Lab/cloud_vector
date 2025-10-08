import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// Mock data for a specific database
const database = {
  id: "db-1",
  name: "product-search-v2",
  description: "Product similarity search for e-commerce platform",
  status: "healthy",
  dimensions: 768,
  vectors: "2.4M",
  size: "234 GB",
  queries: "1.2M/day",
  region: "us-east-1",
  created: "2024-01-15",
  lastActivity: "2 minutes ago",
  distanceMetric: "cosine",
  indexType: "hnsw",
  replicas: 2,
  autoScaling: true,
}

const recentQueries = [
  {
    id: 1,
    timestamp: "2024-01-20 14:30:25",
    type: "similarity_search",
    vectors: 10,
    latency: "23ms",
    status: "success",
  },
  {
    id: 2,
    timestamp: "2024-01-20 14:30:20",
    type: "insert",
    vectors: 1,
    latency: "12ms",
    status: "success",
  },
  {
    id: 3,
    timestamp: "2024-01-20 14:30:15",
    type: "similarity_search",
    vectors: 5,
    latency: "18ms",
    status: "success",
  },
  {
    id: 4,
    timestamp: "2024-01-20 14:30:10",
    type: "delete",
    vectors: 3,
    latency: "8ms",
    status: "success",
  },
]

const metrics = [
  {
    title: "Total Vectors",
    value: database.vectors,
    change: "+12K today",
    trend: "up",
  },
  {
    title: "Queries Today",
    value: "45.2K",
    change: "+8% from yesterday",
    trend: "up",
  },
  {
    title: "Avg Latency",
    value: "23ms",
    change: "-2ms from yesterday",
    trend: "down",
  },
  {
    title: "Success Rate",
    value: "99.9%",
    change: "No change",
    trend: "stable",
  },
]

export default function DatabaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/vectordb" className="text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h2 className="text-3xl font-bold tracking-tight">{database.name}</h2>
              <Badge variant={database.status === "healthy" ? "success" : "warning"}>{database.status}</Badge>
            </div>
            <p className="text-muted-foreground">{database.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Settings</Button>
            <Button variant="outline">Clone</Button>
            <Button>Connect</Button>
          </div>
        </div>

        {/* Database Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Current database settings and parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dimensions:</span>
                  <span className="text-sm font-medium">{database.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Distance Metric:</span>
                  <span className="text-sm font-medium">{database.distanceMetric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Index Type:</span>
                  <span className="text-sm font-medium">{database.indexType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <span className="text-sm font-medium">{database.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Replicas:</span>
                  <span className="text-sm font-medium">{database.replicas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auto-scaling:</span>
                  <Badge variant={database.autoScaling ? "success" : "secondary"}>
                    {database.autoScaling ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm font-medium">{database.created}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Query latency and throughput over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">23ms</div>
                  <p className="text-sm text-muted-foreground">Average Latency</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-medium">1.2M</div>
                      <div className="text-muted-foreground">Queries/Day</div>
                    </div>
                    <div>
                      <div className="font-medium">99.9%</div>
                      <div className="text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>Latest database operations and their performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Vectors</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-mono text-sm">{query.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{query.type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>{query.vectors}</TableCell>
                    <TableCell>{query.latency}</TableCell>
                    <TableCell>
                      <Badge variant={query.status === "success" ? "success" : "destructive"}>{query.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common database operations and management tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Insert Vectors</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm">Search Vectors</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span className="text-sm">Export Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">Configure</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
