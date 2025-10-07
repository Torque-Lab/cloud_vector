"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function InviteUserPage() {
  const [formData, setFormData] = useState({
    email: "",
    role: "viewer",
    projects: [] as string[],
    message: "",
  })

  const availableProjects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"]

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all resources and settings" },
    { value: "developer", label: "Developer", description: "Can create and manage databases and API keys" },
    { value: "viewer", label: "Viewer", description: "Read-only access to resources" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle user invitation logic here
    console.log("Inviting user:", formData)
  }

  return (
    <DashboardLayout>
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/iam">
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to IAM
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invite User</h1>
          <p className="text-muted-foreground">Send an invitation to join your organization</p>
        </div>
      </div>

      {/* Invitation Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">The user will receive an invitation email</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={role.value}
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor={role.value} className="text-sm font-medium cursor-pointer">
                      {role.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Access */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Access</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
              {availableProjects.map((project) => (
                <div key={project} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={project}
                    checked={formData.projects.includes(project)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, projects: [...formData.projects, project] })
                      } else {
                        setFormData({ ...formData, projects: formData.projects.filter((p) => p !== project) })
                      }
                    }}
                  />
                  <label htmlFor={project} className="text-sm cursor-pointer">
                    {project}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Select which projects the user can access</p>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Message (Optional)</label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
              placeholder="Add a personal message to the invitation..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Link href="/iam">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Card>
    </div>
    </DashboardLayout>
  )
}
