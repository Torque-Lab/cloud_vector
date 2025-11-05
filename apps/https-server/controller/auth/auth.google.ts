import passport from 'passport';
import { Strategy as GoogleStrategy,  } from 'passport-google-oauth20';
import type { Profile } from 'passport-google-oauth20';
import { prismaClient, Role, SubscriptionStatus, Tier_Subscription } from '@cloud/db';
import jwt from 'jsonwebtoken';
import type { Request, Response, RequestHandler, NextFunction } from 'express';
import { hashPassword, setAuthCookie } from './auth.controller';
import { generateTimeId } from './auth.controller';
import { generateRandomString } from './auth.controller';
import { authAttemptsTotal, authSuccessTotal, authFailuresTotal, authDuration } from '../../moinitoring/promotheous';
import { logAuthEvent } from '../../moinitoring/Log-collection/winston';
import { generateCuid } from '../../utils/random';

passport.use(new GoogleStrategy(
  { 
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: new URL('/api/v1/auth/google/callback', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000').toString()
  },
  async (_accessToken,_refreshToken, profile: Profile, done) => {
    try {
        const email=profile.emails![0]!.value ?? '';

      let googleUser = await prismaClient.userBaseAdmin.findUnique({
        where: {email: email}
      });

      if (!googleUser) {
            const freeTierRule = await prismaClient.tierRule.upsert({
                        where: { tier: Tier_Subscription.FREE },
                        update: {},
                        create: {
                          tier: Tier_Subscription.FREE,
                          Max_Projects: 2,
                          Max_Resources: 10,
                          initialMemory: "500Mi",
                          maxMemory: "1Gi",
                          initialStorage: "5Gi",
                          maxStorage: "2Gi",
                          initialVCpu: "1",
                          maxVCpu: "2",
                        },
                      });
                    
                       googleUser = await prismaClient.userBaseAdmin.create({
                        data: {
                          email:email,
                          password: await hashPassword(generateRandomString()),
                          first_name: profile?.name?.givenName?? '',
                          last_name: profile?.name?.familyName?? '',
                          role: Role.ADMIN,
                          is_active: true,
                        },
                      });
                    
                      await prismaClient.subscription.create({
                        data: {
                          userBaseAdminId: googleUser.id,
                          stripeCustomerId: generateCuid(),//dummy if for free tier
                          tierId: freeTierRule.id,
                          status: SubscriptionStatus.ACTIVE,
                        },
                      });
    
      }

      done(null, googleUser);
    } catch (err) {
      logAuthEvent('Google OAuth failed', { 
        reason: 'oauth_error', 
        error: 'Google OAuth failed'
      }, false);
      done(err as Error, false);
    }
  }
));

export default passport;


interface googleUser{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    first_name: string | null;
    last_name: string | null;
    image: string | null;
    email: string;
    password: string;
}
export const startGoogleAuth = (): RequestHandler => {
    return passport.authenticate('google', { scope: ['profile', 'email'] })
}


export const googleCallbackMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  authAttemptsTotal.inc({ method: 'google', status: 'started' });
  const startTime = Date.now();
  
  passport.authenticate('google', { session: false }, (err: Error, user: googleUser) => {
    if (err || !user) {
      const duration = (Date.now() - startTime) / 1000;
      authFailuresTotal.inc({ method: 'google', reason: 'oauth_error' });
      authDuration.observe({ method: 'google', status: 'failed' }, duration);
      logAuthEvent('Google OAuth failed', { 
        reason: 'oauth_error', 
        error: err?.message 
      }, false);
      res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=google`);
      return;
    }
    req.user = user;
  req.authStartTime = startTime;
    next();
  })(req, res, next);
};
export const handleGoogleCallback = async(req: Request, res: Response): Promise<void> => {
  const startTime = req.authStartTime || Date.now();
  const user = req.user as googleUser;

  if (!user) {
    const duration = (Date.now() - startTime) / 1000;
    authFailuresTotal.inc({ method: 'google', reason: 'no_user' });
    authDuration.observe({ method: 'google', status: 'failed' }, duration);
    logAuthEvent('Google OAuth failed', { reason: 'no_user' }, false);
    res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=google`);
    return;
  }

  const payload1 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: Bun.randomUUIDv7(),
    issuedAt: Date.now(),
    nonce: generateRandomString()
  };

  const payload2 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: Bun.randomUUIDv7(),
    issuedAt: Date.now(),
    nonce: generateRandomString()
  };

  const access_token = jwt.sign({ payload1 }, process.env.JWT_SECRET_ACCESS!);
  const refresh_token = jwt.sign({ payload2 }, process.env.JWT_SECRET_REFRESH!);

  setAuthCookie(res, access_token, "access_token", 60 * 60 * 1000);
  setAuthCookie(res, refresh_token, "refresh_token", 60 * 60 * 1000 * 24 * 7);

  // Track success metrics
  const duration = (Date.now() - startTime) / 1000;
  authSuccessTotal.inc({ method: 'google' });
  authDuration.observe({ method: 'google', status: 'success' }, duration);
  
  logAuthEvent('Google OAuth successful', {
    method: 'google',
    userId: 'anonymous',
    email: 'anonymous',
    duration: `${duration*1000}ms`
  }, true);

  res.redirect(`${process.env.NEXT_PUBLIC_URL }/callback` || 'http://localhost:3000/callback');
  return;
};
