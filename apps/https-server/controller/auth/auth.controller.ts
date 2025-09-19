
import { getOTP, isOTPValid, sendOTPEmail, SignUpSchema, storeOTP, VerifySchema } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";   
import { SignInSchema } from "@cloud/backend-common";
import { ForgotSchema } from "@cloud/backend-common";
import { ResetSchema } from "@cloud/backend-common";
import { GetKeyValue, IncreaseValueOfKey, isTokenValid, SetKeyValue, storeToken } from "@cloud/backend-common"
import { sendPasswordResetEmail } from "@cloud/backend-common";
import jwt from "jsonwebtoken";



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
  export  function generateRandomString(){
    return Bun.randomUUIDv7("hex")+generateTimeId()
    
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
      return res.status(400).json({ error: "Invalid data", success: false });
    }

    const { email } = parsedData.data;
    const otp = generateOTP();
    const otpStored = await storeOTP(email, otp, 15);

    if (!otpStored) {
      res.status(500).json({ error: "Failed to store OTP", success: false });
      return;
    }

    const emailSent = await sendOTPEmail(email, otp, "Your OTP For Account Verification");
    if (!emailSent) {
      res.status(500).json({ error: "Failed to send OTP email", success: false });
      return;
    }

    res.status(201).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP", success: false });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const parsedData = VerifySchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ error: "Invalid data", success: false });
            return;
        }
        const { email, otp, password, first_name, last_name } = parsedData.data;
        const isValid = await isOTPValid(email, otp);
        if (!isValid) {
            res.status(401).json({ error: "Invalid OTP", success: false });
            return;
        }
        const hashedPassword = await hashPassword(password)
         await prismaClient.userBaseAdmin.create({
            data:{
                email,
                first_name,
                last_name,
                password:hashedPassword,
                
            }
        })
        res.status(201).json({ message: "User created successfully", success: true });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user", success: false });
    }
  };
  
export const signIn = async (req: Request, res: Response) => {
    try {
      console.log(req.body)
        const parsedData = SignInSchema.safeParse(req.body);
        if(!parsedData.success) {
            res.status(400).json({ error: "Invalid data" });
            return;
        }
        const {email, password,  } = parsedData.data;
        const failedAttempts = await GetKeyValue(email);
        if (failedAttempts?.value != null && failedAttempts.value >= 6) {
           res.status(403).json({ message: "Too many failed login attempts. Try again in 24 hours  or reset your password" });
           return;
        }
        
        const user = await prismaClient.userBaseAdmin.findUnique({ where: { email } });
        
        const isValid = user && await verifyPassword(password, user.password);
        if (!isValid) {
            await IncreaseValueOfKey(email,1);
            res.status(401).json({ error: "Invalid username or password" });
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
        
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000);
        setAuthCookie(res, refresh_token, "refresh_token",60 * 60 * 1000*24*7);
        
        res.status(200).json({ message: "User signed in successfully",success:true});
    } catch (error) {
  
       res.status(500).json({ error: "Failed to sign in",success:false });
    }
};

export const csurf = async (req: Request, res: Response) => {
    try {
        const token = generateRandomString()
       setAuthCookie(res, token, "csurf_token",60 * 60 * 1000);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate token" });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
      clearAuthCookie(res, "access_token");
      clearAuthCookie(res, "refresh_token");
        res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to sign out" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH || '78yh76tvt7ividtgd75tbftewg') as { userId: string ,timeId: string ,tokenId: string ,issuedAt: number};
        if (!decoded.userId) {
            res.status(401).json({ error: "Invalid token" });
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
     
        setAuthCookie(res, access_token, "access_token",60 * 60 * 1000);
        res.status(200).json({ access_token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to refresh token" });
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
    res.status(500).json({ error: "Internal server error", success: false });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const parsedData = ResetSchema.safeParse(req.body);
    
        if (!parsedData.success) {
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
        const { token, newPassword } = parsedData.data;
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
        res.status(500).json({ error: "Internal server error",success:false });
    }
};  

export const getSession = async (req: Request, res: Response) => {

const userId=req.userId;
const user = await prismaClient.userBaseAdmin.findUnique({
    where: {
        id: userId,
    },
    select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        createdAt: true,
    },
});

if (!user) {
    res.status(401).json({ error: "User not found",success:false });
    return;
}

res.status(200).json({user,success:true});
};