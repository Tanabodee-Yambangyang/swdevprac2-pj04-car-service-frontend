
import { Suspense } from "react";

import ServiceDetailsCard from "@/src/components/cards/ServiceDetailsCard";
import { getServices } from "@/src/lib/services";

async function ServicesList() {
    const services = await getServices();

    return (
        <div className="flex flex-col gap-5 mt-12">
            {services.length === 0 ? (
                <p className="text-center text-gray-500">
                    No services available.
                </p>
            ) : (
                services.map((service) => (
                    <ServiceDetailsCard
                        key={service._id}
                        service={service}
                    />
                ))
            )}
        </div>
    );
}

export default function ServicesPage() {
    return (
        <main className="min-h-screen w-full bg-white">
            <div className="mx-auto p-12">

                {/* Page Title */}
                <h1 className="text-2xl sm:text-[28px] font-normal text-[#2D4085]">
                    Services
                </h1>

                <p className="text-gray-500 mt-2">
                    See all available services.
                </p>

                {/* Service Cards */}
                <Suspense
                    fallback={
                        <p className="mt-12 text-center text-gray-500">
                            Loading services...
                        </p>
                    }
                >
                    <ServicesList />
                </Suspense>

            </div>
        </main>
    );
}
