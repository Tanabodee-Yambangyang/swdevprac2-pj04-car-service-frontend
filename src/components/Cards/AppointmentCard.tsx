
"use client";

import { useState } from "react";
import type { Appointment } from "@/src/lib/appointments";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

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
};

function formatAppointmentDate(dateString: string) {
  // Use the date portion to avoid an unintended timezone date shift.
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);

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
}: AppointmentCardProps) {
  const [open, setOpen] = useState(false);

  const isOilService =
    appointment.service.name.toLowerCase().includes("oil");

  return (
    <>
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

              <p className="text-xs text-gray-700 truncate ">
                {appointment.service.description}
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="cursor-pointer flex items-center gap-2 mt-3 text-sm text-[#2D4085] hover:underline"
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
                  appointment.service.estimatedDuration}{" "}
                min
              </span>
            </div>
          </div>

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
              disabled
              title="Appointment editing is not connected yet."
              className="flex items-center gap-1 px-3 py-2 border border-[#2D4085] rounded-md text-sm text-[#2D4085] opacity-50 cursor-not-allowed"
            >
              <EditOutlinedIcon sx={{ fontSize: 17 }} />
              Edit
            </button>

            <button
              type="button"
              disabled
              title="Appointment deletion is not connected yet."
              className="flex items-center gap-1 px-3 py-2 border border-red-500 rounded-md text-sm text-red-500 opacity-50 cursor-not-allowed"
            >
              <DeleteOutlineIcon sx={{ fontSize: 17 }} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Service Details Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              px: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#2D4085",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
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
              <p className="text-sm text-gray-500">
                Registration Number
              </p>
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
                  appointment.service.estimatedDuration}{" "}
                min
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
            onClick={() => setOpen(false)}
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
    </>
  );
}
