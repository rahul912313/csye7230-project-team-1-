"use client";

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { Vehicle } from "@/types/vehicle";
import { useRouter } from "next/navigation";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all">
      <CardBody className="p-0">
        <div className="w-full h-48 bg-gray-100 rounded-t-xl overflow-hidden">
          <img
            src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"}
            alt={vehicle.model}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{vehicle.model}</h3>
            <Chip color={vehicle.availability ? "success" : "danger"} size="sm" variant="flat">
              {vehicle.availability ? "Available" : "Unavailable"}
            </Chip>
          </div>
          <p className="text-sm text-gray-600 mb-1">{vehicle.vehicleType}</p>
          <p className="text-sm text-gray-600 mb-3">Capacity: {vehicle.capacity} people</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">${vehicle.pricePerDay}/day</span>
            <Button
              size="sm"
              color="primary"
              onPress={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
