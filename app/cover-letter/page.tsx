"use client";

import { useState } from "react";
import { exportToPdf } from "@/lib/exportPdf";

export default function CoverLetterPage() {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (
            !company.trim() ||
            !role.trim() ||
            !resumeText.trim() ||
            !jobDescription.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");
        setCoverLetter("");

        try {
            const response = await fetch("/api/cover-letter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company,
                    role,
                    resumeText,
                    jobDescription,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to generate cover letter."
                );
            }

            setCoverLetter(data.coverLetter);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        exportToPdf(
            "Generated Cover Letter",
            coverLetter,
            "cover-letter.pdf"
        );
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold">
                    AI Cover Letter Generator
                </h1>

                <p className="mt-3 text-slate-400">
                    Generate a personalized cover letter for any job.
                </p>

                <div className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Role Title"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />

                    <textarea
                        rows={10}
                        placeholder="Paste your resume text..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />

                    <textarea
                        rows={10}
                        placeholder="Paste the job description..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />
                </div>

                {error && (
                    <p className="mt-4 text-red-400">{error}</p>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Generating Cover Letter..."
                        : "Generate Cover Letter"}
                </button>

                {coverLetter && (
                    <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-semibold">
                                Generated Cover Letter
                            </h2>

                            <button
                                onClick={handleDownloadPdf}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-700"
                            >
                                Download PDF
                            </button>
                        </div>

                        <pre className="mt-4 whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
              {coverLetter}
            </pre>
                    </div>
                )}
            </div>
        </main>
    );
}