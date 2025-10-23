"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CompliancePage() {
  const [reportPeriod, setReportPeriod] = useState("30")

  // Mock compliance data
  const complianceMetrics = {
    overallScore: 87,
    lastAssessment: "2024-01-20",
    nextAssessment: "2024-02-20",
    frameworks: [
      { name: "SOC 2", status: "Compliant", score: 92, lastAudit: "2024-01-15" },
      { name: "ISO 27001", status: "Compliant", score: 89, lastAudit: "2024-01-10" },
      { name: "GDPR", status: "Partial", score: 78, lastAudit: "2024-01-18" },
      { name: "HIPAA", status: "Non-Compliant", score: 65, lastAudit: "2024-01-12" },
    ],
    findings: [
      {
        id: "1",
        severity: "High",
        category: "Access Control",
        description: "5 users have not logged in for over 90 days but still have active accounts",
        recommendation: "Disable or review inactive user accounts",
        status: "Open",
        dueDate: "2024-02-01",
      },
      {
        id: "2",
        severity: "Medium",
        category: "Password Policy",
        description: "12 users are using passwords that don't meet current complexity requirements",
        recommendation: "Force password reset for non-compliant users",
        status: "In Progress",
        dueDate: "2024-01-25",
      },
      {
        id: "3",
        severity: "Low",
        category: "Audit Logging",
        description: "Audit log retention period is below recommended 1 year",
        recommendation: "Increase audit log retention to 365 days",
        status: "Resolved",
        dueDate: "2024-01-20",
      },
    ],
    accessReview: {
      totalUsers: 24,
      reviewedUsers: 18,
      pendingReview: 6,
      lastReview: "2024-01-15",
      nextReview: "2024-04-15",
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "default"
      case "Partial":
        return "secondary"
      case "Non-Compliant":
        return "destructive"
      case "Open":
        return "destructive"
      case "In Progress":
        return "secondary"
      case "Resolved":
        return "default"
      default:
        return "outline"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <DashboardLayout>

  
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor compliance status and security posture</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={reportPeriod}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
          <Button variant="outline">Generate Report</Button>
          <Link href="/iam/settings">
            <Button>Configure Compliance</Button>
          </Link>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Overall Compliance Score</h2>
            <p className="text-muted-foreground">
              Last assessed on {new Date(complianceMetrics.lastAssessment).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{complianceMetrics.overallScore}%</div>
            <p className="text-sm text-muted-foreground">
              Next assessment: {new Date(complianceMetrics.nextAssessment).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${complianceMetrics.overallScore}%` }}
          />
        </div>
      </Card>

      {/* Compliance Frameworks */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Compliance Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceMetrics.frameworks.map((framework, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{framework.name}</h3>
                  <Badge variant={getStatusColor(framework.status)}>{framework.status}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Score: {framework.score}%</span>
                  <span className="text-sm text-muted-foreground">
                    Last audit: {new Date(framework.lastAudit).toLocaleDateString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      framework.status === "Compliant"
                        ? "bg-green-500"
                        : framework.status === "Partial"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${framework.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Access Review Status */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Access Review Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{complianceMetrics.accessReview.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{complianceMetrics.accessReview.reviewedUsers}</div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{complianceMetrics.accessReview.pendingReview}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Next Review</div>
              <div className="font-medium">
                {new Date(complianceMetrics.accessReview.nextReview).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(complianceMetrics.accessReview.reviewedUsers / complianceMetrics.accessReview.totalUsers) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Compliance Findings */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Compliance Findings</h2>
            <Badge variant="outline">{complianceMetrics.findings.length} findings</Badge>
          </div>
          <div className="space-y-3">
            {complianceMetrics.findings.map((finding) => (
              <div key={finding.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(finding.severity)}>{finding.severity}</Badge>
                    <Badge variant="outline">{finding.category}</Badge>
                    <Badge variant={getStatusColor(finding.status)}>{finding.status}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(finding.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{finding.description}</h3>
                <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
    </DashboardLayout>
  )
}
