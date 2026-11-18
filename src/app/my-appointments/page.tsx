
import { Suspense } from "react";
import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getAppointments } from "@/src/lib/appointments";
import AppointmentCard from "@/src/components/cards/AppointmentCard";

async function AppointmentsContent() {
  await connection();

  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    redirect("/login");
  }

  const appointments = await getAppointments(session.user.accessToken);

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-12">      

      {appointments.length > 0 ? (
        <div className="flex flex-col gap-5">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-xl font-semibold text-[#2D4085]">
            No Appointments Found
          </p>

          <p className="text-gray-500 mt-2">
            You haven't booked any appointments yet.
          </p>

          <a
            href="/services"
            className="mt-5 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2D4085] text-white font-semibold hover:bg-[#1E326E] transition-colors"
          >
            Explore Services
          </a>
        </div>
      )}
    </section>
  );
}

export default function MyAppointmentsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-8">
        <h1 className="text-3xl font-bold text-[#2D4085]">
          My Appointments
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your vehicle service appointments.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
            Loading appointments...
          </div>
        }
      >
        <AppointmentsContent />
      </Suspense>
    </main>
  );
}
