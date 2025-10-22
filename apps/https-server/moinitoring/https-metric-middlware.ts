

import type { Request, Response, NextFunction } from 'express';
import {
  httpRequestDuration,
  httpRequestsTotal,
  httpResponseSizeBytes,
  httpRequestsInProgress,
  httpRequestSizeBytes,
  slowRequestsTotal,
  httpErrorsTotal
} from "./promotheous"

export function httpMetricsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/metrics') {
    return next();
  }
  const start = Date.now();
  const route = normalizeRoute(req.path);
  const method = req.method;

  httpRequestsInProgress.inc({ method, route });

  const requestSize = getRequestSize(req);
  httpRequestSizeBytes.observe({ method, route }, requestSize);
  let responseSize = 0;

  const originalEnd: typeof res.end = res.end.bind(res);
res.end = (function (...args: any[]) {
  const chunk = args[0];

  if (chunk) {
    if (Buffer.isBuffer(chunk)) {
      responseSize = chunk.length;
    } else if (typeof chunk === 'string') {
      responseSize = Buffer.byteLength(chunk);
    } else {
      responseSize = Buffer.byteLength(JSON.stringify(chunk));
    }
  }

  const headersSize = JSON.stringify(res.getHeaders()).length;
  responseSize += headersSize;

  const duration = (Date.now() - start) / 1000;
  const statusCode = res.statusCode.toString();
  httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  httpRequestsTotal.inc({ method, route, status_code: statusCode });
  httpResponseSizeBytes.observe({ method, route, status_code: statusCode }, responseSize);
  httpRequestsInProgress.dec({ method, route });

  if (duration > 1) slowRequestsTotal.inc({ route, method, threshold: '1s' });
  if (duration > 5) slowRequestsTotal.inc({ route, method, threshold: '5s' });
  if (duration > 10) slowRequestsTotal.inc({ route, method, threshold: '10s' });

  if (res.statusCode >= 400) {
    const errorType = res.statusCode >= 500 ? 'server_error' : 'client_error';
    httpErrorsTotal.inc({ method, route, status_code: statusCode, error_type: errorType });
  }
  return originalEnd(...args);
}) as typeof res.end;

  next();
}
function normalizeRoute(path: string): string {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:uuid')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[0-9a-f]{24}/g, '/:objectid');
}
function getRequestSize(req: Request): number {
  let size = 0;
  if (req.headers) size += JSON.stringify(req.headers).length;
  if (req.body) size += JSON.stringify(req.body).length;
  const contentLength = req.headers['content-length'];
  if (contentLength) size = Math.max(size, parseInt(contentLength, 10));
  return size;
}