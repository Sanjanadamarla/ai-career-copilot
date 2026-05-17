"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}