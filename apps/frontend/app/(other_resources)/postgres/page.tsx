// app/(other_resources)/postgres/page.tsx
import { DashboardLayout } from "@/components/dashboard-layout"
import { DatabaseTable } from "@/components/ui/database-table"
import { databaseApi } from "@/lib/api"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = 'force-dynamic'

async function DatabaseList({ searchParams={} }: { searchParams?: { projectId?: string; search?: string } }) {
  try {
    const [databases, projects] = await Promise.all([
      databaseApi.getDatabases(searchParams),
      databaseApi.getProjects()
    ])

    return ( 
      <DatabaseTable 
        initialDatabases={databases} 
        projects={projects} 
        initialFilters={searchParams} 
      />
    )
  } catch (error) {
   
  }
}

function DatabaseListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function DatabasesPage({
  searchParams,
}: {
  searchParams?: { projectId?: string; search?: string }
}) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Postgres Databases</h1>
            <p className="text-muted-foreground">
              Manage your Postgres databases and their configurations
            </p>
          </div>
        </div>
        
        <Suspense fallback={<DatabaseListSkeleton />}>
          <DatabaseList searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}