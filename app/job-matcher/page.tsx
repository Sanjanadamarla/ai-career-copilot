"use client";

import { useState } from "react";

type MatchResult = {
    matchScore: number;
    summary: string;
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
};

export default function JobMatcherPage() {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) {
            setError(
                "Please provide both resume text and job description."
            );
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/job-matcher", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeText,
                    jobDescription,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to analyze job match."
                );
            }

            setResult(data);
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

    return (
        <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold">
                    Job Description Matcher
                </h1>

                <p className="mt-3 text-slate-400">
                    Compare your resume against a target job description.
                </p>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <textarea
              rows={16}
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) =>
                  setResumeText(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
          />

                    <textarea
                        rows={16}
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) =>
                            setJobDescription(e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />
                </div>

                {error && (
                    <p className="mt-4 text-red-400">{error}</p>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Analyzing Match..."
                        : "Analyze Match"}
                </button>

                {result && (
                    <div className="mt-10 space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Match Score
                            </h2>
                            <p className="mt-4 text-6xl font-bold text-green-400">
                                {result.matchScore}%
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Summary
                            </h2>
                            <p className="mt-4 text-slate-300">
                                {result.summary}
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                                <h2 className="text-2xl font-semibold">
                                    Matching Skills
                                </h2>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {result.matchingSkills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-green-500/20 px-4 py-2 text-green-300"
                                            >
                        {skill}
                      </span>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                                <h2 className="text-2xl font-semibold">
                                    Missing Skills
                                </h2>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {result.missingSkills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-red-500/20 px-4 py-2 text-red-300"
                                            >
                        {skill}
                      </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Recommendations
                            </h2>
                            <ul className="mt-4 space-y-3 text-slate-300">
                                {result.recommendations.map(
                                    (item, index) => (
                                        <li key={index}>• {item}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}