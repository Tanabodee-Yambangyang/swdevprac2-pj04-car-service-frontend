
import Image from "next/image";
import BookNowBtn from "@/src/components/buttons/BookNowBtn";

export default function Banner() {
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
            <div className="absolute inset-0 bg-black/50" />

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

                <BookNowBtn variant="secondary"/>
            </div>
        </section>
    );
}
