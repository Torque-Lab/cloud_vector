import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { databaseApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

interface Database {
  id: string
  name: string
  description: string
  status: 'healthy' | 'degraded' | 'error' | 'creating' | 'updating' | 'deleting'
  dimensions: number
  vectorsCount: number
  size: string
  queriesPerDay: number
  region: string
  createdAt: string
  updatedAt: string
  distanceMetric: string
  indexType: string
  projectId: string
}

interface QueryLog {
  id: string
  timestamp: string
  type: 'similarity_search' | 'insert' | 'update' | 'delete'
  vectors: number
  latency: number
  status: 'success' | 'error'
}

async function getDatabase(id: string): Promise<Database> {
  try {
    return await databaseApi.getDatabase(id)
  } catch (error) {
    console.error(`Failed to fetch database ${id}:`, error)
    notFound()
  }
}

async function getQueryLogs(databaseId: string): Promise<QueryLog[]> {
  try {
    return await databaseApi.getQueryLogs(databaseId)
  } catch (error) {
    console.error(`Failed to fetch query logs for database ${databaseId}:`, error)
    return []
  }
}

function StatusBadge({ status }: { status: Database['status'] }) {
  const statusMap = {
    healthy: { label: 'Healthy', variant: 'default' as const },
    degraded: { label: 'Degraded', variant: 'warning' as const },
    error: { label: 'Error', variant: 'destructive' as const },
    creating: { label: 'Creating', variant: 'outline' as const },
    updating: { label: 'Updating', variant: 'outline' as const },
    deleting: { label: 'Deleting', variant: 'outline' as const },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: 'outline' as const }

  return <Badge variant={variant}>{label}</Badge>
}

function DatabaseStats({ database }: { database: Database }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <StatusBadge status={database.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {database.status === 'healthy' ? 'All systems operational' : 'Some issues detected'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat().format(database.vectorsCount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {database.size} total storage
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat().format(database.queriesPerDay)}/day
          </div>
          <p className="text-xs text-muted-foreground">
            Average latency: 23ms
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Date(database.createdAt).toLocaleDateString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(database.updatedAt), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function QueryLogs({ databaseId }: { databaseId: string }) {
  const queryLogs = getQueryLogs(databaseId)

  return (
    <Suspense fallback={<QueryLogsSkeleton />}>
      {/* @ts-ignore */}
      <QueryLogsContent queryLogsPromise={queryLogs} />
    </Suspense>
  )
}

async function QueryLogsContent({ queryLogsPromise }: { queryLogsPromise: Promise<QueryLog[]> }) {
  const queryLogs = await queryLogsPromise

  if (queryLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Recent queries and operations on this database</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vectors</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {log.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{log.vectors}</TableCell>
                <TableCell>{log.latency}ms</TableCell>
                <TableCell>
                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="capitalize">
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function QueryLogsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export default async function DatabaseDetailPage({ params }: { params: { id: string } }) {
  const database = await getDatabase(params.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{database.name}</h1>
            <p className="text-muted-foreground">
              {database.description || 'No description provided'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/postgres/${params.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Link href="/postgres">
              <Button variant="outline">Back to Databases</Button>
            </Link>
          </div>
        </div>

        <DatabaseStats database={database} />
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <QueryLogs databaseId={database.id} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
                <CardDescription>Use these details to connect to your database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <div className="flex items-center">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {`${database.id}.postgres.vector.example.com`}
                    </code>
                    <Button variant="ghost" size="sm" className="ml-2">
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Port</Label>
                  <div className="flex items-center">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      5432
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Database Name</Label>
                  <div className="flex items-center">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {database.name}
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <div className="flex items-center">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      admin
                    </code>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Show Password
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Keep your password secure and never share it
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Delete this database</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete a database, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" className="mt-2">
                    Delete Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
