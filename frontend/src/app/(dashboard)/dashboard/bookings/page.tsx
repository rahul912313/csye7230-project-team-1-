"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Chip, Button, Divider } from "@nextui-org/react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking";
import { Calendar, Car, MapPin, Clock, TrendingUp } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings();
      setBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.message || "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      fetchBookings();
    } catch (error: any) {
      console.error("Error canceling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: { 
        color: "success" as const, 
        label: "Completed",
        icon: "✓",
        bgClass: "bg-green-100",
        iconColor: "text-green-600"
      },
      confirmed: { 
        color: "primary" as const, 
        label: "Confirmed",
        icon: "✓",
        bgClass: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      pending: { 
        color: "warning" as const, 
        label: "Pending",
        icon: "⏳",
        bgClass: "bg-yellow-100",
        iconColor: "text-yellow-600"
      },
      canceled: { 
        color: "danger" as const, 
        label: "Canceled",
        icon: "✕",
        bgClass: "bg-red-100",
        iconColor: "text-red-600"
      },
    };

    return configs[status as keyof typeof configs] || configs.pending;
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12 px-6 rounded-3xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Loading Your Bookings...</h1>
              <p className="text-gray-300">Please wait</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardBody className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-4xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Bookings</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                color="primary"
                onPress={fetchBookings}
                className="bg-gradient-to-r from-blue-600 to-gray-900"
              >
                Try Again
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12 px-6 rounded-3xl mb-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yMCAyMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block">
                <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 mx-auto border border-blue-400/30">
                  <Calendar className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                My Bookings
              </h1>
              <p className="text-xl text-gray-300">
                Track and manage all your vehicle reservations
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                    <p className="text-sm text-gray-300">Total Bookings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeBookings}</p>
                    <p className="text-sm text-gray-300">Active Bookings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{confirmedCount}</p>
                    <p className="text-sm text-gray-300">Confirmed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-gray-300">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="bg-white shadow-xl">
            <CardBody className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by booking your first vehicle!</p>
              <Button
                size="lg"
                as="a"
                href="/dashboard/vehicles"
                className="bg-gradient-to-r from-blue-600 to-gray-900 text-white font-semibold px-8"
              >
                Browse Vehicles
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const days = calculateDays(booking.startDate, booking.endDate);

              return (
                <Card
                  key={booking._id}
                  className="bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <CardBody className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${statusConfig.bgClass} flex items-center justify-center`}>
                          <span className={`text-2xl ${statusConfig.iconColor}`}>
                            {statusConfig.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Booking #{booking._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {days} {days === 1 ? 'day' : 'days'} rental
                          </p>
                        </div>
                      </div>
                      <Chip
                        color={statusConfig.color}
                        size="lg"
                        variant="flat"
                        classNames={{
                          content: "font-semibold px-3"
                        }}
                      >
                        {statusConfig.label}
                      </Chip>
                    </div>

                    <Divider className="mb-4" />

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Start Date */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase">Start Date</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(booking.startDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* End Date */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase">End Date</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(booking.endDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Vehicle Info */}
                      <div className="bg-gradient-to-r from-blue-600 to-gray-900 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-4 h-4" />
                          <span className="text-xs font-medium uppercase">Vehicle ID</span>
                        </div>
                        <p className="text-lg font-bold">
                          {typeof booking.vehicle === 'string' 
                            ? booking.vehicle.slice(-8).toUpperCase()
                            : 'N/A'}
                        </p>
                        <p className="text-sm text-blue-200">
                          {days} {days === 1 ? 'day' : 'days'} rental
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Booked on {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleCancelBooking(booking._id)}
                          className="font-medium"
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
