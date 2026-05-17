"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "Registration failed.");
            setLoading(false);
            return;
        }

        setSuccess("Account created successfully! Redirecting...");

        setTimeout(() => {
            router.push("/signin");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <p className="mt-2 text-center text-slate-400">
                    Sign up to use AI Career Copilot.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    {success && (
                        <p className="text-sm text-green-400">{success}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <a
                        href="/signin"
                        className="text-blue-400 hover:underline"
                    >
                        Sign In
                    </a>
                </p>
            </div>
        </main>
    );
}