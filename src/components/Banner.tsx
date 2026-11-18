
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import BookNowBtn from "@/src/components/buttons/BookNowBtn";

export default function Banner() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const isLoggedIn = status === "authenticated";

    return (
        <section className="relative w-full py-6">
            {/* Background Image */}
            <Image
                src="/banner-img.jpg"
                alt="Professional car service"
                fill
                priority
                className="object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Banner Content */}
            <div className="relative z-10 flex h-full flex-col items-start justify-start text-center px-12">
                <div className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wide">
                        AutoEase
                    </h1>

                    <p className="mt-5 text-xl md:text-3xl text-white font-medium">
                        Car Service Appointment
                    </p>
                </div>

                {isLoggedIn ? (
                    <div className="w-full flex items-center justify-between gap-6">
                        <BookNowBtn
                            variant="secondary"
                            onClick={() => router.push("/booking")}
                        />

                        <h1 className="text-white text-xl font-semibold">
                            Welcome back, {session?.user?.name || "User"}!
                        </h1>
                    </div>
                ) : (
                    <BookNowBtn
                        variant="secondary"
                        onClick={() => router.push("/booking")}
                    />
                )}
            </div>
        </section>
    );
}
