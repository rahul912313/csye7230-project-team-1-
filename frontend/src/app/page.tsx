export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to <span className="text-blue-600">QuickRent</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted vehicle rental platform
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Browse Vehicles
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
