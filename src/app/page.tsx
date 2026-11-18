
import { Suspense } from "react";

import Banner from "@/src/components/Banner";
import ServiceCard from "@/src/components/cards/ServiceCard";
import { getServices } from "@/src/lib/services";

async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="flex flex-col items-center justify-center p-12 bg-white">
      <h2 className="text-3xl font-bold text-gray-800">
        Our Services
      </h2>

      {services.length === 0 ? (
        <p className="mt-6 text-gray-500">
          No services available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {services.length === 0 ? (
            <p className="text-center text-gray-500">
              No services available.
            </p>
          ) : (
            services.slice(0, 3).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))
          )}

        </div>
      )}
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full flex-col bg-white">
        <Banner />

        <Suspense
          fallback={
            <section className="p-12 text-center">
              Loading services...
            </section>
          }
        >
          <ServicesSection />
        </Suspense>
      </main>
    </div>
  );
}
