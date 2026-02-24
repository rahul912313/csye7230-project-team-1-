import { LoginFormData, SignupFormData } from "@/lib/validation/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthResponse {
  data: {
    user?: {
      id: string;
      email: string;
      name: string;
      role: "user" | "admin";
    };
    admin?: {
      id: string;
      email: string;
      name: string;
    };
    token?: string;
  };
}

class AuthService {
  async login(
    credentials: LoginFormData,
    role: "user" | "admin"
  ): Promise<AuthResponse> {
    const endpoint = role === "admin" ? "/auth/admin/login" : "/auth/login";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: any = new Error(errorData.message || "Login failed");
      error.response = {
        data: errorData,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async signup(data: SignupFormData, role: "user" | "admin"): Promise<AuthResponse> {
    const endpoint = role === "admin" ? "/auth/admin/signup" : "/auth/signup";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: any = new Error(errorData.message || "Signup failed");
      error.response = {
        data: errorData,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }
}

export const authService = new AuthService();
