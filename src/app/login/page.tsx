
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-center text-[#2D4085]">
          Login
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Welcome back to AutoEase
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              height: 48,
              borderRadius: "30px",
              backgroundColor: "#2D4085",
              fontSize: 16,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E326E",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-bold text-[#2D4085] hover:underline"
          >
            Register
          </a>
        </p>

      </div>
    </main>
  );
}
