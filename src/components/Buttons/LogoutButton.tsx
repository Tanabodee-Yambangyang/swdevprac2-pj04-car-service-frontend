
"use client";

import { signOut, useSession } from "next-auth/react";
import Button from "@mui/material/Button";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <Button
      color="inherit"
      onClick={handleLogout}
      disabled={!session}
    >
      Logout
    </Button>
  );
}
