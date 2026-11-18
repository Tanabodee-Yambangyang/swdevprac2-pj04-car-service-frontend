
import { Suspense } from "react";
import { connection } from "next/server";
import { getServices } from "@/src/lib/services";
import BookingForm from "@/src/components/booking/BookingForm";

type BookingPageProps = {
    searchParams: Promise<{
        service?: string;
    }>;
};

async function BookingContent({
    searchParams,
}: BookingPageProps) {
    await connection();

    const [services, params] = await Promise.all([
        getServices(),
        searchParams,
    ]);

    return (
        <BookingForm
            services={services}
            initialServiceId={params.service}
        />
    );
}

export default function BookingPage({
    searchParams,
}: BookingPageProps) {
    return (
        <main className="bg-white px-10 py-10">
            <div className="max-w-5xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-[#2D4085]">
                    Book an Appointment
                </h1>

                <p className="text-gray-500 mt-2">
                    Select a service, enter your vehicle details, and choose your
                    preferred appointment date and time.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                        Loading booking form...
                    </div>
                }
            >
                <BookingContent searchParams={searchParams} />
            </Suspense>
        </main>
    );
}
