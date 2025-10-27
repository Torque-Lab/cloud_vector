import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "@cloud/backend-common";
import { rateLimitHitsTotal } from '../moinitoring/promotheous';
import { logRateLimit, securityLogger } from '../moinitoring/Log-collection/winston';


export function genricRateLimiter(windowInMinutes:number,max:number){
    return rateLimit({
        store: new RedisStore({
            sendCommand: async (...args: string[])=>  (await getRedisClient()).sendCommand(args)
        }),
          windowMs: windowInMinutes * 60 * 1000,
          max: max,
          message: {
            status: 429,
            message: "Too many requests - try after some time.",
          },
          handler: (req, res) => {
            // Track rate limit hits
            const route = req.path;
            const userType = req?.userId ? 'authenticated' : 'anonymous';
            const userId = req?.userId || 'anonymous';
            
            rateLimitHitsTotal.inc({ route, user_type: userType });
            
            // Log rate limit event
            logRateLimit(route, "anonymous", 0, true);
            
            securityLogger.warn('Rate limit exceeded', {
              route,
              userId: "anonymous",
              userType,
              ip: req.ip,
              userAgent: req.headers['user-agent']
            });
            
            res.status(429).json({
              status: 429,
              message: "Too many requests - try after some time.",
            });
          },
    });
}
