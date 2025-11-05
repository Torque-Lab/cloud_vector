"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CreateRolePage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Permission categories and their available permissions
  const permissionCategories = [
    {
      name: "Projects",
      key: "projects",
      permissions: [
        { key: "projects:read", name: "View Projects", description: "Can view project details and metrics" },
        { key: "projects:write", name: "Manage Projects", description: "Can create, edit, and configure projects" },
        { key: "projects:delete", name: "Delete Projects", description: "Can delete projects and all associated data" },
      ],
    },
    {
      name: "Databases",
      key: "databases",
      permissions: [
        { key: "databases:read", name: "View Databases", description: "Can view database details and metrics" },
        { key: "databases:write", name: "Manage Databases", description: "Can create, edit, and configure databases" },
        { key: "databases:delete", name: "Delete Databases", description: "Can delete databases and their data" },
        { key: "databases:query", name: "Query Databases", description: "Can execute queries against databases" },
      ],
    },
    {
      name: "API Keys",
      key: "keys",
      permissions: [
        { key: "api-keys:read", name: "View API Keys", description: "Can view API key details and usage" },
        { key: "api-keys:write", name: "Manage API Keys", description: "Can create, edit, and revoke API keys" },
        { key: "api-keys:delete", name: "Delete API Keys", description: "Can permanently delete API keys" },
      ],
    },
    {
      name: "Users & IAM",
      key: "users",
      permissions: [
        { key: "users:read", name: "View Users", description: "Can view user details and roles" },
        { key: "users:write", name: "Manage Users", description: "Can invite, edit, and manage user accounts" },
        { key: "users:delete", name: "Remove Users", description: "Can remove users from the organization" },
        { key: "roles:read", name: "View Roles", description: "Can view role details and permissions" },
        { key: "roles:write", name: "Manage Roles", description: "Can create, edit, and assign roles" },
      ],
    },
    {
      name: "Billing",
      key: "billing",
      permissions: [
        { key: "billing:read", name: "View Billing", description: "Can view usage and billing information" },
        { key: "billing:write", name: "Manage Billing", description: "Can manage payment methods and plans" },
      ],
    },
  ]

  const handlePermissionToggle = (permissionKey: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((p) => p !== permissionKey)
        : [...prev.permissions, permissionKey],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle role creation logic here
    console.log("Creating role:", formData)
  }

  return (
    <DashboardLayout>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/iam/roles">
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Roles
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>
          <p className="text-muted-foreground">Define a new role with specific permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  placeholder="e.g., Project Manager"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of this role"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Permissions</h2>
              <Badge variant="outline">{formData.permissions.length} selected</Badge>
            </div>

            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission.key}
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handlePermissionToggle(permission.key)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.key)}
                          onChange={() => handlePermissionToggle(permission.key)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{permission.name}</p>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Selected Permissions Summary */}
        {formData.permissions.length > 0 && (
          <Card className="p-6">
            <div className="space-y-3">
              <h3 className="font-medium">Selected Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary" className="text-xs">
                    {permission}
                    <button
                      type="button"
                      onClick={() => handlePermissionToggle(permission)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Link href="/iam/roles">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={!formData.name || !formData.description || formData.permissions.length === 0}>
            Create Role
          </Button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  )
}
