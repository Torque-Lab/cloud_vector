# Cloud Vector Platform

A robust Platform-as-a-Service (PaaS) solution that simplifies cloud infrastructure management with support for VMs, PostgreSQL, RabbitMQ, and Redis, featuring advanced distributed systems capabilities.

##  Features

- **Infrastructure as Code**: Define and version control your infrastructure
- **Managed Services**:
  - Virtual Machines (VMs)
  - PostgreSQL Databases
  - RabbitMQ Message Brokers
  - Redis Caches
- **Advanced Features**:
  - Distributed Git-based locking
  - Message queue management
  - Auto-scaling
  - Load balancing
  - Health monitoring
- **Security**:
  - JWT Authentication
  - No Cross Origin Request
  - OAuth 2.0 (GitHub, Google)
  - Role-Based Access Control (RBAC)
  - Network policies

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Cloud Vector Platform                         │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   Frontend      │  Control Plane  │  HTTPS Server   │  MCP Server   │
└────────┬────────┴────────┬────────┴────────┬────────┴───────┬──────┘
         │                  │                 │                 │
         ▼                  ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Infrastructure Provisioner                       │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   VM Service    │   PostgreSQL    │    RabbitMQ     │     Redis     │
└─────────────────┴────────┬────────┴────────┬────────┴───────┬───────┘
                           │                 │                 │
                           ▼                 ▼                 ▼
     ┌────────────────────────────────────────────────────────────────┐
     │                           Infra Cluster                        │
     ├─────────────────┬─────────────────┬─────────────────┬──────────┤
     │                 │                 │                 │
     ▼                 ▼                 ▼                 ▼
     
┌─────────────────────────────────────────────────────────────────────┐
│         TCP Gateway Layer for Authenication and Dynamic Routing     │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│  Postgres TCP   │  RabbitMQ TCP   │   Redis TCP     │               │
│   Gateway       │   Gateway       │   Gateway       │               │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     End Users & Applications                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     Operations Repository                           │
│  - https://github.com/Torque-Lab/cloud-infra-ops                    │
│  - https://github.com/Torque-Lab/redis-cp-proxy                     │
│  - https://github.com/Torque-Lab/rabbit-cp-proxy                    │
│  - https://github.com/Torque-Lab/postgres-cp-proxy                  │
│  - https://github.com/Torque-Lab/vm-tf                              │
│  - https://github.com/Torque-Lab/cloud-vector-k8s-tf                │
└─────────────────────────────────────────────────────────────────────┘
```


