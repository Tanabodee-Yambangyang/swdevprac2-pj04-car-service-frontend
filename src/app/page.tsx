"use client";

import Banner from "@/src/components/Banner";
import ServiceCard from "@/src/components/Cards/ServiceCard";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full flex-col bg-white">
        <Banner />
        <div className="h-fullflex flex-col items-center justify-center p-12 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Services</h2>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <ServiceCard
              title="General Service"
              description="Maintenance & Check-up"
              buttonText="View Details"
              onClick={() => {
                alert("Tire Replacement service selected!");
              }}
            />
            <ServiceCard
              title="Engine Repair"
              description="Engine diagnostics and repair"
              buttonText="View Details"
              onClick={() => {
                alert("Tire Replacement service selected!");
              }}
            />
            <ServiceCard
              title="Tire Replacement"
              description="New tires and wheel alignment"
              buttonText="View Details"
              onClick={() => {
                alert("Tire Replacement service selected!");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
