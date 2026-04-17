export type VehicleType = "Sedan" | "Cargo Van" | "Moving Truck" | "Large Truck" | "SUV" | "Luxury";

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  vehicleType: VehicleType | string;
  pricePerDay: number;
  availability: boolean;
  capacity: number;
  licensePlate?: string;
  images?: string[];
  description?: string;
  location?: {
    city: string;
    state: string;
    country?: string;
  };
  seats?: number;
  transmission?: string;
  fuelType?: string;
}
