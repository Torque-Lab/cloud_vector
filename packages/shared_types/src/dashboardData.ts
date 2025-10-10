

export type Metric = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
  };
  export type RecentActivity = {
    id: number;
    action: string;
    database: string;
    project: string;
    timestamp: string;
    status: "success" | "warning" | "error";
  };
  export type TopDatabase = {
    name: string;
    project: string;
    queries: string;
    size: string;
    status: "healthy" | "warning" | "error";
  };
  
  export type StorageBreakdown = {
    project: string;
    storage: string;
    percentage: number;
  };
  
  export type DashboardDataType = {
    allData: {
      all:{
      metrics: Metric[];
      recentActivity: RecentActivity[];
      topDatabases: TopDatabase[];
      storageBreakdown: StorageBreakdown[];
      }
      [key:string]:{
      metrics: Metric[];
      recentActivity: RecentActivity[];
      topDatabases: TopDatabase[];
      storageBreakdown: StorageBreakdown[];
      }
    };
  };
  


  export type ProjectData = {
    id: string;
    name: string;
    description: string;
    status: string;
    postgres: number;
    redis: number;
    rabbitMQ: number;
    vm: number;
    cost: string;
    created: string;
  };