import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users to the sign-in page
    if (!session) {
        redirect("/signin");
    }

    const tools = [
        "Resume Analyzer",
        "Job Matcher",
        "Cover Letter Generator",
        "Interview Simulator",
        "Learning Roadmap",
        "Document Chat",
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white p-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Welcome, {session.user?.name || "User"} 🚀
                        </h1>

                        <p className="mt-4 text-lg md:text-xl text-slate-400">
                            Your personalized AI-powered career dashboard.
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                {/* Tool Cards */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => (
                        <div
                            key={tool}
                            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-semibold">{tool}</h2>
                            <p className="mt-2 text-slate-400">
                                Coming soon.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}