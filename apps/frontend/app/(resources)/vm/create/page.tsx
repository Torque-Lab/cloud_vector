"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PostgresApi } from "@/lib/pg_api";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeftIcon, RefreshCcw } from "lucide-react";
import { vmApi } from "@/lib/vm_api";

interface Project {
  id: string;
  name: string;
}

export default function CreateVmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    region: "",
    memory: "",
    storage: "",
    vCpu: "",
    publicKey: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await PostgresApi.getProjects();
        setProjects(projects ?? []);
        if (projects?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            projectId: projects[0]?.id || "",
          }));
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsProjectsLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function parseSizeToBytes(value: string | undefined | null): number | null {
    if (value == null) return null;
    const s = String(value).trim();
    if (!s) return null;

    // Accept "200Mi", "2Gi", "10GiB", "512M", "123", "1.5G", "1T", "1TiB"
    const m = s.match(/^([0-9]*\.?[0-9]+)\s*([a-zA-Z]+)?$/);
    if (!m) return null;

    const num = parseFloat(m[1]!);
    if (Number.isNaN(num)) return null;

    // normalize unit: remove trailing "b" or "ib" e.g. "MiB" -> "mi", "GiB" -> "gi"
    let unit = (m[2] || "").toLowerCase();
    unit = unit.replace(/i?b$/i, ""); // removes "b" or "ib" if present

    // decimal (SI) vs binary (IEC)
    const multipliers: Record<string, number> = {
      // binary (iec)
      ki: 1024,
      mi: 1024 ** 2,
      gi: 1024 ** 3,
      ti: 1024 ** 4,
      pi: 1024 ** 5,
      ei: 1024 ** 6,
      // decimal (si)
      k: 1000,
      m: 1000 ** 2,
      g: 1000 ** 3,
      t: 1000 ** 4,
      p: 1000 ** 5,
      e: 1000 ** 6,
    };

    // no unit => treat as bytes (you can change to assume bytes or MiB as you prefer)
    if (!unit) return num;

    // allow single-letter units like "M" or "G" and "Mi"/"Gi"
    const mult = multipliers[unit];
    return mult ? num * mult : null;
  }

  function parseCpuToCores(value: string | undefined | null): number | null {
    if (value == null) return null;
    const s = String(value).trim();
    if (!s) return null;

    // Accept "500m" (millicores), "0.5", "2"
    const m = s.match(/^([0-9]*\.?[0-9]+)\s*(m)?$/i);
    if (!m) return null;
    const num = parseFloat(m[1]!);
    if (Number.isNaN(num)) return null;
    // if "m" suffix => millicores => divide by 1000
    return m[2] ? num / 1000 : num;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validations = [
      { field: "name", message: "vm name is required" },
      { field: "projectId", message: "Please select a project" },
      { field: "region", message: "Please select a region" },
      { field: "memory", message: "Memory is required" },
      { field: "storage", message: "Storage is required" },
      { field: "vCpu", message: "vCPU is required" },
      { field: "publicKey", message: "Public key is required" },
    ];
    const numericChecks = [
      {
        min: "memory",
        label: "Memory",
        kind: "bytes",
      },
      {
        min: "storage",
        label: "Storage",
        kind: "bytes",
      },
      { min: "vCpu", label: "vCPU", kind: "cpu" },
    ];
    for (const { field, message } of validations) {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === "string" && !value.trim())) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        return;
      }
    }

    for (const { min, label, kind } of numericChecks) {
      const minRaw = (formData as unknown as Record<string, string>)[min];
      const minVal =
        kind === "cpu" ? parseCpuToCores(minRaw) : parseSizeToBytes(minRaw);
      if (minVal === null) {
        toast({
          title: "Error",
          description: `${label}: invalid value for ${min} ("${minRaw}")`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const newVm = await vmApi.createVm({
        name: formData.name,
        projectId: formData.projectId,
        region: formData.region,
        memory: formData.memory,
        storage: formData.storage,
        vcpu: formData.vCpu,
        publicKey: formData.publicKey,
      });

      toast({
        title: "VM provisioning added to Task Queue",
        description: `${formData.name} will be created soon!.Redirecting to the vm page in 5 seconds`,
      });

      // Redirect to the new database
      setTimeout(() => {
        router.push(`/vm/${newVm.id}`);
      }, 5000);
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to create VM, Internal Server Error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 h-full ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Launch Virtual Machine
            </h2>
            <p className="text-muted-foreground">
              Set up a new Virtual Machine with your preferred configuration.
            </p>
          </div>
          <Link href="/vm">
            <Button className="cursor-pointer ">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Virtual Machine
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter your vm details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-visible">
                  <div className="space-y-2">
                    <Label htmlFor="publicKey">Public key</Label>
                    <Input
                      id="publicKey"
                      name="publicKey"
                      value={formData.publicKey}
                      onChange={handleChange}
                      placeholder="public-key"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">VM Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="my-vm"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      A unique name for your vm. Only lowercase letters,
                      numbers, and hyphens are allowed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    {isProjectsLoading ? (
                      <div className="h-10 w-full rounded-md border bg-muted animate-pulse" />
                    ) : (
                      <Select
                        name="projectId"
                        value={formData.projectId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, projectId: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects?.length > 0 ? (
                            projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="no-projects" value="1">
                              No projects found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>Configure your vm settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-visible">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                    <div className="space-y-2">
                      <Label htmlFor="memory">Memory</Label>
                      <Select
                        name="memory"
                        value={formData.memory}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            memory: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select memory" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-60">
                          <SelectItem value="200Mi">200MB</SelectItem>
                          <SelectItem value="500Mi">500MB</SelectItem>
                          <SelectItem value="1Gi">1GB</SelectItem>
                          <SelectItem value="2Gi">2GB</SelectItem>
                          <SelectItem value="4Gi">4GB</SelectItem>
                          <SelectItem value="8Gi">8GB</SelectItem>
                          <SelectItem value="16Gi">16GB</SelectItem>
                          <SelectItem value="32Gi">32GB</SelectItem>
                          <SelectItem value="64Gi">64GB</SelectItem>
                          <SelectItem value="128Gi">128GB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storage">Storage</Label>
                      <Select
                        name="storage"
                        value={formData.storage}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            storage: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5Gi">5GB</SelectItem>
                          <SelectItem value="10Gi">10GB</SelectItem>
                          <SelectItem value="20Gi">20GB</SelectItem>
                          <SelectItem value="40Gi">40GB</SelectItem>
                          <SelectItem value="80Gi">80GB</SelectItem>
                          <SelectItem value="160Gi">160GB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vcpu">vCPU</Label>
                      <Select
                        name="vcpu"
                        value={formData.vCpu}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            vCpu: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="vcpu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1vCPU</SelectItem>
                          <SelectItem value="2">2vCPU</SelectItem>
                          <SelectItem value="4">4vCPU</SelectItem>
                          <SelectItem value="8">8vCPU</SelectItem>
                          <SelectItem value="16">16vCPU</SelectItem>
                          <SelectItem value="32">32vCPU</SelectItem>
                          <SelectItem value="64">64vCPU</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        name="region"
                        value={formData.region}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, region: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">
                            US East (N. Virginia)
                          </SelectItem>
                          <SelectItem value="us-west-2">
                            US West (Oregon)
                          </SelectItem>
                          <SelectItem value="eu-west-1">
                            EU (Ireland)
                          </SelectItem>
                          <SelectItem value="ap-southeast-1">
                            Asia Pacific (Singapore)
                          </SelectItem>
                          <SelectItem value="ap-northeast-1">
                            Asia Pacific (Tokyo)
                          </SelectItem>
                          <SelectItem value="ap-south-1">
                            Asia Pacific (Mumbai)
                          </SelectItem>

                          <SelectItem value="eu-west-2">EU (London)</SelectItem>
                          <SelectItem value="eu-west-3">EU (Paris)</SelectItem>
                          <SelectItem value="eu-west-4">
                            EU (Frankfurt)
                          </SelectItem>
                          <SelectItem value="eu-west-5">EU (Zurich)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Review your configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name
                      </span>
                      <span className="text-sm font-medium">
                        {formData.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Project
                      </span>
                      <span className="text-sm font-medium">
                        {projects.find((p) => p.id === formData.projectId)
                          ?.name || "Not selected"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Region
                      </span>
                      <span className="text-sm font-medium">
                        {formData.region}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Memory
                      </span>
                      <span className="text-sm font-medium">
                        {formData.memory}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Storage
                      </span>
                      <span className="text-sm font-medium">
                        {formData.storage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        vCPU
                      </span>
                      <span className="text-sm font-medium">
                        {formData.vCpu}
                      </span>
                    </div>
             

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Cost</span>
                      <span className="font-bold">$29.99/month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed monthly. 30-day money-back guarantee.
                    </p>
                  </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {
                    <RefreshCcw
                      className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  }
                  {isLoading ? "Creating..." : "Create VM"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By creating a VM, you agree to our{" "}
                  <Link className="font-bold" href="/terms">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link className="font-bold" href="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
