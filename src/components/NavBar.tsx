
"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/src/components/buttons/LogoutButton";

export default function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === "authenticated";

  return (
    <AppBar
      position="static"
      sx={{
        height: "68px",
        justifyContent: "center",
        backgroundColor: "#2D4085",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "68px !important",
          display: "flex",
          justifyContent: "space-between",
          px: "36px",
        }}
      >
        <a
          className="flex justify-center items-center gap-2 cursor-pointer"
          href="/"
        >
          <DirectionsCarFilledIcon />
          <h1 className="text-white text-xl font-bold">AutoEase</h1>
        </a>

        <div className="flex items-center gap-8">
          <Button color="inherit" href="/services">
            Services
          </Button>

          {status === "loading" ? null : isLoggedIn ? (
            <>
              <Button color="inherit" href="/booking">
                Book
              </Button>

              <Button color="inherit" href="/appointments">
                My Appointment
              </Button>

              <LogoutButton />
            </>
          ) : (
            <>
              <Button color="inherit" href="/login">
                Login
              </Button>

              <Button color="inherit" href="/register">
                Register
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
