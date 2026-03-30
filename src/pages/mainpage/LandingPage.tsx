import { Activity, ArrowRight, Dumbbell, Moon, Sun, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.ts";

const LandingPage = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-6 md:py-10">
                <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

                <header className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center shadow-md shadow-blue-500/30">
                            <Activity size={18} />
                        </div>
                        <span className="font-black text-lg tracking-tight">FitJourney</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        >
                            {isDark ? <Sun size={15} /> : <Moon size={15} />}
                            <span className="text-sm font-semibold">{isDark ? "Light" : "Dark"}</span>
                        </button>
                    </div>
                </header>

                <main className="relative z-10 mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                    <section className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 md:p-10 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300 mb-4">
                            For people who actually train
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                            Keep your training log honest.
                        </h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl">
                            No noise. Just workouts, calories, and progress you can follow week by week.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/register")}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25"
                            >
                                Start free <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                            >
                                I already have an account
                            </button>
                        </div>

                        <div className="mt-8 grid sm:grid-cols-3 gap-3">
                            <QuickFact label="Workout logging" value="under 30 sec" />
                            <QuickFact label="Nutrition view" value="daily + history" />
                            <QuickFact label="Social feed" value="friends only option" />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                            <p className="font-bold text-slate-900 dark:text-white">What you can do in FitJourney</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <li>Build workout plans and run active workout sessions.</li>
                                <li>Track calories with daily targets and history charts.</li>
                                <li>Share posts with global or friends-only visibility.</li>
                                <li>Connect with friends and chat directly.</li>
                            </ul>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <FeatureCard icon={<Dumbbell size={17} />} title="Workouts" description="Plans, sessions, and workout history." />
                            <FeatureCard icon={<Activity size={17} />} title="Nutrition" description="Daily calories and macro-focused tracking." />
                            <FeatureCard icon={<Users size={17} />} title="Social" description="Posts, comments, likes, friends, and chat." />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

interface QuickFactProps {
    label: string;
    value: string;
}

const QuickFact = ({ label, value }: QuickFactProps) => {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 grid place-items-center mb-2">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{description}</p>
        </div>
    );
};

export default LandingPage;