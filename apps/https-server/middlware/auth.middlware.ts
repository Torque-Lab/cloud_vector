import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@cloud/db';
import {
  authAttemptsTotal,
  authSuccessTotal,
  authFailuresTotal,
  authDuration,
} from '../moinitoring/promotheous';
import { logAuthEvent, securityLogger } from '../moinitoring/Log-collection/winston';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
      authStartTime?: number;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const authMethod = 'jwt';
  
  try {
    authAttemptsTotal.inc({ method: authMethod, status: 'started' });
    
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : undefined;
    const access_token = req.cookies.access_token || tokenFromHeader;
    
    if (!access_token) {
      const duration = (Date.now() - startTime) / 1000;
      authFailuresTotal.inc({ method: authMethod, reason: 'no_token' });
      authDuration.observe({ method: authMethod, status: 'failed' }, duration);
      logAuthEvent('JWT authentication failed', { 
        reason: 'no_token', 
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }, false);

      res.status(401).json({ error: 'Invalid token' });
      return;
    }
 
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS!) as { payload1: { userId: string, timeId: string, tokenId: string, issuedAt: number } };

    if(!decoded?.payload1?.userId) {
      const duration = (Date.now() - startTime) / 1000;
      authFailuresTotal.inc({ method: authMethod, reason: 'invalid_payload' });
      authDuration.observe({ method: authMethod, status: 'failed' }, duration);
      logAuthEvent('JWT authentication failed', { 
        reason: 'invalid_payload',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }, false);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    
    const userId = decoded.payload1.userId;
    const user = await prismaClient.userBaseAdmin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      const duration = (Date.now() - startTime) / 1000;
      authFailuresTotal.inc({ method: authMethod, reason: 'user_not_found' });
      authDuration.observe({ method: authMethod, status: 'failed' }, duration);
      securityLogger.warn('Authentication attempt with invalid user', {
        userId: decoded.payload1.userId,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.userId = user.id;
    
  
    const duration = (Date.now() - startTime) / 1000;
    authSuccessTotal.inc({ method: authMethod });
    authDuration.observe({ method: authMethod, status: 'success' }, duration);
    
    logAuthEvent('JWT authentication successful', {
      userId: 'anonymous',
      email: 'anonymous',
      duration: `${duration*1000}ms`,
      ip: req.ip
    }, true);
    
    next();
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    authFailuresTotal.inc({ method: authMethod, reason: 'exception' });
    authDuration.observe({ method: authMethod, status: 'failed' }, duration);
    logAuthEvent('JWT authentication exception', {
      error: error instanceof Error ? error.message : String(error),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }, false);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

export const csurfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sentToken = req.headers['x-csurf-token'] || req.body.csrfToken;
  const storedToken = req.cookies['csurf_token'];
  
  if (sentToken !== storedToken) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  next();
};
