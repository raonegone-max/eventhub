import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
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
    Sparkles
} from "lucide-react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const destination = location.state?.from?.pathname || "/"

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
                
                {/* Auth Card */}
                <div className="p-8 sm:p-10 rounded-3xl bg-[#141b2b]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6">
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 mb-2 hover:scale-105 transition">
                            <Ticket className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Sign in to access your digital passes and campus events.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition"
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
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-4 h-4 stroke-[2.5]" />
                                <span>{submitting ? "SIGNING IN…" : "SIGN IN"}</span>
                            </button>
                        </div>
                    </form>

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