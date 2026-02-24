"use client";

import { WelcomeSection } from "@/components/dashboard/Welcome";
import { VehicleTypes } from "@/components/dashboard/VehicleTypes";
import { WhyChooseUs } from "@/components/dashboard/WhyChooseUs";
import { TeamSection } from "@/components/dashboard/TeamSection";
import { ChatbotButton } from "@/components/dashboard/Chatbot";
import Footer from "@/components/layout/Footer";
import api from "@/lib/axios";
import { useState, useEffect } from "react";
// import { QuickBook } from "@/components/dashboard/QuickBook";
// import { Card } from "@nextui-org/react";

export default function DashboardPage() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get("/user");
        setName(response.data.data.name);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserName();
  }, []);
  return (
    <div className="min-h-screen">
      <WelcomeSection userName={name} />
      {/* <QuickBook /> */}
      <VehicleTypes />
      <WhyChooseUs />
      <TeamSection />
      <ChatbotButton />
      <Footer />
    </div>
  );
}
