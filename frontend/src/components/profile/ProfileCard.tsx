"use client";

import { Card, CardBody } from "@nextui-org/react";

export default function ProfileCard() {
  return (
    <Card className="bg-white shadow-xl">
      <CardBody className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
        <p className="text-gray-600">Profile information will appear here.</p>
      </CardBody>
    </Card>
  );
}
