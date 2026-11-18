
import { Suspense } from "react";
import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getAllServices } from "@/src/lib/services";
import ManageServices from "@/src/components/services/ManageServices";

async function ManageServicesContent() {
    await connection();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    const services = await getAllServices();

    return <ManageServices initialServices={services} />;
}

export default function ManageServicesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Suspense
                fallback={
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <p className="text-gray-500">Loading services...</p>
                    </div>
                }
            >
                <ManageServicesContent />
            </Suspense>
        </main>
    );
}
