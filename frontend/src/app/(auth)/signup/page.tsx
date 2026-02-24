"use client";

import type { ApiError } from "@/types/api";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupFormData, signupSchema } from "@/lib/validation/auth";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control, // Add control
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user", // Set default role
      driverLicense: "",
      adminCode: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    console.log("Submitting data:", data);
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signup(data, data.role);
      console.log("Full signup response:", response);

      // More strict role checking
      const userRole = response.data?.user?.role?.toLowerCase();
      console.log("Processed user role:", userRole);

      if (userRole === "admin") {
        console.log("Redirecting to admin dashboard");
        router.push("/admin/dashboard");
      } else if (userRole === "user") {
        console.log("Redirecting to user dashboard");
        router.push("/dashboard");
      } else {
        console.error("Unknown role:", userRole);
        setError("Invalid role received from server");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const apiError = error as ApiError;
      setError(
        apiError.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pt-8 px-8">
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>
          <p className="text-sm text-default-500 text-center">
            Sign up to start using GoHaul
          </p>
        </CardHeader>

        <CardBody className="px-8 py-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <RadioGroup
              name="role"
              label="Select Role"
              control={control}
              error={errors.role}
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
            />

            <FormInput
              name="name"
              label="Full Name"
              placeholder="John Doe"
              register={register}
              error={errors.name}
              isRequired
            />

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              register={register}
              error={errors.email}
              isRequired
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.password}
              isRequired
            />

            {selectedRole === "user" && (
              <FormInput
                name="driverLicense"
                label="Driver's License Number"
                placeholder="Enter your license number"
                register={register}
                error={errors.driverLicense}
                isRequired
              />
            )}

            {selectedRole === "admin" && (
              <>
                <FormInput
                  name="adminCode"
                  label="Admin Code"
                  type="password"
                  placeholder="Enter admin code"
                  register={register}
                  error={errors.adminCode}
                  isRequired
                />
                <p className="text-sm text-gray-500 mt-1">
                  Contact administrator for the admin code
                </p>
              </>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2">
              Create Account
            </Button>

            <p className="text-center text-sm text-default-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
