"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { vehicleService } from "@/services/vehicle.service";
import { Card, CardBody, Button, Chip, Divider } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { BookingModal } from "@/components/bookings/BookingModal";

export default function VehicleDetailPage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const data = await vehicleService.getVehicleDetails(params.id as string);
        setVehicle(data);
      } catch (err) {
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="bg-white p-8 text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Vehicle not found"}</p>
          <Button color="primary" onPress={() => router.push('/dashboard/vehicles')}>
            Back to Vehicles
          </Button>
        </Card>
      </div>
    );
  }

  // Get vehicle images or defaults
  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [getDefaultImage(vehicle.vehicleType, vehicle._id)];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="light"
          onPress={() => router.push('/dashboard/vehicles')}
          className="mb-4"
        >
          ← Back to Vehicles
        </Button>

        <Card className="bg-white">
          <CardBody className="p-0">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left: Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={images[selectedImage]}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultImage(vehicle.vehicleType, vehicle._id);
                    }}
                  />
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <Chip
                      size="lg"
                      className={vehicle.availability ? "bg-green-500" : "bg-red-500"}
                      classNames={{
                        content: "text-white font-semibold px-3"
                      }}
                    >
                      {vehicle.availability ? "✓ Available" : "Not Available"}
                    </Chip>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImage === idx ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={img} alt={`${vehicle.model} ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.model}</h1>
                  <p className="text-lg text-gray-600">{vehicle.vehicleType}</p>
                </div>

                <Divider />

                {/* Price */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Price per day:</span>
                    <span className="text-3xl font-bold text-green-600">${vehicle.pricePerDay}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900">Vehicle Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span>👥</span> Capacity
                      </span>
                      <span className="font-medium text-gray-900">{vehicle.capacity} people</span>
                    </div>

                    {vehicle.licensePlate && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>🚗</span> License Plate
                        </span>
                        <span className="font-medium text-gray-900">{vehicle.licensePlate}</span>
                      </div>
                    )}

                    {vehicle.location?.city && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>📍</span> Location
                        </span>
                        <span className="font-medium text-gray-900">
                          {vehicle.location.city}, {vehicle.location.state}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span>✓</span> Status
                      </span>
                      <Chip
                        color={vehicle.availability ? "success" : "danger"}
                        variant="flat"
                      >
                        {vehicle.availability ? "Available Now" : "Not Available"}
                      </Chip>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Booking Button */}
                {vehicle.availability ? (
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full font-semibold text-lg"
                    onPress={() => setIsModalOpen(true)}
                  >
                    Book This Vehicle
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Currently Unavailable
                  </Button>
                )}

                {/* Additional Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>📞 Need help?</strong> Contact us for more information about this vehicle or to discuss your rental needs.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Booking Modal */}
      {vehicle && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicle={vehicle}
        />
      )}
    </div>
  );
}

// Helper function to get default images with variety
function getDefaultImage(vehicleType: string, vehicleId: string): string {
  const carImages = [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
  ];

  const suvImages = [
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
  ];

  const truckImages = [
    "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop",
  ];

  const luxuryImages = [
    "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617531653520-bd466ee527a9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
  ];

  const hashCode = (str: string) => {
    let hash = 0;
    const safeStr = str || 'default';
    for (let i = 0; i < safeStr.length; i++) {
      const char = safeStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const hash = hashCode(vehicleId);
  let imageArray: string[];
  const type = (vehicleType || '').toLowerCase();
  
  if (type.includes('truck') || type.includes('van')) {
    imageArray = truckImages;
  } else if (type.includes('suv')) {
    imageArray = suvImages;
  } else if (type.includes('luxury')) {
    imageArray = luxuryImages;
  } else {
    imageArray = carImages;
  }

  const index = hash % imageArray.length;
  return imageArray[index];
}
