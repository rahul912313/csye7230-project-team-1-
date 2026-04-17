import api from "@/lib/axios";

export const bookingService = {
  getUserBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  cancelBooking: async (bookingId: string) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
  createBooking: async (data: { vehicleId: string; startDate: string; endDate: string }) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },
};
