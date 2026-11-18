
"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import HandymanIcon from "@mui/icons-material/Handyman";
import ViewDetailsBtn from "@/src/components/Buttons/ViewDetailsBtn";

type ServiceCardProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
};

export default function ServiceCard({
  title = "General Service",
  description = "Maintenance & Check-up",
  buttonText = "View Details",
  onClick,
}: ServiceCardProps) {
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
        <HandymanIcon
          sx={{
            fontSize: 64,
            color: "#2D4085",
          }}
        />

        {/* Service Title */}
        <h2 className="text-2xl font-bold text-[#2D4085]">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-1 text-lg text-black mb-8">
          {description}
        </p>

        {/* View Details Button */}
        <ViewDetailsBtn onClick={onClick}>
          {buttonText}
        </ViewDetailsBtn>
      </CardContent>
    </Card>
  );
}
