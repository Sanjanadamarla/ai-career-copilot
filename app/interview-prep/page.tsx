"use client";

import { useState } from "react";

type InterviewQuestion = {
    category: string;
    question: string;
    idealAnswer: string;
};

export default function InterviewPrepPage() {
    const [role, setRole] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] =
        useState("");
    const [questions, setQuestions] = useState<
        InterviewQuestion[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (
            !role.trim() ||
            !resumeText.trim() ||
            !jobDescription.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");
        setQuestions([]);

        try {
            const response = await fetch(
                "/api/interview-prep",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role,
                        resumeText,
                        jobDescription,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to generate interview questions."
                );
            }

            setQuestions(data.questions);
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
                    AI Interview Question Generator
                </h1>

                <p className="mt-3 text-slate-400">
                    Generate tailored interview questions and
                    model answers.
                </p>

                <div className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Target Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />

                    <textarea
                        rows={8}
                        placeholder="Paste your resume text..."
                        value={resumeText}
                        onChange={(e) =>
                            setResumeText(e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
                    />

                    <textarea
                        rows={8}
                        placeholder="Paste the job description..."
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
                    onClick={handleGenerate}
                    disabled={loading}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Generating Questions..."
                        : "Generate Interview Questions"}
                </button>

                {questions.length > 0 && (
                    <div className="mt-10 space-y-6">
                        {questions.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
                            >
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  {item.category}
                </span>

                                <h2 className="mt-4 text-2xl font-semibold">
                                    {item.question}
                                </h2>

                                <p className="mt-4 whitespace-pre-wrap text-slate-300">
                                    {item.idealAnswer}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}