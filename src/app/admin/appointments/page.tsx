
import { Suspense } from "react";
import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getAppointments } from "@/src/lib/appointments";
import { getServices } from "@/src/lib/services";
import AppointmentCard from "@/src/components/cards/AppointmentCard";

async function AdminAppointmentsContent() {
  await connection();

  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const [appointments, services] = await Promise.all([
    getAppointments(session.user.accessToken),
    getServices(),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#2D4085]">
          Administration
        </p>

        <h1 className="text-3xl font-bold text-[#2D4085]">
          All Appointments
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage appointments from all customers.
        </p>
      </div>

      <div className="mb-6 text-sm text-gray-500">
        {appointments.length} appointment
        {appointments.length !== 1 ? "s" : ""}
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Appointments Found
          </h2>

          <p className="mt-2 text-gray-500">
            There are currently no appointments to manage.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              services={services}
              isAdmin
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminAppointmentsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        }
      >
        <AdminAppointmentsContent />
      </Suspense>
    </main>
  );
}
