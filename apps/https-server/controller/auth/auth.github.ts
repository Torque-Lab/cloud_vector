import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import type { Profile } from 'passport-github';
import { prismaClient } from '@cloud/db';
import jwt from 'jsonwebtoken';
import type { Request, Response, RequestHandler, NextFunction } from 'express';
import { setAuthCookie, generateTimeId, hashPassword, generateRandomString } from './auth.controller';
import { authAttemptsTotal, authSuccessTotal, authFailuresTotal, authDuration } from '../../moinitoring/promotheous';

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: new URL('/api/auth/github/callback', process.env.NEXT_PUBLIC_URL).toString()
  },
  async (_access_token, _refresh_token, profile: Profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value;

      if (!email) {
        console.error('No email in GitHub profile — aborting user creation.');
        return done(null, false, { message: 'Email not found in GitHub profile' });
      }

      const dbId = `github-${profile.id}`;
      let githubUser = await prismaClient.userBaseAdmin.findUnique({
        where: { id: dbId }
      });

      if (!githubUser) {
        githubUser = await prismaClient.userBaseAdmin.create({
          data: {
            id: dbId,
            email: email,
            first_name: profile?.name?.givenName?? '',
            last_name: profile?.name?.familyName?? '',
            password: await hashPassword(generateRandomString())
          },
        });
      }

      done(null, githubUser);
    } catch (err) {
      console.error('Error in GitHub strategy:', err);
      done(err as Error, false);
    }
  }
));

export default passport;

interface githubUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  username: string;
  password: string;
}

export const startGithubAuth = (): RequestHandler => {
  return passport.authenticate('github', { scope: ['user:email'] });
};
export const githubCallbackMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  authAttemptsTotal.inc({ method: 'github', status: 'started' });
  const startTime = Date.now();
  
  passport.authenticate('github', { session: false }, (err: Error, user: githubUser) => {
    if (err || !user) {
      console.error('GitHub OAuth error:', err);
      const duration = (Date.now() - startTime) / 1000;
      authFailuresTotal.inc({ method: 'github', reason: 'oauth_error' });
      authDuration.observe({ method: 'github', status: 'failed' }, duration);
      res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=github`);
      return;
    }
    req.user = user;
    (req as any).authStartTime = startTime;
    next();
  })(req, res, next);
};

export const handleGithubCallback = async (req: Request, res: Response): Promise<void> => {
  const startTime = (req as any).authStartTime || Date.now();
  const user = req.user as githubUser;

  if (!user) {
    console.error('No user in request after GitHub auth');
    const duration = (Date.now() - startTime) / 1000;
    authFailuresTotal.inc({ method: 'github', reason: 'no_user' });
    authDuration.observe({ method: 'github', status: 'failed' }, duration);
    res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=github`);
    return;
  }

  const payload1 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: crypto.randomUUID(),
    issuedAt: Date.now(),
    nonce: generateRandomString()
  };

  const payload2 = {
    timeId: generateTimeId(),
    userId: user.id,
    tokenId: crypto.randomUUID(),
    issuedAt: Date.now(),
    nonce: generateRandomString()
  };

  const access_token = jwt.sign({ payload1 }, process.env.JWT_SECRET_ACCESS!);
  const refresh_token = jwt.sign({ payload2 }, process.env.JWT_SECRET_REFRESH!);

  setAuthCookie(res, access_token, 'access_token', 60 * 60 * 1000);
  setAuthCookie(res, refresh_token, 'refresh_token', 60 * 60 * 1000 * 24 * 7);

  // Track success metrics
  const duration = (Date.now() - startTime) / 1000;
  authSuccessTotal.inc({ method: 'github' });
  authDuration.observe({ method: 'github', status: 'success' }, duration);

  res.redirect(`${process.env.NEXT_PUBLIC_URL}/callback`);
};
