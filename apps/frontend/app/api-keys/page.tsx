import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for API keys
const apiKeys = [
  {
    id: "key-1",
    name: "Production API Key",
    description: "Main production key for product search",
    key: "vdb_prod_1234567890abcdef",
    permissions: ["read", "write"],
    databases: ["product-search-v2", "user-embeddings"],
    created: "2024-01-15",
    lastUsed: "2 minutes ago",
    requests: "1.2M",
    status: "active",
    expires: "2024-12-31",
  },
  {
    id: "key-2",
    name: "Development Key",
    description: "Development and testing purposes",
    key: "vdb_dev_abcdef1234567890",
    permissions: ["read"],
    databases: ["content-similarity"],
    created: "2024-01-10",
    lastUsed: "1 hour ago",
    requests: "45K",
    status: "active",
    expires: "2024-06-30",
  },
  {
    id: "key-3",
    name: "Analytics Key",
    description: "Read-only access for analytics dashboard",
    key: "vdb_analytics_fedcba0987654321",
    permissions: ["read"],
    databases: ["all"],
    created: "2024-01-08",
    lastUsed: "1 day ago",
    requests: "234K",
    status: "active",
    expires: "Never",
  },
  {
    id: "key-4",
    name: "Legacy Key",
    description: "Old key for migration purposes",
    key: "vdb_legacy_0987654321fedcba",
    permissions: ["read", "write"],
    databases: ["recommendation-engine"],
    created: "2023-12-01",
    lastUsed: "30 days ago",
    requests: "2.8M",
    status: "inactive",
    expires: "2024-03-01",
  },
]

export default function ApiKeysPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
            <p className="text-muted-foreground">Manage your API keys and access permissions.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input placeholder="Search API keys..." className="w-64" />
            <Button>Create API Key</Button>
          </div>
        </div>

        {/* API Key Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">3 active, 1 inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3M</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1000</div>
              <p className="text-xs text-muted-foreground">Requests per minute</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Within 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>Manage and monitor your API keys and their usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Databases</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{key.name}</div>
                        <p className="text-sm text-muted-foreground">{key.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{key.key.substring(0, 20)}...</code>
                        <Button variant="ghost" size="sm">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {key.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {key.databases.length === 1 && key.databases[0] === "all"
                          ? "All databases"
                          : `${key.databases.length} database${key.databases.length > 1 ? "s" : ""}`}
                      </div>
                    </TableCell>
                    <TableCell>{key.requests}</TableCell>
                    <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                    <TableCell>
                      <Badge variant={key.status === "active" ? "success" : "secondary"}>{key.status}</Badge>
                    </TableCell>
                    <TableCell>{key.expires}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create API Key Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>Generate a new API key with specific permissions and access controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input placeholder="My API Key" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Brief description of the key's purpose" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Read</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Write</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Admin</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiration</label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Database Access</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">product-search-v2</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">user-embeddings</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">content-similarity</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">recommendation-engine</span>
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button>Generate API Key</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
