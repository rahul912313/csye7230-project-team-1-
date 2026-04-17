"use client";
export function WhyChooseUs() {
  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow">
      <h2 className="text-2xl font-bold mb-4">Why Choose QUICKRENT?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center"><p className="text-4xl mb-2">🚗</p><p className="font-semibold">Wide Selection</p></div>
        <div className="text-center"><p className="text-4xl mb-2">💰</p><p className="font-semibold">Best Prices</p></div>
        <div className="text-center"><p className="text-4xl mb-2">⭐</p><p className="font-semibold">Top Rated</p></div>
      </div>
    </div>
  );
}
