"use client";

import Link from "next/link";
import { useState } from "react";

export default function InviteAcceptance({
    token,
}: {
    token: string;
}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [registered, setRegistered] = useState(false);

    async function register(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 12 || password.length > 128) {
            setError("Password must contain 12–128 characters.");
            return;
        }

        setBusy(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ?? "Registration failed.",
                );
            }

            setRegistered(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not register your account.",
            );
        } finally {
            setBusy(false);
        }
    }

    if (!token) {
        return (
            <p className="mt-5 text-sm text-red-700">
                Invitation token is missing. Open the complete
                invitation link sent by your company.
            </p>
        );
    }

    if (registered) {
        const callbackUrl =
            `/invite/accept?token=${encodeURIComponent(token)}`;

        return (
            <div className="mt-6 space-y-4">
                <p
                    role="status"
                    className="rounded-lg bg-green-50 p-4 text-sm text-green-800"
                >
                    Your account has been created successfully.
                    Sign in to accept your employee invitation.
                </p>

                <Link
                    href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="block rounded-lg bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700"
                >
                    Sign in and continue
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={register} className="mt-6 space-y-4">
            <div>
                <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    Create password
                </label>

                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    placeholder="At least 12 characters"
                />
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    Confirm password
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    placeholder="Re-enter your password"
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                {busy ? "Creating account..." : "Register employee account"}
            </button>

            <p className="text-sm text-slate-600">
                Already registered?{" "}
                <Link
                    href={`/signin?callbackUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`}
                    className="font-medium text-indigo-600 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}