import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Database, databaseApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'
async function getDatabase(id: string): Promise<Database> {
  try {
    return await databaseApi.getDatabase(id)
  } catch (error) {
    console.error(`Failed to fetch database ${id}:`, error)
    notFound()
  }
}
function DatabaseStats({ database }: { database: Database }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Date(database.createdAt!).toLocaleDateString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(database.updatedAt!), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </div>
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
    </DashboardLayout>
  )
}
