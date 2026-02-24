import api from "@/lib/axios";

export const vehicleService = {
  getAllVehicles: async () => {
    const response = await api.get("/vehicles");
    return response.data;
  },
  getVehicleById: async (id: string) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  getVehicleDetails: async (id: string) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  getAvailableVehicles: async (startDate: string, endDate: string) => {
    const response = await api.get("/vehicles/available", { params: { startDate, endDate } });
    return response.data;
  },
  searchVehicles: async (params: any) => {
    const response = await api.get("/vehicles/search", { params });
    return response.data;
  },
};
