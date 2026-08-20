import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../api/AuthContext"
import {
    Ticket,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    AlertCircle,
    GraduationCap,
    Sparkles
} from "lucide-react"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            const success = await register({ name, email, password, role })
            if (success) {
                navigate("/")
            } else {
                setError("An account with this email already exists or registration failed.")
            }
        } catch (err) {
            setError("Something went wrong during account creation.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            <div className="w-full max-w-md">
                
                {/* Auth Card with Neon Rim Glow */}
                <div className="neon-card neon-glow-amber p-8 sm:p-10 space-y-6 shadow-2xl">
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 mb-2 hover:scale-105 transition">
                            <Ticket className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                            Join EventHub
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Create your campus profile to RSVP for gatherings and claim passes.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. Alex Morgan"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(255,107,43,0.15)] transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Campus Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="student@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(255,107,43,0.15)] transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Create Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(255,107,43,0.15)] transition"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border text-sm font-semibold transition cursor-pointer ${
                                        role === "student"
                                            ? "bg-amber-500/10 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(255,107,43,0.15)]"
                                            : "bg-[#06080e] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    <span>Student</span>
                                    <span className="text-[10px] font-mono font-normal text-slate-500">Browse &amp; RSVP</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole("organizer")}
                                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border text-sm font-semibold transition cursor-pointer ${
                                        role === "organizer"
                                            ? "bg-amber-500/10 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(255,107,43,0.15)]"
                                            : "bg-[#06080e] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Organizer</span>
                                    <span className="text-[10px] font-mono font-normal text-slate-500">Host &amp; manage</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                                <span>{submitting ? "CREATING PROFILE…" : "CREATE ACCOUNT"}</span>
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400">
                        <span>Already registered? </span>
                        <Link to="/login" className="text-amber-400 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}