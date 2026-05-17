export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="text-2xl font-bold text-white">
                    AI Career Copilot
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-slate-300">
                    <a href="#features" className="hover:text-white transition">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-white transition">
                        Pricing
                    </a>
                    <a href="#contact" className="hover:text-white transition">
                        Contact
                    </a>
                </div>

                {/* Sign In Button */}
                <button className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition">
                    Sign In
                </button>
            </div>
        </nav>
    );
}