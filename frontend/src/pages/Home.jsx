import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../api/AuthContext"
import { getEvents } from "../api/axios"
import TicketCard from "../components/TicketCard"
import {
    Compass,
    Sparkles,
    Calendar,
    Search,
    ArrowRight,
    Users,
    ShieldCheck,
    CheckCircle2,
    Zap,
    Ticket,
    Layers,
    Clock,
    Plus,
    Flame,
    Mail,
    Wrench,
    QrCode,
    SlidersHorizontal
} from "lucide-react"

export default function Home() {
    const { user, isLoggedIn, isOrganizer } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [recentEvents, setRecentEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecent() {
            try {
                const data = await getEvents()
                if (data && data.events) {
                    setRecentEvents(data.events.slice(0, 4))
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchRecent()
    }, [])

    function handleSearchSubmit(e) {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate("/events")
        }
    }

    return (
        <div className="relative overflow-hidden">
            
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse-glow" />
                <div className="absolute top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-72 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px]" />
            </div>

            {/* HERO SECTION */}
            <section className="pt-14 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl mb-8 hover:border-amber-400/40 transition shadow-lg shadow-black/40">
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-mono font-medium tracking-wider text-amber-300 uppercase">
                        Campus Discovery &amp; Live Passes
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] font-sans">
                    Experience What's Next on{" "}
                    <span className="gradient-text-amber inline-block">Campus.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
                    Discover hackathons, cultural galas, workshops, and sports tourneys. One-click RSVP passes, instant check-in, zero paper waste.
                </p>

                {/* Interactive Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="max-w-2xl mx-auto mt-10 p-2 rounded-2xl bg-[#0e131f]/90 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-amber-400/60 focus-within:shadow-[0_0_30px_rgba(255,107,43,0.15)] transition-all duration-300"
                >
                    <div className="flex items-center gap-3 px-3 w-full">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by event title, hall, or club name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white placeholder-slate-500 text-sm md:text-base focus:outline-none w-full py-2.5"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                        <span>Find Events</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 hover:border-amber-400/40 transition shadow-sm"
                    >
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span>Browse All Events</span>
                    </Link>

                    {isOrganizer ? (
                        <Link
                            to="/events/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Event</span>
                        </Link>
                    ) : isLoggedIn ? (
                        <Link
                            to="/my-rsvps"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                        >
                            <Ticket className="w-4 h-4 text-blue-400" />
                            <span>My Digital Passes</span>
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                        >
                            <span>Create Free Account</span>
                        </Link>
                    )}
                </div>
            </section>

            {/* =========================================================================
               SIGNATURE 3-CARD SHOWCASE SECTION (Matching Theme Reference Image Exactly)
               ========================================================================= */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="mb-12 md:mb-14">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                        How We Keep You Ahead®
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
                        From quick daily updates to deep expert insights, we give you every advantage in the campus revolution.
                    </p>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Here's how we deliver on that promise every day.
                    </p>
                </div>

                {/* The 3 Glowing Neon-Rim Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Card 1: Amber Neon Rim Glow */}
                    <div className="neon-card neon-glow-amber p-8 sm:p-9 flex flex-col justify-between min-h-[340px] group">
                        <div>
                            {/* Embossed Icon Badge */}
                            <div className="w-13 h-13 rounded-2xl squircle-icon flex items-center justify-center mb-7 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                                <Mail className="w-6 h-6 stroke-[2]" />
                            </div>

                            {/* Card Title */}
                            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight mb-3">
                                Daily Newsletter
                            </h3>

                            {/* Card Description */}
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Your shortcut to staying ahead—delivered every morning.
                            </p>
                        </div>

                        {/* Card Link */}
                        <div className="pt-6">
                            <Link
                                to="/events"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-amber-300 transition-colors"
                            >
                                <span>Get Daily Briefs</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Electric Blue Neon Rim Glow */}
                    <div className="neon-card neon-glow-blue p-8 sm:p-9 flex flex-col justify-between min-h-[340px] group">
                        <div>
                            {/* Embossed Icon Badge */}
                            <div className="w-13 h-13 rounded-2xl squircle-icon flex items-center justify-center mb-7 text-blue-400 group-hover:scale-105 transition-transform duration-300">
                                <Wrench className="w-6 h-6 stroke-[2]" />
                            </div>

                            {/* Card Title */}
                            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight mb-3">
                                Curated Tools
                            </h3>

                            {/* Card Description */}
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                The most powerful campus apps and platforms—tested and reviewed for you.
                            </p>
                        </div>

                        {/* Card Link */}
                        <div className="pt-6">
                            <Link
                                to={isLoggedIn ? "/my-rsvps" : "/events"}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-blue-300 transition-colors"
                            >
                                <span>Find My Tools</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Card 3: Emerald Neon Rim Glow */}
                    <div className="neon-card neon-glow-emerald p-8 sm:p-9 flex flex-col justify-between min-h-[340px] group">
                        <div>
                            {/* Embossed Icon Badge */}
                            <div className="w-13 h-13 rounded-2xl squircle-icon flex items-center justify-center mb-7 text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                                <Sparkles className="w-6 h-6 stroke-[2]" />
                            </div>

                            {/* Card Title */}
                            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight mb-3">
                                Expert Insights
                            </h3>

                            {/* Card Description */}
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Actionable analysis from researchers and founders shaping the future of AI.
                            </p>
                        </div>

                        {/* Card Link */}
                        <div className="pt-6">
                            <Link
                                to={isOrganizer ? "/events/create" : "/events"}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-emerald-300 transition-colors"
                            >
                                <span>Unlock Insights</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Bottom Feature Indicator Pills (Matching Theme Reference Image) */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10 pt-4 text-xs sm:text-sm text-slate-400 font-medium">
                    <div className="flex items-center gap-2 hover:text-white transition">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Always Current</span>
                    </div>

                    <div className="flex items-center gap-2 hover:text-white transition">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>Focused for You</span>
                    </div>

                    <div className="flex items-center gap-2 hover:text-white transition">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Actionable Steps</span>
                    </div>
                </div>

            </section>

            {/* LIVE METRICS RIBBON */}
            <section className="border-y border-white/10 bg-[#090d16]/70 backdrop-blur-xl py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-extrabold text-white font-sans">500+</p>
                            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">GATHERINGS HOSTED</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-sans">15,000+</p>
                            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">DIGITAL PASSES ISSUED</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-sans">40+</p>
                            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">CAMPUS CLUBS &amp; SOCS</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-sans">99.8%</p>
                            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">RSVP RELIABILITY</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECENT EVENTS SHOWCASE */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Trending Campus Feed</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                            Upcoming Highlights
                        </h2>
                    </div>
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                        <span>View All Events</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-44 rounded-3xl bg-slate-800/30 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : recentEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recentEvents.map((event) => (
                            <TicketCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-[#0c101a]/80 border border-white/5 rounded-3xl p-8 max-w-md mx-auto">
                        <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-300 font-medium">No events scheduled right now.</p>
                        <p className="text-xs text-slate-500 mt-1">Be the first organizer to post what's happening!</p>
                        {isOrganizer && (
                            <Link
                                to="/events/create"
                                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950 shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create First Event</span>
                            </Link>
                        )}
                    </div>
                )}
            </section>

            {/* ORGANIZER CTA BANNER */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-emerald-500/15 border border-white/10 p-8 sm:p-12 lg:p-16 text-center backdrop-blur-2xl shadow-2xl shadow-black/60">
                    <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950 uppercase shadow-md shadow-amber-500/20">
                            Organizer Console
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans">
                            Planning a Campus Gathering?
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Publish your event with our live ticket preview builder, set capacity caps, and manage student RSVPs effortlessly.
                        </p>
                        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                            {isOrganizer ? (
                                <Link
                                    to="/events/create"
                                    className="px-7 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5 stroke-[2.5]" />
                                    <span>Create Event Now</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="px-7 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center gap-2"
                                >
                                    <span>Sign Up to Host</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
