import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth/auth.route";
import passport from "passport";
import postgresRouter from "../routes/infra/postgres.route";
import projectRouter from "../routes/infra/project.route";
import rabbitmqRouter from "../routes/infra/rabbitmq.route";
import redisRouter from "../routes/infra/redis.route";
import dashboardRouter from "../routes/infra/dashboard.route";
import { register } from '../moinitoring/promotheous';


import {
  applicationErrorsTotal,
  healthCheckTotal,
  healthCheckDuration,
} from '../moinitoring/promotheous';
import {httpMetricsMiddleware} from '../moinitoring/https-metric-middlware';
import logger, { logOnConsole } from "../moinitoring/Log-collection/winston";

const app = express();
app.use(httpMetricsMiddleware);
app.use(express.json());
app.use(cookieParser());
const isDev=process.env.NODE_ENV==='developement';
if(!isDev){
  app.set("trust proxy", 1);
}

app.use(passport.initialize());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/infra",dashboardRouter)
app.use("/api/v1/infra",postgresRouter);
app.use("/api/v1/infra",projectRouter);
app.use("/api/v1/infra",rabbitmqRouter);
app.use("/api/v1/infra",redisRouter);




app.get("/api/v1/metrics", async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).end("Internal Server Error");
  }
});


app.get("/api/v1/health", (req, res) => {
    const start = Date.now();
    const token=req.query.health_token as string;
    
    if(!token){
        healthCheckTotal.inc({ status: 'unauthorized' });
        return res.status(401).json({ message: "Unauthorized",success:false,});
    }
    
     
   if(token!=process.env.HEALTH_TOKEN){
    healthCheckTotal.inc({ status: 'unauthorized' });
    return res.status(401).json({ message: "Unauthorized",success:false,});
   }
   
    const duration = (Date.now() - start) / 1000;
    healthCheckTotal.inc({ status: 'success' });
    healthCheckDuration.observe({ status: 'success' }, duration);
    
    res.status(200).json({ 
      message: "server is running on port 3005",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
});


app.listen(3005, () => {
  logOnConsole(' HTTPS Server started', { 
    port: 3005, 
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
   
});


process.on('unhandledRejection', (reason, p) => {
logger.error('Unhandled Rejection:', reason);
  applicationErrorsTotal.inc({ 
    error_type: 'unhandled_rejection', 
    severity: 'critical',
    route: 'global'
  });
});

process.on('uncaughtException', (err) => {
logger.error('Uncaught Exception:', err);
  applicationErrorsTotal.inc({ 
    error_type: 'uncaught_exception', 
    severity: 'critical',
    route: 'global'
  });
});
process.on("SIGTERM", (s) => {
    logOnConsole("SIGTERM received",{"signal-SIGTERM":s},true);
    process.exit(0);
});