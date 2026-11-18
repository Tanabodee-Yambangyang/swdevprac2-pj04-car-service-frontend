
"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";

import { useSession } from "next-auth/react";
import LogoutButton from "@/src/components/buttons/LogoutButton";

export default function NavBar() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

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
        {/* Logo */}
        <a
          className="flex justify-center items-center gap-2 cursor-pointer"
          href="/"
        >
          <DirectionsCarFilledIcon />
          <h1 className="text-white text-xl font-bold">
            AutoEase
          </h1>
        </a>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {status === "loading" ? null : isLoggedIn ? (
            isAdmin ? (
              /* Admin Navigation */
              <>
                <Button color="inherit" href="/admin/appointments">
                  All Appointments
                </Button>

                <Button color="inherit" href="/admin/services">
                  Manage Services
                </Button>

                <LogoutButton />
              </>
            ) : (
              /* Member Navigation */
              <>
                <Button color="inherit" href="/services">
                  Services
                </Button>

                <Button color="inherit" href="/booking">
                  Book
                </Button>

                <Button color="inherit" href="/my-appointments">
                  My Appointment
                </Button>

                <LogoutButton />
              </>
            )
          ) : (
            /* Guest Navigation */
            <>
              <Button color="inherit" href="/services">
                Services
              </Button>

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
