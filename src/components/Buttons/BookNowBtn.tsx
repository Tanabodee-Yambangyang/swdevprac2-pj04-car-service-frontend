
type ButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
};

export default function BookNowBtn({
  children = "Book Now",
  variant = "primary",
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer h-[49px] flex items-center justify-center gap-5 px-10 py-4 text-lg font-normal transition-all duration-200 hover:opacity-90";

  const variants = {
    primary: "bg-[#2D4085] text-white rounded-xl",
    secondary: "bg-[#E9A139] text-black rounded-full",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
      <span aria-hidden="true" className="text-xl leading-none">
        →
      </span>
    </button>
  );
}
