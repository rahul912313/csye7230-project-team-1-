"use client";

import { Card, CardBody } from "@nextui-org/react";

export default function TransactionHistory() {
  return (
    <Card className="bg-white shadow-xl">
      <CardBody className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction History</h2>
        <p className="text-gray-600">Your transactions will appear here.</p>
      </CardBody>
    </Card>
  );
}
