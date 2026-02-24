"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Vehicle, VehicleType } from "@/types/vehicle";
import { vehicleService } from "@/services/vehicle.service";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

export default function VehiclePage() {
  // ============= State Management =============
  // Main data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search states
  const [selectedType, setSelectedType] = useState<"All" | VehicleType>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // ============= Data Fetching =============
  // Initial data fetch on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Function to fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getAllVehicles();

      // Validate the response data
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles. Please try again later.");
      setVehicles([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // ============= Event Handlers =============
  // Handle availability check
  const handleAvailabilityCheck = async () => {
    // Validate date inputs
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format dates for API
      const formattedStartDate = new Date(startDate)
        .toISOString()
        .split("T")[0];
      const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

      const availableVehicles = await vehicleService.getAvailableVehicles(
        formattedStartDate,
        formattedEndDate
      );

      console.log("Available vehicles response:", availableVehicles);

      if (!Array.isArray(availableVehicles)) {
        console.error("Received non-array:", availableVehicles);
        throw new Error("Invalid data format received");
      }

      setVehicles(availableVehicles);
    } catch (err) {
      console.error("Error checking availability:", err);
      setError("Failed to check availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle booking initiation
  const handleBooking = (vehicleId: string) => {
    if (!startDate || !endDate) {
      setError("Please select rental dates first");
      return;
    }
    // Redirect to booking page with necessary parameters
    window.location.href = `/booking?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`;
  };

  // ============= Filter Logic =============
  // Filter vehicles based on selected type
  const getFilteredVehicles = () => {
    if (!Array.isArray(vehicles)) return [];
    return selectedType === "All"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.vehicleType === selectedType);
  };

  // ============= Main Render =============
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <h1 className="text-2xl font-bold mb-2">Available Vehicles</h1>
        <p className="text-gray-400 mb-6">
          Choose from our range of reliable vehicles
        </p>

        {/* Date Selection Section */}
        <div className="flex gap-4 mb-6">
          <Input
            type="date"
            label="Start Date"
            placeholder="Select start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-xs"
          />
          <Input
            type="date"
            label="End Date"
            placeholder="Select end date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-xs"
          />
          <Button color="primary" onClick={handleAvailabilityCheck}>
            Check Availability
          </Button>
        </div>

        {/* Vehicle Type Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            className={
              selectedType === "All" ? "bg-orange-500 text-white" : "bg-default"
            }
            onClick={() => setSelectedType("All")}>
            All
          </Button>
          {["Sedan", "Cargo Van", "Moving Truck", "Large Truck"].map((type) => (
            <Button
              key={type}
              className={
                selectedType === type
                  ? "bg-orange-500 text-white"
                  : "bg-default"
              }
              onClick={() => setSelectedType(type as VehicleType)}>
              {type}
            </Button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 py-8">
            Loading vehicles...
          </div>
        )}

        {/* Empty State */}
        {!loading && getFilteredVehicles().length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No vehicles available for the selected criteria.
          </div>
        )}

        {/* Vehicle Grid */}
        {!loading && getFilteredVehicles().length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredVehicles().map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
