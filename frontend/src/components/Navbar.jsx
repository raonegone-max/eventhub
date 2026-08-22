import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../api/AuthContext"
import {
    Ticket,
    Compass,
    Plus,
    Calendar,
    LogOut,
    LogIn,
    UserPlus,
    Menu,
    X,
    Sparkles,
    ShieldCheck,
    GraduationCap
} from "lucide-react"

export default function Navbar() {
    const { user, isLoggedIn, isOrganizer, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    async function handleLogout() {
        await logout()
        setMobileMenuOpen(false)
        navigate("/")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#06080e]/85 backdrop-blur-2xl transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    
                    {/* Brand Logo */}
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 group focus:outline-none"
                    >
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/35 transition-all duration-300">
                            <Ticket className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            <div className="absolute -inset-0.5 rounded-2xl bg-amber-400/30 blur-sm -z-10 group-hover:opacity-100 opacity-60 transition" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1 font-sans">
                                Event<span className="gradient-text-amber">Hub</span>
                            </span>
                            <span className="text-[9px] font-mono tracking-widest text-slate-400 -mt-1 hidden sm:block">
                                CAMPUS DISCOVERY
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        <Link
                            to="/events"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                isActive("/events")
                                    ? "bg-white/10 text-white shadow-inner border border-white/10"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span>Explore Events</span>
                        </Link>

                        {isLoggedIn && (
                            <Link
                                to="/my-rsvps"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    isActive("/my-rsvps")
                                        ? "bg-white/10 text-white shadow-inner border border-white/10"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Ticket className="w-4 h-4 text-blue-400" />
                                <span>My Passes</span>
                            </Link>
                        )}

                        {isOrganizer && (
                            <Link
                                to="/my-events"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    isActive("/my-events")
                                        ? "bg-white/10 text-white shadow-inner border border-white/10"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <span>My Events</span>
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {isOrganizer && (
                            <Link
                                to="/events/create"
                                className="flex items-center gap-2 px-4.5 py-2.2 rounded-xl text-sm font-bold bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                                <span>Host Event</span>
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                                <div className="flex items-center gap-2.5 bg-[#0e131f] border border-white/10 py-1.5 px-3.5 rounded-full shadow-inner">
                                    <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-500 to-amber-400 flex items-center justify-center text-xs font-bold text-slate-950 uppercase shadow-sm">
                                        {user?.name?.[0] || "U"}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-semibold text-white leading-tight truncate max-w-25">
                                            {user?.name}
                                        </span>
                                        <span className="text-[9px] font-mono tracking-wider text-amber-400 flex items-center gap-0.5">
                                            {isOrganizer ? (
                                                <>
                                                    <ShieldCheck className="w-2.5 h-2.5 inline" /> ORGANIZER
                                                </>
                                            ) : (
                                                <>
                                                    <GraduationCap className="w-2.5 h-2.5 inline" /> STUDENT
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-amber-400/50 shadow-sm transition"
                                >
                                    <UserPlus className="w-4 h-4 text-amber-400" />
                                    <span>Join Hub</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        {isLoggedIn && isOrganizer && (
                            <Link
                                to="/events/create"
                                className="p-2 rounded-xl bg-amber-500 text-slate-950"
                            >
                                <Plus className="w-4 h-4 stroke-3" />
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#06080e]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col space-y-1">
                        <Link
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium ${
                                isActive("/events")
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Compass className="w-5 h-5 text-amber-400" />
                            <span>Explore Events</span>
                        </Link>

                        {isLoggedIn && (
                            <Link
                                to="/my-rsvps"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium ${
                                    isActive("/my-rsvps")
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Ticket className="w-5 h-5 text-blue-400" />
                                <span>My Passes</span>
                            </Link>
                        )}

                        {isOrganizer && (
                            <Link
                                to="/my-events"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium ${
                                    isActive("/my-events")
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Calendar className="w-5 h-5 text-emerald-400" />
                                <span>My Events</span>
                            </Link>
                        )}

                        {isOrganizer && (
                            <Link
                                to="/events/create"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl font-bold bg-amber-500 text-slate-950 shadow-md"
                            >
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                                <span>Host New Event</span>
                            </Link>
                        )}
                    </nav>

                    <div className="pt-3 border-t border-white/10">
                        {isLoggedIn ? (
                            <div className="flex items-center justify-between bg-[#0e131f] p-3 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-amber-400 flex items-center justify-center text-sm font-bold text-slate-950 uppercase">
                                        {user?.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                                        <p className="text-xs font-mono text-amber-400">{user?.role?.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white border border-white/10"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Join Hub</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
