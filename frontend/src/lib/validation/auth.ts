import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"]).default("user"),
    driverLicense: z.string().optional(),
    adminCode: z.string().optional(),
  })
  .refine(
    (data) =>
      data.role !== "user" ||
      (data.driverLicense && data.driverLicense.length > 0),
    {
      message: "Driver's license is required for users",
      path: ["driverLicense"],
    }
  )
  .refine(
    (data) =>
      data.role !== "admin" || (data.adminCode && data.adminCode.length > 0),
    {
      message: "Admin code is required for admins",
      path: ["adminCode"],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
