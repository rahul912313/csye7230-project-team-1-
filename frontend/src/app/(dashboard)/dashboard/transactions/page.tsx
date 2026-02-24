"use client";

import TransactionHistory  from "@/components/transactions/TransactionHistory";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <TransactionHistory />
      </div>
    </div>
  );
}
