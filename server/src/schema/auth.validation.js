import z from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required").min(8, "Enter a strong password"),
});

const loginSchema = z.object({
  email: z.email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export { signupSchema, loginSchema };
