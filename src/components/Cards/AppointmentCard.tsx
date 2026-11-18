
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Appointment } from "@/src/lib/appointments";
import type { Service } from "@/src/lib/services";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs, { type Dayjs } from "dayjs";

import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import HandymanIcon from "@mui/icons-material/Handyman";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type AppointmentCardProps = {
    appointment: Appointment;
    services: Service[];
    isAdmin?: boolean;
};

const TIME_SLOTS = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
];

function formatAppointmentDate(dateString: string) {
    const [year, month, day] = dateString
        .slice(0, 10)
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatAppointmentTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function AppointmentCard({
    appointment,
    services,
    isAdmin
}: AppointmentCardProps) {
    const router = useRouter();

    // Dialog states
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Form states
    const [serviceId, setServiceId] = useState(appointment.service._id);
    const [registrationNumber, setRegistrationNumber] = useState(
        appointment.registrationNumber
    );
    const [brand, setBrand] = useState(appointment.brand);
    const [model, setModel] = useState(appointment.model);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
        dayjs(appointment.appointmentDate.slice(0, 10))
    );
    const [selectedTime, setSelectedTime] = useState(
        appointment.startTime
    );

    // Request states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const selectedService = services.find(
        (service) => service._id === serviceId
    );

    const isOilService = appointment.service.name
        .toLowerCase()
        .includes("oil");

    // Open edit dialog with current appointment values
    const handleOpenEdit = () => {
        setServiceId(appointment.service._id);
        setRegistrationNumber(appointment.registrationNumber);
        setBrand(appointment.brand);
        setModel(appointment.model);
        setSelectedDate(
            dayjs(appointment.appointmentDate.slice(0, 10))
        );
        setSelectedTime(appointment.startTime);
        setError("");
        setEditOpen(true);
    };

    // Update appointment
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (
            !serviceId ||
            !registrationNumber.trim() ||
            !brand.trim() ||
            !model.trim() ||
            !selectedDate ||
            !selectedTime
        ) {
            setError("Please complete all appointment fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/appointments/${encodeURIComponent(appointment._id)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        service: serviceId,
                        registrationNumber: registrationNumber.trim(),
                        brand: brand.trim(),
                        model: model.trim(),
                        appointmentDate: selectedDate.format("YYYY-MM-DD"),
                        startTime: selectedTime,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update appointment."
                );
            }

            setEditOpen(false);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update appointment."
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete appointment
    const handleDelete = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `/api/appointments/${encodeURIComponent(appointment._id)}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to delete appointment."
                );
            }

            setDeleteOpen(false);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete appointment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Appointment Card */}
            <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 px-5 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                    {/* Service Information */}
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="shrink-0 text-[#2D4085]">
                            {isOilService ? (
                                <OilBarrelIcon sx={{ fontSize: 52 }} />
                            ) : (
                                <HandymanIcon sx={{ fontSize: 52 }} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-[#2D4085]">
                                {appointment.service.name}
                            </h2>

                            <p className="text-xs text-gray-700 truncate">
                                {appointment.service.description}
                            </p>

                            <button
                                type="button"
                                onClick={() => setDetailsOpen(true)}
                                className="cursor-pointer items-center gap-2 mt-3 text-sm text-[#2D4085] hover:underline"
                            >
                                Details
                                <ArrowForwardIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-300 pt-4 lg:pt-0 lg:pl-5">
                        <div className="flex items-center gap-2 text-[#2D4085] font-semibold text-sm">
                            <DirectionsCarIcon sx={{ fontSize: 21 }} />
                            <span>
                                {appointment.registrationNumber} ・ {appointment.brand}{" "}
                                {appointment.model}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-[#2D4085] font-semibold text-sm">
                            <AccessTimeIcon sx={{ fontSize: 21 }} />
                            <span>
                                {appointment.durationMinutes ||
                                    appointment.service.estimatedDuration} min
                            </span>
                        </div>
                    </div>


                    {/* Customer Information - Admin Only */}
                    {isAdmin && (
                        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-300 pt-4 lg:pt-0 lg:pl-5">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Customer Information
                            </p>

                            <p className="text-sm font-semibold text-[#2D4085]">
                                {appointment.user.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-600 break-all">
                                {appointment.user.email}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                {appointment.user.tel}
                            </p>
                        </div>
                    )}


                    {/* Appointment Date and Time */}
                    <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-300 pt-4 lg:pt-0 lg:pl-5">
                        <div className="flex items-center gap-2 text-[#2D4085] font-semibold text-sm">
                            <CalendarMonthIcon sx={{ fontSize: 21 }} />
                            <span>
                                {formatAppointmentDate(appointment.appointmentDate)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-[#2D4085] font-semibold text-sm">
                            <AccessTimeIcon sx={{ fontSize: 21 }} />
                            <span>{formatAppointmentTime(appointment.startTime)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:ml-2">
                        <button
                            type="button"
                            onClick={handleOpenEdit}
                            className="cursor-pointer flex items-center gap-1 px-3 py-2 border border-[#2D4085] rounded-md text-sm text-[#2D4085] hover:bg-blue-50 transition-colors"
                        >
                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setError("");
                                setDeleteOpen(true);
                            }}
                            className="cursor-pointer flex items-center gap-1 px-3 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Service Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: { sx: { borderRadius: "8px" } },
                }}
            >
                <DialogTitle sx={{ color: "#2D4085", fontWeight: 700, fontSize: 24 }}>
                    Appointment Details
                </DialogTitle>

                <Divider sx={{ mx: 3 }} />

                <DialogContent sx={{ py: 3 }}>
                    <h2 className="text-xl font-bold text-[#2D4085]">
                        {appointment.service.name}
                    </h2>

                    <p className="mt-2 text-gray-700">
                        {appointment.service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-5">
                        <div>
                            <p className="text-sm text-gray-500">Vehicle</p>
                            <p className="font-semibold text-[#2D4085]">
                                {appointment.brand} {appointment.model}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Registration Number</p>
                            <p className="font-semibold text-[#2D4085]">
                                {appointment.registrationNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Appointment Date</p>
                            <p className="font-semibold text-[#2D4085]">
                                {formatAppointmentDate(appointment.appointmentDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Appointment Time</p>
                            <p className="font-semibold text-[#2D4085]">
                                {formatAppointmentTime(appointment.startTime)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold text-[#2D4085]">
                                {appointment.durationMinutes ||
                                    appointment.service.estimatedDuration} min
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Service Fee</p>
                            <p className="font-semibold text-[#2D4085]">
                                THB {appointment.service.serviceFee.toLocaleString("en-US")}
                            </p>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setDetailsOpen(false)}
                        variant="outlined"
                        sx={{
                            color: "#2D4085",
                            borderColor: "#2D4085",
                            textTransform: "none",
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Appointment Dialog */}
            <Dialog
                open={editOpen}
                onClose={() => !loading && setEditOpen(false)}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "10px",
                            m: 2,
                        },
                    },
                }}
            >
                <form onSubmit={handleUpdate}>
                    <DialogTitle
                        sx={{
                            px: { xs: 3, sm: 4 },
                            pt: 3,
                            color: "#2D4085",
                            fontSize: 24,
                            fontWeight: 700,
                        }}
                    >
                        Edit Appointment
                    </DialogTitle>

                    <DialogContent sx={{ px: { xs: 3, sm: 4 }, py: 3 }}>
                        <p className="text-sm text-gray-500 mb-5">
                            Update your service, vehicle information, and appointment schedule.
                        </p>

                        {/* Service */}
                        <div className="mb-5">
                            <TextField
                                select
                                fullWidth
                                label="Select a Service"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                required
                            >
                                {services.map((service) => (
                                    <MenuItem
                                        key={service._id}
                                        value={service._id}
                                        disabled={!service.isActive}
                                    >
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {selectedService && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {selectedService.description}
                                </p>
                            )}
                        </div>

                        {/* Vehicle Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <TextField
                                fullWidth
                                label="Registration Number"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            />
                        </div>

                        {/* Service Information */}
                        <div className="grid grid-cols-2 gap-5 my-6 py-4 border-y border-gray-200">
                            <div>
                                <p className="text-sm text-gray-500">Estimated Duration</p>
                                <p className="font-bold text-[#2D4085]">
                                    {selectedService
                                        ? `${selectedService.estimatedDuration} min`
                                        : "--"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Service Fee</p>
                                <p className="font-bold text-[#2D4085]">
                                    {selectedService
                                        ? `THB ${selectedService.serviceFee.toLocaleString("en-US")}`
                                        : "--"}
                                </p>
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-[#2D4085] mb-3">
                                    Appointment Date
                                </h3>

                                <div className="flex justify-center">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar
                                            value={selectedDate}
                                            onChange={(newDate: Dayjs | null) => {
                                                setSelectedDate(newDate);
                                                setSelectedTime("");
                                            }}
                                            disablePast
                                            sx={{
                                                width: "100%",
                                                maxWidth: 380,
                                                "& .MuiPickersCalendarHeader-label": {
                                                    color: "#2D4085",
                                                    fontWeight: 600,
                                                },
                                                "& .MuiPickersDay-root.Mui-selected": {
                                                    backgroundColor: "#4568E8",
                                                },
                                                "& .MuiPickersDay-root.Mui-selected:hover": {
                                                    backgroundColor: "#2D4085",
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[#2D4085] mb-3">
                                    Appointment Time
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {TIME_SLOTS.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            disabled={!selectedDate}
                                            onClick={() => setSelectedTime(time)}
                                            className={`cursor-pointer h-11 rounded-lg border text-sm transition-colors ${selectedTime === time
                                                ? "bg-[#2D4085] text-white border-[#2D4085]"
                                                : "border-gray-300 text-[#2D4085] hover:bg-blue-50"
                                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                                        >
                                            {formatAppointmentTime(time)}
                                        </button>
                                    ))}
                                </div>

                                {selectedDate && (
                                    <p className="text-sm text-gray-500 mt-4">
                                        Selected: {selectedDate.format("DD MMM YYYY")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: { xs: 3, sm: 4 },
                            pb: 3,
                            gap: 1.5,
                        }}
                    >
                        <Button
                            onClick={() => setEditOpen(false)}
                            disabled={loading}
                            variant="outlined"
                            sx={{
                                color: "#2D4085",
                                borderColor: "#2D4085",
                                textTransform: "none",
                                minWidth: 110,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: "#2D4085",
                                textTransform: "none",
                                minWidth: 140,
                                "&:hover": { backgroundColor: "#1E326E" },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteOpen}
                onClose={() => !loading && setDeleteOpen(false)}
                fullWidth
                maxWidth="xs"
                slotProps={{
                    paper: { sx: { borderRadius: "10px", p: 1 } },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#DC2626",
                        fontSize: 22,
                        fontWeight: 700,
                    }}
                >
                    Delete Appointment?
                </DialogTitle>

                <DialogContent>
                    <p className="text-gray-600">
                        Are you sure you want to delete your appointment for{" "}
                        <span className="font-semibold text-[#2D4085]">
                            {appointment.service.name}
                        </span>
                        ?
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                        This action cannot be undone.
                    </p>

                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        disabled={loading}
                        variant="outlined"
                        sx={{
                            color: "#2D4085",
                            borderColor: "#2D4085",
                            textTransform: "none",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        variant="contained"
                        sx={{
                            backgroundColor: "#DC2626",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#B91C1C" },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            "Delete Appointment"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
