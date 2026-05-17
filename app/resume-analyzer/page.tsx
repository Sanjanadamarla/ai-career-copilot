"use client";

import { useState } from "react";

type AnalysisResult = {
    atsScore: number;
    summary: string;
    missingKeywords: string[];
    suggestions: string[];
};

export default function ResumeAnalyzerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");

    const analyzeText = async (text: string) => {
        const response = await fetch("/api/resume/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                resumeText: text,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to analyze resume.");
        }

        setAnalysis(data);
    };

    const handleAnalyze = async () => {
        if (!file && !resumeText.trim()) {
            setError("Please upload a PDF or paste your resume text.");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysis(null);

        try {
            // If manual text is provided, use it directly
            if (resumeText.trim()) {
                await analyzeText(resumeText);
            } else if (file) {
                // Otherwise try PDF extraction
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse = await fetch("/api/resume/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadData.error ||
                        "Failed to parse PDF. Please paste your resume text instead."
                    );
                }

                await analyzeText(uploadData.text);
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-4xl font-bold">Resume Analyzer</h1>

                <p className="mt-3 text-slate-400">
                    Upload your resume PDF or paste the text directly to get
                    AI-powered ATS analysis.
                </p>

                <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                    {/* PDF Upload */}
                    <label className="block text-sm font-medium text-slate-300">
                        Upload Resume (PDF)
                    </label>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                            setFile(e.target.files?.[0] || null)
                        }
                        className="mt-2 block w-full text-sm text-slate-300"
                    />

                    {file && (
                        <p className="mt-2 text-sm text-slate-400">
                            Selected: {file.name}
                        </p>
                    )}

                    {/* Divider */}
                    <div className="my-6 border-t border-slate-800" />

                    {/* Manual Text Input */}
                    <label className="block text-sm font-medium text-slate-300">
                        Or Paste Resume Text
                    </label>

                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={12}
                        placeholder="Paste your complete resume text here..."
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />

                    {error && (
                        <p className="mt-4 text-red-400">{error}</p>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Analyzing Resume..."
                            : "Analyze Resume"}
                    </button>
                </div>

                {/* Results */}
                {analysis && (
                    <div className="mt-8 space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">ATS Score</h2>
                            <p className="mt-4 text-6xl font-bold text-blue-400">
                                {analysis.atsScore}%
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Overall Summary
                            </h2>
                            <p className="mt-4 text-slate-300">
                                {analysis.summary}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Missing Keywords
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {analysis.missingKeywords.map(
                                    (keyword, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-300"
                                        >
                      {keyword}
                    </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                            <h2 className="text-2xl font-semibold">
                                Improvement Suggestions
                            </h2>
                            <ul className="mt-4 space-y-3 text-slate-300">
                                {analysis.suggestions.map(
                                    (suggestion, index) => (
                                        <li key={index}>• {suggestion}</li>
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