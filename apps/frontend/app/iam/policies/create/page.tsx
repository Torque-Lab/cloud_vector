"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CreatePolicyPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    resourceType: "Project",
    resourceId: "",
    rules: [] as Array<{
      principal: string
      principalType: "user" | "role"
      permissions: string[]
    }>,
  })

  const [newRule, setNewRule] = useState({
    principal: "",
    principalType: "user" as "user" | "role",
    permissions: [] as string[],
  })

  const resourceTypes = ["Project", "Database", "API Key", "Billing"]
  const availablePermissions = ["read", "write", "delete", "admin"]
  const availableUsers = ["john@example.com", "jane@example.com", "bob@example.com"]
  const availableRoles = ["Admin", "Developer", "Viewer", "Project Manager"]

  const addRule = () => {
    if (newRule.principal && newRule.permissions.length > 0) {
      setFormData({
        ...formData,
        rules: [...formData.rules, { ...newRule }],
      })
      setNewRule({
        principal: "",
        principalType: "user",
        permissions: [],
      })
    }
  }

  const removeRule = (index: number) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== index),
    })
  }

  const handlePermissionToggle = (permission: string) => {
    setNewRule({
      ...newRule,
      permissions: newRule.permissions.includes(permission)
        ? newRule.permissions.filter((p) => p !== permission)
        : [...newRule.permissions, permission],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle policy creation logic here
    console.log("Creating policy:", formData)
  }

  return (
    <DashboardLayout>

  
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/iam/policies">
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Policies
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Resource Policy</h1>
          <p className="text-muted-foreground">Define access control rules for specific resources</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Policy Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Name</label>
                <Input
                  placeholder="e.g., Project Alpha Access Policy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource Type</label>
                <Select
                  value={formData.resourceType}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Describe what this policy controls..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Identifier</label>
              <Input
                placeholder="e.g., project-alpha, prod-*, billing"
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use specific IDs or wildcards (*) to match multiple resources
              </p>
            </div>
          </div>
        </Card>

        {/* Access Rules */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Access Rules</h2>
              <Badge variant="outline">{formData.rules.length} rules</Badge>
            </div>

            {/* Add New Rule */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Add Access Rule</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Principal Type</label>
                  <Select
                    value={newRule.principalType}
                    onChange={(e) => setNewRule({ ...newRule, principalType: e.target.value as "user" | "role" })}
                  >
                    <option value="user">User</option>
                    <option value="role">Role</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{newRule.principalType === "user" ? "User" : "Role"}</label>
                  <Select
                    value={newRule.principal}
                    onChange={(e) => setNewRule({ ...newRule, principal: e.target.value })}
                  >
                    <option value="">Select {newRule.principalType}</option>
                    {(newRule.principalType === "user" ? availableUsers : availableRoles).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {availablePermissions.map((permission) => (
                      <button
                        key={permission}
                        type="button"
                        onClick={() => handlePermissionToggle(permission)}
                        className={`px-2 py-1 text-xs rounded border ${
                          newRule.permissions.includes(permission)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:bg-muted"
                        }`}
                      >
                        {permission}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={addRule}
                disabled={!newRule.principal || newRule.permissions.length === 0}
                size="sm"
              >
                Add Rule
              </Button>
            </div>

            {/* Existing Rules */}
            {formData.rules.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Current Rules</h3>
                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          {rule.principalType}
                        </Badge>
                        <span className="font-medium">{rule.principal}</span>
                        <div className="flex space-x-1">
                          {rule.permissions.map((permission, pIndex) => (
                            <Badge key={pIndex} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Link href="/iam/policies">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={!formData.name || !formData.description || !formData.resourceId || formData.rules.length === 0}
          >
            Create Policy
          </Button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  )
}
