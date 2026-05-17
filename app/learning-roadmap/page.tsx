"use client";

import { useState } from "react";

type Roadmap = {
    overview: string;
    missingSkills: string[];
    phases: {
        title: string;
        duration: string;
        topics: string[];
    }[];
};

export default function LearningRoadmapPage() {
    const [currentSkills, setCurrentSkills] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [roadmap, setRoadmap] =
        useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (
            !currentSkills.trim() ||
            !targetRole.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");
        setRoadmap(null);

        try {
            const response = await fetch(
                "/api/learning-roadmap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentSkills,
                        targetRole,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to generate roadmap."
                );
            }

            setRoadmap(data);
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
                    Personalized Learning Roadmap
                </h1>

                <p className="mt-3 text-slate-400">
                    Generate a customized plan to reach your target role.
                </p>

                <div className="mt-8 space-y-4">
          <textarea
              rows={6}
              placeholder="Current Skills (e.g. Python, React, SQL, AWS)"
              value={currentSkills}
              onChange={(e) =>
                  setCurrentSkills(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
          />

                    <input
                        type="text"
                        placeholder="Target Role (e.g. Software Engineer)"
                        value={targetRole}
                        onChange={(e) =>
                            setTargetRole(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-blue-500"
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
                        ? "Generating Roadmap..."
                        : "Generate Roadmap"}
                </button>

                {roadmap && (
                    <div className="mt-10 space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Overview
                            </h2>
                            <p className="mt-4 text-slate-300">
                                {roadmap.overview}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Missing Skills
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {roadmap.missingSkills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-300"
                                        >
                      {skill}
                    </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {roadmap.phases.map(
                                (phase, index) => (
                                    <div
                                        key={index}
                                        className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
                                    >
                                        <h2 className="text-2xl font-semibold">
                                            {phase.title}
                                        </h2>

                                        <p className="mt-2 text-blue-400">
                                            Duration: {phase.duration}
                                        </p>

                                        <ul className="mt-4 space-y-2 text-slate-300">
                                            {phase.topics.map(
                                                (topic, i) => (
                                                    <li key={i}>• {topic}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}