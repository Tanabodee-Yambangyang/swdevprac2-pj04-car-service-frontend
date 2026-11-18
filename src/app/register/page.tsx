
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { registerUser } from "@/src/lib/auth";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        // Validate password
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Register member
            await registerUser({
                name,
                email,
                tel,
                password,
            });

            // Automatically login after registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                router.push("/login");
                return;
            }

            router.push("/");
            router.refresh();

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-md">

                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#2D4085]">
                        Create Account
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Join AutoEase and book your car service appointments easily.
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-5">

                    {/* Full Name */}
                    <TextField
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Email */}
                    <TextField
                        label="Email Address"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Telephone */}
                    <TextField
                        label="Telephone Number"
                        type="tel"
                        placeholder="Enter your telephone number"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Confirm Password */}
                    <TextField
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    {/* Register Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth
                        sx={{
                            height: 49,
                            borderRadius: "30px",
                            backgroundColor: "#2D4085",
                            fontSize: 17,
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#1E326E",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Create Account"
                        )}
                    </Button>

                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-7">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-bold text-[#2D4085] hover:underline"
                    >
                        Login
                    </a>
                </p>

            </div>
        </main>
    );
}
