import { createLogger, format, transports,Logger} from 'winston';
import type { Request, Response } from 'express';
import path from 'path';
const LOG_DIR = process.env.LOG_DIR || path.join(process.env.HOME || '.', 'logs', 'cloud_vector');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// JSON format for file logging
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.metadata(),
  format.json()
);

const consoleTransport = new transports.Console({
  format: consoleFormat,
  level: IS_PRODUCTION ? 'info' : 'debug'
});


const baseLoggerConfig = {
  level: IS_PRODUCTION ? 'info' : 'debug',
  format: fileFormat,
  defaultMeta: { 
    service: 'https-server',
    environment: NODE_ENV,
    hostname: process.env.HOSTNAME || 'localhost'
  },
  exitOnError: false
};



// MAIN APPLICATION LOGGER
export const logger = createLogger({
  ...baseLoggerConfig,
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'app.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    new transports.File({ 
      filename: path.join(LOG_DIR, 'app-error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

export const httpLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'http' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'http-requests.log'),
      maxsize: 20971520, // 20MB
      maxFiles: 10
    })
  ]
});


export const authLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'auth' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'auth.log'),
      maxsize: 10485760,
      maxFiles: 10
    }),
    new transports.File({ 
      filename: path.join(LOG_DIR, 'auth-failures.log'),
      level: 'warn',
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});


export const dbLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'database' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'database.log'),
      maxsize: 10485760,
      maxFiles: 5
    }),
    new transports.File({ 
      filename: path.join(LOG_DIR, 'database-errors.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});


export const errorLogger = createLogger({
  ...baseLoggerConfig,
  level: 'error',
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'error' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'errors.log'),
      maxsize: 10485760,
      maxFiles: 10
    }),
    new transports.File({ 
      filename: path.join(LOG_DIR, 'critical-errors.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 20
    })
  ]
});


export const securityLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'security' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'security.log'),
      maxsize: 10485760,
      maxFiles: 20 // keeping 20 files for security logs
    }),
    new transports.File({ 
      filename: path.join(LOG_DIR, 'security-alerts.log'),
      level: 'warn',
      maxsize: 10485760,
      maxFiles: 20
    })
  ]
});



export const businessLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'business' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'business-operations.log'),
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

export const performanceLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'performance' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'performance.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});



export const auditLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'audit' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'audit.log'),
      maxsize: 20971520, // 20MB
      maxFiles: 30 // keeping 30 files for audit logs
    })
  ]
});


export const externalApiLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'external_api' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'external-api.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});



export const rateLimitLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'rate_limit' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'rate-limits.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});


export const webhookLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'webhook' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'webhooks.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

export const queueLogger = createLogger({
  ...baseLoggerConfig,
  defaultMeta: { ...baseLoggerConfig.defaultMeta, logType: 'queue' },
  transports: [
    consoleTransport,
    new transports.File({ 
      filename: path.join(LOG_DIR, 'queue-operations.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});





   export function logOnConsole<T extends Record<string, any>>(message: string, details: T,isConsoleLogEnable:boolean=true) {
    withConsoleDisabled(logger,isConsoleLogEnable,()=>{
      logger.info(message,details)
    })
   }



function withConsoleDisabled(logger:Logger,isConsoleLogEnable:boolean, fn:() => void) {
  const hasConsole = logger.transports.includes(consoleTransport);
  if (hasConsole && !isConsoleLogEnable) logger.remove(consoleTransport);
  fn();
  if (hasConsole && !isConsoleLogEnable) logger.add(consoleTransport);
}
export function logHttpRequest<T extends Record<string, any>>(req: Request, res: Response, duration: number,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(httpLogger,isConsoleLogEnable,()=>{
    httpLogger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.socket.remoteAddress,
      userId: 'anonymous'
    });
  })
}

/**
 * Log authentication events
 */

export function logAuthEvent<T extends Record<string, any>>(event: string, details: T, success: boolean,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(authLogger,isConsoleLogEnable,()=>{
    const logLevel = success ? 'info' : 'warn';
    authLogger[logLevel](`Auth: ${event}`, {
      event,
      success,
      ...details,
    timestamp: new Date().toISOString()
  });
})
}

/**
 * Log database operations
 */
export function logDbOperation<T extends Record<string, any>>(operation: string, table: string, duration: number, success: boolean, error?: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(dbLogger,isConsoleLogEnable,()=>{
    const logLevel = success ? 'info' : 'error';
    dbLogger[logLevel](`DB: ${operation} on ${table}`, {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    error: error ? { message: error.message, stack: error.stack } : undefined
  });
})
}

/**
 * Log business operations
 */
export function logBusinessOperation<T extends Record<string, any>>(operation: string, resourceType: string, details: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(businessLogger,isConsoleLogEnable,()=>{
    businessLogger.info(`Business: ${operation}`, {
    operation,
    resourceType,
    ...details,
    timestamp: new Date().toISOString()
  });
})
}

/**
 * Log security events
 */
export function logSecurityEvent<T extends Record<string, any>>(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(securityLogger,isConsoleLogEnable,()=>{
    const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    securityLogger[logLevel](`Security: ${event}`, {
    event,
    severity,
    ...details,
    timestamp: new Date().toISOString()
  });
})
}

/**
 * Log performance metrics
 */
export function logPerformance<T extends Record<string, any>>(operation: string, duration: number, details?: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(performanceLogger,isConsoleLogEnable,()=>{
    const logLevel = duration > 5000 ? 'warn' : 'info';
    performanceLogger[logLevel](`Performance: ${operation}`, {
    operation,
    duration: `${duration}ms`,
    slow: duration > 1000,
    ...details
  });
})
}

/**
 * Log errors with full context
 */
export function logError<T extends Record<string, any>>(error: Error, context?: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(errorLogger,isConsoleLogEnable,()=>{
    errorLogger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    timestamp: new Date().toISOString()
  });
}
  )}
/**
 * Log audit 
 */
export function logAudit<T extends Record<string, any>>(action: string, userId: string, details: T,isConsoleLogEnable:boolean=  false) {
    withConsoleDisabled(auditLogger,isConsoleLogEnable,()=>{
    auditLogger.info(`Audit: ${action}`, {
    action,
    userId,
    ...details,
    timestamp: new Date().toISOString()
  });
})
}


/**
 * Log external API calls
 */
export function logExternalApi<T extends Record<string, any>>(service: string, endpoint: string, method: string, statusCode: number, duration: number, details?: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(externalApiLogger,isConsoleLogEnable,()=>{
  const logLevel = statusCode >= 400 ? 'warn' : 'info';
  externalApiLogger[logLevel](`External API: ${service}`, {
    service,
    endpoint,
    method,
    statusCode,
    duration: `${duration}ms`
  });
})
}

/**
 * Log rate limit events
 */
export function logRateLimit<T extends Record<string, any>>(route: string, userId: string, remaining: number, exceeded: boolean, details?: T,isConsoleLogEnable:boolean=false) {
  withConsoleDisabled(rateLimitLogger,isConsoleLogEnable,()=>{
  const logLevel = exceeded ? 'warn' : 'info';
  rateLimitLogger[logLevel]('Rate Limit', {
    route,
    userId,
    remaining,
    exceeded,
    timestamp: new Date().toISOString()
  });
})
}

// Log startup
logger.info(' Winston logging system initialized', {
  environment: NODE_ENV,
  logDirectory: LOG_DIR,
  loggers: [
    'main', 'http', 'auth', 'database', 'error', 'security',
    'business', 'performance', 'audit', 'external-api', 'rate-limit', 'webhook', 'queue'
  ]
});

export default logger;