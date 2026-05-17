import Navbar from "../components/Navbar";

const features = [
    {
        title: "Resume ATS Analysis",
        description:
            "Get a detailed ATS score, keyword analysis, and actionable suggestions.",
    },
    {
        title: "Job Matching",
        description:
            "Compare your resume against job descriptions with semantic matching.",
    },
    {
        title: "Cover Letter Generator",
        description:
            "Generate tailored cover letters in seconds using AI.",
    },
    {
        title: "Mock Interviews",
        description:
            "Practice HR and technical interviews with instant feedback.",
    },
    {
        title: "Learning Roadmaps",
        description:
            "Receive personalized week-by-week skill development plans.",
    },
    {
        title: "Multi-Agent Workflow",
        description:
            "Specialized AI agents collaborate to solve complex career tasks.",
    },
];

const stats = [
    { value: "95%", label: "Resume Match Accuracy" },
    { value: "10x", label: "Faster Application Prep" },
    { value: "24/7", label: "AI Career Guidance" },
    { value: "5", label: "Specialized AI Agents" },
];

export default function Home() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
                {/* Hero Section */}
                <section className="relative overflow-hidden px-6 py-24 md:py-32">
                    <div className="mx-auto max-w-7xl text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
                            ✨ Multi-Agent LLM Platform
                        </div>

                        {/* Heading */}
                        <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-7xl lg:text-8xl">
                            Your AI-Powered
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Career Copilot
              </span>
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-slate-300 md:text-2xl">
                            Analyze resumes, match jobs, generate cover letters, practice
                            interviews, and receive personalized learning roadmaps — all powered
                            by advanced LLM agents.
                        </p>

                        {/* Buttons */}
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/25 transition hover:scale-105 hover:bg-blue-700">
                                Get Started Free
                            </button>

                            <button className="rounded-2xl border border-slate-600 bg-slate-900/50 px-8 py-4 text-lg font-semibold transition hover:bg-slate-800">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur"
                                >
                                    <div className="text-3xl font-bold text-blue-400">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 pb-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="text-center text-4xl font-bold md:text-5xl">
                            Powerful AI Features
                        </h2>

                        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-400">
                            Everything you need to accelerate your career journey.
                        </p>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                                >
                                    <h3 className="text-2xl font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-4 leading-7 text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}