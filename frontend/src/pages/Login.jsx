import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "../api/AuthContext"
import {
    Ticket,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    ArrowRight,
    AlertCircle,
    Sparkles,
    GraduationCap
} from "lucide-react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    // only matters the first time someone signs in with Google (i.e. account
    // creation) — for a returning Google user the backend just keeps their
    // existing role and ignores this
    const [googleRole, setGoogleRole] = useState("student")
    const { login, loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const destination = location.state?.from?.pathname || "/"

    async function handleGoogleSuccess(credentialResponse) {
        setError("")
        const success = await loginWithGoogle(credentialResponse.credential, googleRole)

        if (success) {
            navigate(destination, { replace: true })
        } else {
            setError("Google sign-in failed. Please try again.")
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            const success = await login({ email, password })
            if (success) {
                navigate(destination, { replace: true })
            } else {
                setError("Invalid email address or password. Please verify your credentials.")
            }
        } catch (err) {
            setError("Something went wrong during sign in.")
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
                
                {/* Auth Card with Signature Neon Rim Glow */}
                <div className="neon-card neon-glow-amber p-8 sm:p-10 space-y-6 shadow-2xl">
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 mb-2 hover:scale-105 transition">
                            <Ticket className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Sign in to access your digital passes and campus events.
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
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(255,107,43,0.15)] transition"
                                    required
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

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <LogIn className="w-4 h-4 stroke-[2.5]" />
                                <span>{submitting ? "SIGNING IN…" : "SIGN IN"}</span>
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google Sign-In */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5 text-center">
                                New here? Join Google sign-in as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setGoogleRole("student")}
                                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                                        googleRole === "student"
                                            ? "bg-amber-500/10 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(255,107,43,0.15)]"
                                            : "bg-[#06080e] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    <span>Student</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setGoogleRole("organizer")}
                                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                                        googleRole === "organizer"
                                            ? "bg-amber-500/10 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(255,107,43,0.15)]"
                                            : "bg-[#06080e] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Organizer</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google sign-in failed. Please try again.")}
                                theme="filled_black"
                                shape="pill"
                                text="signin_with"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400">
                        <span>Don't have an account yet? </span>
                        <Link to="/register" className="text-amber-400 font-semibold hover:underline">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}