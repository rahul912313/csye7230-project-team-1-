"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { bookingService } from "@/services/booking.service";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export function BookingModal({ isOpen, onClose, vehicle }: BookingModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      await bookingService.createBooking({ vehicleId: vehicle._id, startDate, endDate });
      alert("Booking successful!");
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Book {vehicle.model}</ModalHeader>
        <ModalBody>
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button color="primary" onPress={handleBooking} isLoading={loading}>Confirm Booking</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
