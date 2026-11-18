
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/src/lib/services";

// MUI: Only for dropdown, text fields, and calendar
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import type { Dayjs } from "dayjs";

type BookingFormProps = {
    services: Service[];
    initialServiceId?: string;
};

const TIME_SLOTS = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
];

export default function BookingForm({
    services,
    initialServiceId = "",
}: BookingFormProps) {
    const router = useRouter();

    // Service
    const [serviceId, setServiceId] = useState(initialServiceId);

    // Vehicle information
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");

    // Appointment date and time
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState("");

    // Form status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedService = services.find(
        (service) => service._id === serviceId
    );

    // Submit booking
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!serviceId || !selectedDate || !selectedTime) {
            setError(
                "Please select a service, appointment date, and time."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    service: serviceId,
                    registrationNumber,
                    brand,
                    model,
                    appointmentDate: selectedDate.format("YYYY-MM-DD"),
                    startTime: selectedTime,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to create appointment."
                );
            }

            setSuccess("Your appointment has been booked successfully!");

            // Clear form after successful booking
            setServiceId("");
            setRegistrationNumber("");
            setBrand("");
            setModel("");
            setSelectedDate(null);
            setSelectedTime("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl mx-auto"
        >
            {/* Service Selection */}
            <div className="mb-6">
                <TextField
                    select
                    fullWidth
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    label="Select a Service"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            color: "#2D4085",
                            fontWeight: 600,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#2D4085",
                        },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select a Service
                    </MenuItem>

                    {services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                            {service.name}
                        </MenuItem>
                    ))}
                </TextField>

                {selectedService && (
                    <p className="text-sm text-gray-600 mt-2">
                        {selectedService.description}
                    </p>
                )}
            </div>

            {/* Service Information */}
            <div className="grid grid-cols-2 gap-6 py-5">
                <div className="border-r border-gray-300">
                    <p className="text-sm text-gray-500">
                        Estimated Duration
                    </p>

                    <p className="text-xl font-bold text-[#2D4085] mt-1">
                        {selectedService
                            ? `${selectedService.estimatedDuration} min`
                            : "--"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Service Fee</p>

                    <p className="text-xl font-bold text-[#2D4085] mt-1">
                        {selectedService
                            ? `THB ${selectedService.serviceFee.toLocaleString()}`
                            : "--"}
                    </p>
                </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <TextField
                    label="Registration Number"
                    placeholder="e.g. AB-1234"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Brand"
                    placeholder="e.g. Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Model"
                    placeholder="e.g. Yaris"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    fullWidth
                />
            </div>

            <hr className="my-7 border-gray-300" />

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Calendar - MUI */}
                <div>
                    

                    <div className="flex justify-center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={(newDate) => {
                                    setSelectedDate(newDate);
                                    setSelectedTime("");
                                }}
                                disablePast
                                sx={{
                                    width: "100%",
                                    maxWidth: 420,
                                    "& .MuiPickersCalendarHeader-root": {
                                        paddingLeft: "24px",
                                        paddingRight: "24px",
                                    },
                                    "& .MuiDayCalendar-root": {
                                        width: "100%",
                                    },
                                    "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
                                        justifyContent: "space-around",
                                    },
                                    "& .MuiPickersCalendarHeader-label": {
                                        color: "#2D4085",
                                        fontWeight: 600,
                                    },
                                    "& .MuiPickersDay-root": {
                                        color: "#2D4085",
                                        width: 42,
                                        height: 42,
                                        fontSize: "0.95rem",
                                    },
                                    "& .MuiPickersDay-root.Mui-selected": {
                                        backgroundColor: "#4568E8",
                                        color: "#FFFFFF",
                                    },
                                    "& .MuiPickersDay-root.Mui-selected:hover": {
                                        backgroundColor: "#2D4085",
                                    },
                                    "& .MuiPickersDay-root:hover": {
                                        backgroundColor: "#E8EEFF",
                                    },
                                    "& .MuiPickersArrowSwitcher-button": {
                                        color: "#2D4085",
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>

                {/* Available Time */}
                <div>
                    <h2 className="text-xl text-[#2D4085] font-medium mt-3 mb-5">
                        Available Time
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        {TIME_SLOTS.map((time) => (
                            <button
                                key={time}
                                type="button"
                                disabled={!selectedDate}
                                onClick={() => setSelectedTime(time)}
                                className={`
                  h-12 rounded-lg border text-sm transition-colors
                  ${selectedTime === time
                                        ? "bg-[#2D4085] text-white border-[#2D4085]"
                                        : "border-gray-300 text-[#2D4085] hover:bg-blue-50"
                                    }
                  disabled:opacity-40 disabled:cursor-not-allowed
                `}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    {!selectedDate && (
                        <p className="text-xs text-gray-400 text-center mt-4">
                            Please select an appointment date first.
                        </p>
                    )}

                    {selectedDate && (
                        <p className="text-sm text-gray-500 text-center mt-4">
                            Selected date: {selectedDate.format("DD MMM YYYY")}
                        </p>
                    )}
                </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="mt-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-6 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                    {success}
                </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-10">
                <button
                    type="button"
                    onClick={() => router.push("/services")}
                    className="cursor-pointer w-40 h-12 rounded-lg border border-[#2D4085] text-[#2D4085] hover:bg-blue-50 transition-colors"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading || services.length === 0}
                    className="cursor-pointer w-40 h-12 rounded-lg bg-[#2D4085] text-white hover:bg-[#1E326E] disabled:opacity-50 transition-colors"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
}
