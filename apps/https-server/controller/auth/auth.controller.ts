
import { isOTPValid, sendOTPEmail, SignUpSchema, storeOTP, VerifySchema } from "@cloud/backend-common";
import { prismaClient, Role, SubscriptionStatus, Tier_Subscription } from "@cloud/db";
import type { Request, Response } from "express";   
import { SignInSchema } from "@cloud/backend-common";
import { ForgotSchema } from "@cloud/backend-common";
import { ResetSchema } from "@cloud/backend-common";
import { GetKeyValue, IncreaseValueOfKey, isTokenValid, SetKeyValue, storeToken } from "@cloud/backend-common"
import { sendPasswordResetEmail } from "@cloud/backend-common";
import jwt from "jsonwebtoken";
import { logError } from "../../moinitoring/Log-collection/winston";

export function setAuthCookie(res: Response, token: string, token_name: string,maxAge:number) {
    const isDev = process.env.NODE_ENV === "development";
    res.cookie(token_name, token, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "strict",
      maxAge: maxAge,
      path: "/"
    });
  }
  export function clearAuthCookie(res: Response, token_name: string) {
    const isDev = process.env.NODE_ENV === "development";
    res.clearCookie(token_name, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "strict",
      path: "/",
    });
  }

  export async function hashPassword( rawPassword:string){
    return await Bun.password.hash(rawPassword,"bcrypt")

  }

  export async function verifyPassword(rawPassword:string,hashedPassword:string) {

    return await Bun.password.verify(rawPassword,hashedPassword,"bcrypt")

    
  }
  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }
  export  function generateRandomString(){
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "#$*!?&<>"
    const doubledSymbols = symbols.repeat(2)
    const option = shuffleArray([...letters, ...numbers, ...doubledSymbols])
    let randomString="";
    for(let i=0;i<24;i++){
        randomString+=option[Math.floor(Math.random() * option.length)];
    }
    return randomString;
    
  }
  
  
export function generateTimeId(): string{
    let timeId="";
    const option=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9", "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    for(let i=0;i<18;i++){
        timeId+=option[Math.floor(Math.random() * option.length)];
    }
    timeId+=Date.now();
    return timeId;
}

export function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}
export const signUp = async (req: Request, res: Response) => {
  try {
    const parsedData = SignUpSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid data", success: false });
    }

    const { email } = parsedData.data;
    const otp = generateOTP();
    const otpStored = await storeOTP(email, otp, 15);

    if (!otpStored) {
      res.status(500).json({ message: "Failed to store OTP", success: false });
      return;
    }

    const emailSent = await sendOTPEmail(email, otp, "Your OTP For Account Verification");
    if (!emailSent) {
      res.status(500).json({ message: "Failed to send OTP email", success: false });
      return;
    }

    res.status(201).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    logError(error as Error ?? "Unknown error")
    res.status(500).json({ message: "Failed to send OTP", success: false });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const parsedData = VerifySchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data", success: false });
            return;
        }
        const { email, otp, password, first_name, last_name } = parsedData.data;
        const isValid = await isOTPValid(email, otp);
        if (!isValid) {
            res.status(401).json({ message: "Invalid OTP", success: false });
            return;
        }
        const hashedPassword = await hashPassword(password)
         const freeTierRule = await prismaClient.tierRule.upsert({
            where: { tier: Tier_Subscription.FREE },
            update: {},
            create: {
              tier: Tier_Subscription.FREE,
              Max_Projects: 2,
              Max_Resources: 10,
              initialMemory: "500Mi",
              maxMemory: "2Gi",
              initialStorage: "5Gi",
              maxStorage: "5Gi",
              initialVCpu: "2",
              maxVCpu: "4",
            },
          });
        
          const admin = await prismaClient.userBaseAdmin.create({
            data: {
              email:email,
              password: hashedPassword,
              first_name: first_name,
              last_name: last_name,
              role: Role.ADMIN,
              is_active: true,
            },
          });
        
          await prismaClient.subscription.create({
            data: {
              userBaseAdminId: admin.id,
              tier: Tier_Subscription.FREE,
              tierId: freeTierRule.id,
              status: SubscriptionStatus.ACTIVE,
            },
          });
        
         
        res.status(201).json({ message: "User created successfully", success: true });

    } catch (error) {
      logError(error as Error ?? "Unknown error")
      res.status(500).json({ message: "Failed to create user", success: false });
    }
  };
  
export const signIn = async (req: Request, res: Response) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
        const {email, password,  } = parsedData.data;
        const failedAttempts = await GetKeyValue(email);
        if (failedAttempts?.value != null && failedAttempts.value >= 6) {
           res.status(403).json({ message: "Too many failed login attempts. Try again in 24 hours  or reset your password",success:false });
           return;
        }
        
        const user = await prismaClient.userBaseAdmin.findUnique({ where: { email } });
        
        const isValid = user && await verifyPassword(password, user.password);
        if (!isValid) {
            await IncreaseValueOfKey(email,1);
            res.status(401).json({ message: "Invalid username or password",success:false });
            return;
        }

        const payload1= {
            timeId:generateTimeId(),
            userId:user.id,
            tokenId: Bun.randomUUIDv7("hex"), 
            issuedAt: Date.now(), 
            nonce: generateRandomString()

        }
        const payload2= {
            timeId:generateTimeId(),
            userId:user.id,
            tokenId: Bun.randomUUIDv7("hex"), 
            issuedAt: Date.now(), 
            nonce: generateRandomString()
        }
        const access_token = jwt.sign({ payload1}, process.env.JWT_SECRET_ACCESS! ,);
        const refresh_token = jwt.sign({ payload2}, process.env.JWT_SECRET_REFRESH!,);
        
        setAuthCookie(res, access_token, "access_token",60 * 60* 1000*24*2);
        setAuthCookie(res, refresh_token, "refresh_token",60 * 60 * 1000*24*7);
        
        res.status(200).json({ message: "User signed in successfully",success:true});
    } catch (error) {
  
       res.status(500).json({ message: "Failed to sign in",success:false });
    }
};

export const csurf = async (req: Request, res: Response) => {
    try {
        const token = generateRandomString()
       setAuthCookie(res, token, "csurf_token",60 * 60 * 1000);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to generate token" });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
      clearAuthCookie(res, "access_token");
      clearAuthCookie(res, "refresh_token");
        res.status(200).json({ message: "User signed out successfully" ,success:true});
    } catch (error) {
        res.status(500).json({ message: "Failed to sign out",success:false });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            res.status(401).json({ message: "Invalid token",success:false });
            return;
        }
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH || '78yh76tvt7ividtgd75tbftewg') as { userId: string ,timeId: string ,tokenId: string ,issuedAt: number};
        if (!decoded.userId) {
            res.status(401).json({ message: "Invalid token",success:false });
            return;
        }
        const payload1= {
            timeId:generateTimeId(),
            userId:decoded.userId,
            tokenId: Bun.randomUUIDv7("hex"),
            issuedAt: Date.now(), 
            nonce: generateRandomString()
        }

        const access_token = jwt.sign({ payload1}, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667');
     
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000*24*2);
        res.status(200).json({ message: "Token refreshed successfully",success:true });
    } catch (error) {
        logError(error as Error ?? "Unknown error")
        res.status(500).json({ message: "Failed to refresh token",success:false });
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const parsedData = ForgotSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid data", success: false });
      return
    }

    const { email } = parsedData.data;

    const forgotAttempts = await GetKeyValue(email);
    if (forgotAttempts?.value != null && forgotAttempts.value >= 6) {
      res.status(403).json({ message: "Too many requests, try after 24 hours", success: false });
      return;
    }

    const user = await prismaClient.userBaseAdmin.findFirst({ where: { email } });
    if (user) {
      await IncreaseValueOfKey(email, 1);

      const resetPayload = {
        timeId: generateTimeId(),
        userId: user.id,
        tokenId: Bun.randomUUIDv7("hex"),
        issuedAt: Date.now(),
        nonce: generateRandomString()
      };

      const token = jwt.sign({ resetPayload }, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667');

      if (await storeToken(token)) {
        const link = `${process.env.NEXT_PUBLIC_URL}/reset-password?oneTimeToken=${token}`;
        await sendPasswordResetEmail(email, link);
      }
    }

    res.status(200).json({
      message: "If the user is registered, you will receive a password reset link within 5 minutes",
      success: true
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const parsedData = ResetSchema.safeParse(req.body);
        const token=req.headers.authorization?.split("Bearer")[1]?.trim()||"";
    
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
        const { newPassword } = parsedData.data;
        const resetPayloadData = jwt.verify(token, process.env.JWT_SECRET_ACCESS || 'z78hei7ritgfb67385vg7667') as {resetPayload:{ userId: string ,timeId: string ,tokenId: string ,issuedAt: number}};
    
        if (!await isTokenValid(token)) {
          res.status(403).json({ message: "Invalid Token",success:false });
          return;
        }
    
        const user = await prismaClient.userBaseAdmin.findFirst({
          where: {
            id: resetPayloadData.resetPayload.userId,
          },
        });
    
        if (!user) {
          res.status(403).json({ message: "Invalid Credentials",success:false });
          return;
        }
    
        const hashedPassword = await hashPassword(newPassword)  
        await prismaClient.userBaseAdmin.update({
            where: { id: resetPayloadData.resetPayload.userId },
            data: { password: hashedPassword },
        });   
    
         res.status(200).json({ message: "Password reset successfully",success:true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error",success:false });
    }
};  

export const getSession = async (req: Request, res: Response) => {

const userId=req.userId;

try{
  const user = await prismaClient.userBaseAdmin.findUnique({
    where: {
        id: userId,
    },
    select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        createdAt: true,
    },
});

if (!user) {
    res.status(401).json({ message: "User not found",success:false });
    return;
}

res.status(200).json({User:user,message:"User session data loaded",success:true});
}catch(_){
  res.status(500).json({ message: "Internal server error",success:false });
}

};