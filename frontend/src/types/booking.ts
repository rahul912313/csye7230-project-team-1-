export interface Booking {
  _id: string;
  vehicle: string | { _id: string; make: string; model: string };
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  totalPrice?: number;
  createdAt?: string;
}
