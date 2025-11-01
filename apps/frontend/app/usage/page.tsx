"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { SearchBox } from "@/components/search-box";

const UsagePage = () => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const projects = [
    { id: "all", name: "All Projects" },
    { id: "1", name: "E-commerce AI" },
    { id: "3", name: "Recommendation Engine" },
  ];

  const allInvoices = [
    {
      id: "INV-2024-12",
      date: "2024-12-15",
      displayDate: "Dec 15, 2024",
      amount: "$99.00",
      status: "Paid",
      period: "Dec 15 - Jan 14",
      project: "E-commerce AI",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-11",
      date: "2024-11-15",
      displayDate: "Nov 15, 2024",
      amount: "$99.00",
      status: "Paid",
      period: "Nov 15 - Dec 14",
      project: "Recommendation Engine",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-10",
      date: "2024-10-15",
      displayDate: "Oct 15, 2024",
      amount: "$99.00",
      status: "Paid",
      period: "Oct 15 - Nov 14",
      project: "E-commerce AI",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-09",
      date: "2024-09-15",
      displayDate: "Sep 15, 2024",
      amount: "$99.00",
      status: "Paid",
      period: "Sep 15 - Oct 14",
      project: "Recommendation Engine",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-07",
      date: "2024-07-15",
      displayDate: "Jul 15, 2024",
      amount: "$89.00",
      status: "Overdue",
      period: "Jul 15 - Aug 14",
      project: "E-commerce AI",
      downloadUrl: "#",
    },
  ];

  const filteredInvoices = allInvoices.filter((invoice) => {
    const matchesFilter =
      invoiceFilter === "all" || invoice.status.toLowerCase() === invoiceFilter;
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.displayDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== "all") {
      const invoiceDate = new Date(invoice.date);
      const now = new Date();
      const monthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - Number.parseInt(dateFilter),
        now.getDate()
      );
      matchesDate = invoiceDate >= monthsAgo;
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleDownloadInvoice = (invoice: any) => {
    const element = document.createElement("a");
    element.href = `data:text/plain;charset=utf-8,Invoice ${invoice.id}\nDate: ${invoice.displayDate}\nAmount: ${invoice.amount}\nStatus: ${invoice.status}\nPeriod: ${invoice.period}\nProject: ${invoice.project}`;
    element.download = `${invoice.id}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const getUsageStats = () => {
    return {
      apiCalls: "47.8K",
      storage: "23.4 GB",
      vectorOps: "156K",
      monthlyCost: "$87.50",
    };
  };

  const stats = getUsageStats();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">

          <div>
             <p className="text-muted-foreground text-2xl italic">Page is not ready for real data...</p>
            <h2 className="text-3xl font-bold tracking-tight">
              Usage & Billing
            </h2>

            <p className="text-muted-foreground">
              Monitor your usage and manage billing across projects.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Project:</span>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Period:</span>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="3">Last 3 Months</SelectItem>
                  <SelectItem value="6">Last 6 Months</SelectItem>
                  <SelectItem value="12">Last 12 Months</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {(selectedProject !== "all" ||
            invoiceFilter !== "all" ||
            dateFilter !== "all") && (
            <Badge variant="outline">
              {selectedProject !== "all" &&
                projects.find((p) => p.id === selectedProject)?.name}
              {invoiceFilter !== "all" && ` • ${invoiceFilter}`}
              {dateFilter !== "all" && ` • Last ${dateFilter} months`}
            </Badge>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiCalls}</div>
              <p className="text-xs text-muted-foreground">
                48% of monthly limit
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.storage}</div>
              <p className="text-xs text-muted-foreground">
                47% of allocated storage
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vector Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vectorOps}</div>
              <p className="text-xs text-muted-foreground">
                +24% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Month Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyCost}</div>
              <p className="text-xs text-muted-foreground">
                $11.50 credit applied
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Current Plan</CardTitle>
                <CardDescription>
                  Your active subscription and usage limits
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/usage/plans">
                  <Button className="cursor-pointer">Change Plan</Button>
                </Link>
                <Link href="/usage/plan-details">
                  <Button variant="outline" className="cursor-pointer">View Details</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">Free Plan</h3>
                  <Badge>Current</Badge>
                </div>
                <p className="text-3xl font-bold text-primary">
                  $0
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Next billing: January 15, 2025
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Databases</span>
                  <span className="text-muted-foreground">7 of 10 used</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">API Calls</span>
                  <span className="text-muted-foreground">47.8K of 100K</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "48%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Storage</span>
                  <span className="text-muted-foreground">23.4GB of 50GB</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "47%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              {selectedProject === "all"
                ? "All invoices across all projects."
                : `Invoices for ${projects.find((p) => p.id === selectedProject)?.name} project.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  {selectedProject === "all" && <TableHead>Project</TableHead>}
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.displayDate}</TableCell>
                    {selectedProject === "all" && (
                      <TableCell>
                        <Badge variant="outline">{invoice.project}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-muted-foreground">
                      {invoice.period}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {invoice.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "Paid" ? "success" : "destructive"
                        }
                        className="text-foreground "
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          Download
                        </Button>
                     
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No invoices found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsagePage;
