"use client";

import Banner from "@/src/components/Banner";
import ServiceCard, { Service } from "@/src/components/Cards/ServiceCard";

const mockServices: Service[] = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Oil change",
    description: "Engine oil and filter replacement",
    estimatedDuration: 60,
    serviceFee: 500,
    isActive: true,
    createdAt: "2026-11-18T11:49:02.300Z",
    updatedAt: "2026-11-18T11:49:02.300Z",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Engine Repair",
    description: "Engine inspection and repair",
    estimatedDuration: 120,
    serviceFee: 2500,
    isActive: true,
    createdAt: "2026-11-18T11:49:02.300Z",
    updatedAt: "2026-11-18T11:49:02.300Z",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full flex-col bg-white">
        <Banner />
        <div className="h-fullflex flex-col items-center justify-center p-12 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          <div className="grid grid-cols-3 gap-6 mt-6">
            {mockServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
