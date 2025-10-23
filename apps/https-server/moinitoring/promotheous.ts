import client from 'prom-client';

export const register = new client.Registry();

// Enable default metrics CPU, memory, event loop
client.collectDefaultMetrics({
  register,
  prefix: 'nodejs_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  eventLoopMonitoringPrecision: 10,
});


export const Counter = client.Counter;
export const Gauge = client.Gauge;
export const Histogram = client.Histogram;
export const Summary = client.Summary;


export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestSizeBytes = new client.Histogram({
  name: 'http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
  registers: [register],
});

export const httpResponseSizeBytes = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000],
  registers: [register],
});

export const httpRequestsInProgress = new client.Gauge({
  name: 'http_requests_in_progress',
  help: 'Number of HTTP requests currently being processed',
  labelNames: ['method', 'route'],
  registers: [register],
});


export const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code', 'error_type'],
  registers: [register],
});

export const applicationErrorsTotal = new client.Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['error_type', 'severity', 'route'],
  registers: [register],
});

export const slowRequestsTotal = new client.Counter({
  name: 'slow_requests_total',
  help: 'Total number of slow requests',
  labelNames: ['route', 'method', 'threshold'],
  registers: [register],
});

export const routeRequestDuration = new client.Histogram({
  name: 'route_request_duration_seconds',
  help: 'Request duration by specific route',
  labelNames: ['route', 'method'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

// DATABASE METRICS
export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const dbQueriesTotal = new client.Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table', 'status'],
  registers: [register],
});

export const dbConnectionPoolSize = new client.Gauge({
  name: 'db_connection_pool_size',
  help: 'Size of database connection pool',
  registers: [register],
});

export const dbConnectionPoolActive = new client.Gauge({
  name: 'db_connection_pool_active',
  help: 'Number of active database connections',
  registers: [register],
});

// EXTERNAL API METRICS
export const externalApiDuration = new client.Histogram({
  name: 'external_api_duration_seconds',
  help: 'Duration of external API calls in seconds',
  labelNames: ['service', 'endpoint', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

export const externalApiRequestsTotal = new client.Counter({
  name: 'external_api_requests_total',
  help: 'Total number of external API requests',
  labelNames: ['service', 'endpoint', 'status'],
  registers: [register],
});

export const externalApiErrorsTotal = new client.Counter({
  name: 'external_api_errors_total',
  help: 'Total number of external API errors',
  labelNames: ['service', 'endpoint', 'error_type'],
  registers: [register],
});

// AUTHENTICATION METRICS
export const authAttemptsTotal = new client.Counter({
  name: 'auth_attempts_total',
  help: 'Total number of authentication attempts',
  labelNames: ['method', 'status'],
  registers: [register],
});

export const authSuccessTotal = new client.Counter({
  name: 'auth_success_total',
  help: 'Total number of successful authentications',
  labelNames: ['method'],
  registers: [register],
});

export const authFailuresTotal = new client.Counter({
  name: 'auth_failures_total',
  help: 'Total number of failed authentications',
  labelNames: ['method', 'reason'],
  registers: [register],
});

export const authDuration = new client.Histogram({
  name: 'auth_duration_seconds',
  help: 'Duration of authentication process',
  labelNames: ['method', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});


export const rateLimitHitsTotal = new client.Counter({
  name: 'rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['route', 'user_type'],
  registers: [register],
});

export const rateLimitRemaining = new client.Gauge({
  name: 'rate_limit_remaining',
  help: 'Remaining rate limit quota',
  labelNames: ['route', 'user_id'],
  registers: [register],
});



// BUSINESS METRICS
export const resourceProvisionedTotal = new client.Counter({
  name: 'resource_provisioned_total',
  help: 'Total number of resources provisioned',
  labelNames: ['resource_type', 'tier', 'status'],
  registers: [register],
});

export const resourceDeletedTotal = new client.Counter({
  name: 'resource_deleted_total',
  help: 'Total number of resources deleted',
  labelNames: ['resource_type', 'tier'],
  registers: [register],
});

export const activeResources = new client.Gauge({
  name: 'active_resources',
  help: 'Number of currently active resources',
  labelNames: ['resource_type', 'tier'],
  registers: [register],
});

export const userActivityTotal = new client.Counter({
  name: 'user_activity_total',
  help: 'Total user activity events',
  labelNames: ['activity_type', 'user_tier'],
  registers: [register],
});

// HEALTH CHECK METRICS
export const healthCheckTotal = new client.Counter({
  name: 'health_check_total',
  help: 'Total number of health checks',
  labelNames: ['status'],
  registers: [register],
});

export const healthCheckDuration = new client.Histogram({
  name: 'health_check_duration_seconds',
  help: 'Duration of health checks',
  labelNames: ['status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

// SYSTEM METRICS (Custom)
export const eventLoopLag = new client.Gauge({
  name: 'nodejs_eventloop_lag_seconds',
  help: 'Event loop lag in seconds',
  registers: [register],
});

let lastCheck = Date.now();
setInterval(() => {
  const now = Date.now();
  const lag = (now - lastCheck - 1000) / 1000;
  eventLoopLag.set(Math.max(0, lag));
  lastCheck = now;
}, 1000);

console.log(' Prometheus metrics initialized with', register.getMetricsAsArray().length, 'metrics');
