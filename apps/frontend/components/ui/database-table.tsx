// app/(other_resources)/postgres/_components/database-table.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Project } from "@/lib/api"
import { Table } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface DatabaseTableProps {
  initialDatabases: Database[]
  projects: Project[]
}

export function DatabaseTable({ 
  initialDatabases, 
  projects,
}: DatabaseTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [projectId, setProjectId] = useState( "all")

  const updateSearch = useCallback((value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`)
    })
  }, [router, searchParams])

  const updateProject = useCallback((value: string) => {
    setProjectId(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value !== "all") {
      params.set('projectId', value)
    } else {
      params.delete('projectId')
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`)
    })
  }, [router, searchParams])

  const filteredDatabases = initialDatabases.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(search.toLowerCase()) || 
                         db.description?.toLowerCase().includes(search.toLowerCase())
    const matchesProject = projectId === "all" || db.projectId === projectId
    return matchesSearch && matchesProject
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search databases..."
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          disabled={isPending}
          className="max-w-sm"
        />
        
        <Select value={projectId} onValueChange={updateProject} disabled={isPending}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Databases</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredDatabases.length} database{filteredDatabases.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link href="/postgres/create">
              <Button>Create Database</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vectors</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDatabases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No databases found. Create your first database to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDatabases.map((db) => (
                  <TableRow key={db.id}>
                    <TableCell className="font-medium">
                      <Link href={`/postgres/${db.id}`} className="hover:underline">
                        {db.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {projects.find(p => p.id === db.projectId)?.name || 'Unknown Project'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={db.status === 'healthy' ? 'default' : 'destructive'}>
                        {db.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/postgres/${db.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </TableComponent>
        </CardContent>
      </Card>
    </div>
  )
}