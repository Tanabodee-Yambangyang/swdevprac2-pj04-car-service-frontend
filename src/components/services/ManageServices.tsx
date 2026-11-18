
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/src/lib/services";


type ManageServicesProps = {
    initialServices: Service[];
};

type ServiceForm = {
    name: string;
    description: string;
    estimatedDuration: string;
    serviceFee: string;
};

const emptyForm: ServiceForm = {
    name: "",
    description: "",
    estimatedDuration: "",
    serviceFee: "",
};

export default function ManageServices({
    initialServices,
}: ManageServicesProps) {
    const router = useRouter();

    const [services, setServices] = useState(initialServices);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deletingService, setDeletingService] = useState<Service | null>(null);
    const [form, setForm] = useState<ServiceForm>(emptyForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function openAddDialog() {
        setEditingService(null);
        setForm(emptyForm);
        setError("");
        setIsFormOpen(true);
    }

    function openEditDialog(service: Service) {
        setEditingService(service);
        setForm({
            name: service.name,
            description: service.description,
            estimatedDuration: String(service.estimatedDuration),
            serviceFee: String(service.serviceFee),
        });
        setError("");
        setIsFormOpen(true);
    }

    function closeFormDialog() {
        if (loading) return;

        setIsFormOpen(false);
        setEditingService(null);
        setForm(emptyForm);
        setError("");
    }

    function updateField(field: keyof ServiceForm, value: string) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const estimatedDuration = Number(form.estimatedDuration);
        const serviceFee = Number(form.serviceFee);

        if (
            !form.name.trim() ||
            !form.description.trim() ||
            !Number.isFinite(estimatedDuration) ||
            !Number.isFinite(serviceFee) ||
            estimatedDuration <= 0 ||
            serviceFee < 0
        ) {
            setError("Please enter valid service information.");
            return;
        }

        const body = {
            name: form.name.trim(),
            description: form.description.trim(),
            estimatedDuration,
            serviceFee,
        };

        setLoading(true);

        try {
            const isEditing = Boolean(editingService);

            const response = await fetch(
                isEditing
                    ? `/api/services/${editingService!._id}`
                    : "/api/services",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to save service.");
            }

            const savedService: Service = result.data;

            setServices((previous) => {
                if (isEditing) {
                    return previous.map((service) =>
                        service._id === savedService._id ? savedService : service
                    );
                }

                return [...previous, savedService];
            });

            setIsFormOpen(false);
            setEditingService(null);
            setForm(emptyForm);
            setError("");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!deletingService) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/services/${deletingService._id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to delete service.");
            }

            setServices((previous) =>
                previous.filter((service) => service._id !== deletingService._id)
            );

            setDeletingService(null);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            {/* Page heading */}
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">
                        Administration
                    </p>

                    <h1 className="text-3xl font-bold text-[#1E1612]">
                        Manage Services
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Add, update, and manage your service packages.
                    </p>
                </div>

                <button
                    onClick={openAddDialog}
                    className="cursor-pointer rounded-lg bg-[#1E1612] px-6 py-3 font-semibold text-white transition hover:bg-[#3B2B22]"
                >
                    + Add Service
                </button>
            </div>

            {/* Service count */}
            <div className="mb-6 text-sm text-gray-500">
                {services.length} service package{services.length !== 1 ? "s" : ""}
            </div>

            {/* Service cards */}
            {services.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
                    <h2 className="text-xl font-semibold text-[#1E1612]">
                        No Services Available
                    </h2>
                    <p className="mt-2 text-gray-500">
                        Add your first service package to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service._id}
                            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <h2 className="text-xl font-bold text-[#1E1612]">
                                    {service.name}
                                </h2>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${service.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {service.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="mb-6 flex-1 text-sm leading-6 text-gray-600">
                                {service.description}
                            </p>

                            <div className="mb-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium text-[#1E1612]">
                                        {service.estimatedDuration} minutes
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service Fee</span>
                                    <span className="font-semibold text-[#1E1612]">
                                        ฿{service.serviceFee.toLocaleString("en-US")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => openEditDialog(service)}
                                    className="cursor-pointer flex-1 rounded-lg border border-[#1E1612] px-4 py-2.5 text-sm font-semibold text-[#1E1612] transition hover:bg-[#1E1612] hover:text-white"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setDeletingService(service);
                                        setError("");
                                    }}
                                    className="cursor-pointer flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Add / Edit dialog */}
            {isFormOpen && (
                <div className="text-black fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#1E1612]">
                                {editingService ? "Edit Service" : "Add Service"}
                            </h2>

                            <button
                                onClick={closeFormDialog}
                                disabled={loading}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                                aria-label="Close dialog"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Service Name
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(event) =>
                                        updateField("name", event.target.value)
                                    }
                                    placeholder="e.g. Oil change"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1E1612]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField("description", event.target.value)
                                    }
                                    placeholder="Describe the service package"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1E1612]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Estimated Duration (minutes)
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={form.estimatedDuration}
                                    onChange={(event) =>
                                        updateField("estimatedDuration", event.target.value)
                                    }
                                    placeholder="60"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1E1612]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Service Fee (฿)
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.serviceFee}
                                    onChange={(event) =>
                                        updateField("serviceFee", event.target.value)
                                    }
                                    placeholder="500"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1E1612]"
                                />
                            </div>

                            {error && (
                                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeFormDialog}
                                    disabled={loading}
                                    className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer rounded-lg bg-[#1E1612] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B2B22] disabled:opacity-50"
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingService
                                            ? "Save Changes"
                                            : "Create Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation dialog */}
            {deletingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-[#1E1612]">
                            Delete Service?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-[#1E1612]">
                                {deletingService.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        {error && (
                            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    if (!loading) {
                                        setDeletingService(null);
                                        setError("");
                                    }
                                }}
                                disabled={loading}
                                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
