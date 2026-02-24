"use client";
export function WelcomeSection({ userName }: { userName: string }) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12 px-6 rounded-3xl mb-8">
      <h1 className="text-4xl font-bold">Welcome back, {userName || "User"}! 👋</h1>
      <p className="text-gray-300 mt-2">Ready to find your perfect vehicle?</p>
    </div>
  );
}
