import { z } from "zod";

export const SignUpSchema = z.object({
    email: z.string().email() .min(4).max(96),
    password: z
      .string()
      .min(8)
      .max(54)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
});

export const VerifySchema = z.object({
    email: z.string().email().min(4).max(96),
    otp: z.string().min(6).max(6),
    password: z
      .string()
      .min(8)
      .max(54)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
})

export const SignInSchema = z.object({
    email: z.string().email().min(3).max(96),
    password: z
      .string()
      .min(8)
      .max(54)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
  });

  export const ForgotSchema = z.object({
    email: z.string().email().min(3).max(96),
  });
  
  export const ResetSchema = z.object({
    newPassword: z
      .string()
      .min(8)
      .max(54)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
  });