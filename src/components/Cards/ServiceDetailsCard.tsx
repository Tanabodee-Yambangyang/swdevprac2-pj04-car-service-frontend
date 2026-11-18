
"use client";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import HandymanIcon from "@mui/icons-material/Handyman";
import PaidIcon from "@mui/icons-material/Paid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useRouter } from "next/navigation";

import BookNowBtn from "@/src/components/buttons/BookNowBtn";
import type { Service } from "@/src/lib/services";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();

  const isOilService = service.name.toLowerCase().includes("oil");

  const handleBookNow = () => {
    router.push(`/booking?service=${encodeURIComponent(service._id)}`);
  };

  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        minHeight: 105,
        borderRadius: 2,
        border: "1px solid #E0E0E0",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        px: 4,
        py: 3,
      }}
    >
      <div className="flex flex-row items-center gap-4 w-full">

        {/* Service Information */}
        <div className="flex items-center gap-8 flex-1 min-w-0">
          {isOilService ? (
            <OilBarrelIcon
              sx={{ fontSize: 54, color: "#2D4085", flexShrink: 0 }}
            />
          ) : (
            <HandymanIcon
              sx={{ fontSize: 54, color: "#2D4085", flexShrink: 0 }}
            />
          )}

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#2D4085]">
              {service.name}
            </h2>

            <p className="text-sm text-black mt-2">
              {service.description}
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            display: { xs: "none", sm: "block" },
            borderColor: "#D1D1D1",
          }}
        />

        {/* Service Details */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">

          {/* Service Fee */}
          <div className="flex items-center gap-3">
            <PaidIcon
              sx={{ fontSize: 21, color: "#2D4085" }}
            />

            <p className="text-sm font-bold text-[#2D4085]">
              THB {service.serviceFee.toLocaleString("en-US")}
            </p>
          </div>

          {/* Estimated Duration */}
          <div className="flex items-center gap-3">
            <AccessTimeIcon
              sx={{ fontSize: 21, color: "#2D4085" }}
            />

            <p className="text-sm font-bold text-[#2D4085]">
              {service.estimatedDuration} min
            </p>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="flex justify-end shrink-0 ml-3">
          <BookNowBtn
            variant="secondary"
            onClick={handleBookNow}
            className="!h-10 !px-7 !py-0 !gap-3 !text-sm !font-medium whitespace-nowrap"
          >
            Book Now
          </BookNowBtn>
        </div>
      </div>
    </Card>
  );
}
