"use client";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
};

export default function ViewDetailsBtn({
  children = "View Details",
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer flex items-center justify-center gap-5 px-10 py-4 text-lg font-normal transition-all duration-200 hover:opacity-90";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} rounded-full text-[#2D4085] bg-[#DBEAFE] ${className}`}
    >
      {children}      
    </button>
  );
}
