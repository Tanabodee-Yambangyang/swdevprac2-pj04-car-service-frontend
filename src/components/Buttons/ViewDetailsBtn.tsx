
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaidIcon from "@mui/icons-material/Paid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import BookNowBtn from "@/src/components/buttons/BookNowBtn";


type Service = {
    _id: string;
    name: string;
    description: string;
    estimatedDuration: number;
    serviceFee: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

type ButtonProps = {
    children?: React.ReactNode;
    className?: string;
    service: Service;
};

export default function ViewDetailsBtn({
    children = "View Details",
    className = "",
    service,
}: ButtonProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();

    return (
        <>
            {/* View Details Trigger */}
            <button
                onClick={handleClickOpen}
                className={`cursor-pointer flex items-center justify-center px-10 py-4 text-sm font-bold rounded-full text-[#2D4085] bg-[#DBEAFE] transition-all duration-200 hover:opacity-90 ${className}`}
            >
                {children}
            </button>

            {/* Service Details Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "8px",
                            maxWidth: "665px",
                            width: "100%",
                            m: 2,
                        },
                    },
                }}
            >
                {/* Dialog Title */}
                <DialogTitle
                    sx={{
                        px: { xs: 3, sm: 8 },
                        pt: 4,
                        pb: 2,
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#2D4085",
                    }}
                >
                    Service Details
                </DialogTitle>

                <Divider
                    sx={{
                        mx: { xs: 2, sm: 5 },
                        borderColor: "#D1D1D1",
                    }}
                />

                <DialogContent
                    sx={{
                        px: { xs: 3, sm: 8 },
                        py: 2.5,
                    }}
                >
                    {/* Service Information */}
                    <h2 className="text-2xl font-bold text-[#2D4085]">
                        {service.name}
                    </h2>

                    <p className="mt-2 text-base sm:text-lg text-black">
                        {service.description}
                    </p>

                    {/* Duration and Service Fee */}
                    <div className="flex items-center mt-5 mb-2">

                        {/* Estimated Duration */}
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            <AccessTimeIcon
                                sx={{ fontSize: 26, color: "#2D4085" }}
                            />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Estimated Duration
                                </p>

                                <p className="text-xl font-bold text-[#2D4085]">
                                    {service.estimatedDuration} min
                                </p>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                mx: { xs: 2, sm: 3 },
                                borderColor: "#C9C9C9",
                            }}
                        />

                        {/* Service Fee */}
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            <PaidIcon
                                sx={{ fontSize: 26, color: "#2D4085" }}
                            />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Service Fee
                                </p>

                                <p className="text-xl font-bold text-[#2D4085]">
                                    THB {service.serviceFee.toLocaleString("en-US")}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions
                    sx={{
                        px: { xs: 3, sm: 4.5 },
                        pb: 4.5,
                        pt: 1,
                        gap: 2,
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Cancel Button */}
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            width: 155,
                            height: 49,
                            borderRadius: "30px",
                            border: "1px solid #2D4085",
                            color: "#2D4085",
                            fontSize: 20,
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                                border: "2px solid #1E326E",
                                backgroundColor: "#F1F5FF",
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Book Now Button */}
                    <BookNowBtn
                        variant="secondary"
                        onClick={() => {
                            router.push(
                                `/booking?service=${encodeURIComponent(service._id)}`
                            );
                        }}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
}
