import z from "zod";

const emailSchema = z.email("Enter a valid email").min(1, "Email is required");

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Enter a strong password");

const tokenSchema = z.string().min(1, "Token is required");

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const resetTokenSchema = z.object({
  resetToken: tokenSchema,
});

const resetPasswordSchema = z.object({
  resetToken: tokenSchema,
  newPassword: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const googleLoginSchema = z.object({
  token: tokenSchema,
});

export {
  signupSchema,
  loginSchema,
  resetTokenSchema,
  passwordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
};