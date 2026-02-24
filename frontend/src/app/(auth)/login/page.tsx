"use client";

import type { ApiError } from "@/types/api";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/FormInput";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginFormData, loginSchema } from "@/lib/validation/auth";
import { RadioGroup as NextUIRadioGroup, Radio } from "@nextui-org/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Submitting login data:", data);
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data, selectedRole);

      // Check if admin object exists in the response
      if (response.data.admin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const apiError = error as ApiError;
      setError(
        apiError.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pt-8 px-8">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-sm text-default-500 text-center">
            Log in to your GoHaul account
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

            <div className="flex flex-col gap-1.5">
              <NextUIRadioGroup
                label="Select Role"
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as "user" | "admin")
                }>
                <Radio value="user">User</Radio>
                <Radio value="admin">Admin</Radio>
              </NextUIRadioGroup>
            </div>

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

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2">
              Log In
            </Button>

            <p className="text-center text-sm text-default-500">
              Dont have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
