
"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import HandymanIcon from "@mui/icons-material/Handyman";
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import ViewDetailsBtn from "@/src/components/Buttons/ViewDetailsBtn";

export type Service = {
  _id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  serviceFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  // Don't display inactive services
  if (!service.isActive) return null;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 396,
        height: 316,
        borderRadius: 3,
        boxShadow: "0px 3px 5px rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        {/* Service Icon */}
        {service.name.includes("Oil") || service.name.includes("oil") ? (
          <OilBarrelIcon
            sx={{
              fontSize: 64,
              color: "#2D4085",
            }}
          />
        ) : (
          <HandymanIcon
            sx={{
              fontSize: 64,
              color: "#2D4085",
            }}
          />
        )}

        {/* Service Name */}
        <h2 className="text-2xl font-bold text-[#2D4085]">
          {service.name}
        </h2>

        {/* Description */}
        <p className="mt-1 text-lg text-black mb-8">
          {service.description}
        </p>

        {/* View Details Button */}
        <ViewDetailsBtn service={service}>
          View Details
        </ViewDetailsBtn>
      </CardContent>
    </Card>
  );
}
