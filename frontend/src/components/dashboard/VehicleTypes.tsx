"use client";
export function VehicleTypes() {
  const types = ["Sedan", "SUV", "Cargo Van", "Moving Truck", "Large Truck", "Luxury"];
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Browse by Type</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {types.map((type) => (
          <div key={type} className="bg-white rounded-xl p-4 text-center shadow hover:shadow-md cursor-pointer">
            <p className="font-medium text-gray-700">{type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
