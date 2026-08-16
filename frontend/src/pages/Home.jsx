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
    Plus
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

    const categories = [
        { name: "Tech & Hackathons", icon: "💻", count: "12 Events" },
        { name: "Music & Cultural", icon: "🎵", count: "8 Events" },
        { name: "Workshops & Talks", icon: "💡", count: "15 Events" },
        { name: "Sports & Gaming", icon: "🏆", count: "6 Events" },
    ]

    return (
        <div className="relative overflow-hidden">
            
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
                <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse-glow" />
                <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            {/* HERO SECTION */}
            <section className="pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-amber-400/30 transition shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-mono font-medium tracking-wider text-amber-300 uppercase">
                        Campus Discovery & Live Passes
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-sans">
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
                    className="max-w-2xl mx-auto mt-10 p-2 rounded-2xl bg-[#161f30]/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-amber-400/50 transition-all"
                >
                    <div className="flex items-center gap-3 px-3 w-full">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by event title, hall, or club name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white placeholder-slate-500 text-sm md:text-base focus:outline-none w-full py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition flex items-center justify-center gap-2 shrink-0"
                    >
                        <span>Find Events</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-amber-400/40 transition shadow-sm"
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
                        >
                            <Ticket className="w-4 h-4 text-indigo-400" />
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

            {/* LIVE METRICS RIBBON */}
            <section className="border-y border-white/10 bg-[#0d1422]/60 backdrop-blur-md py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-white font-sans">500+</p>
                            <p className="text-xs font-mono text-slate-400">GATHERINGS HOSTED</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-sans">15,000+</p>
                            <p className="text-xs font-mono text-slate-400">DIGITAL PASSES ISSUED</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-sans">40+</p>
                            <p className="text-xs font-mono text-slate-400">CAMPUS CLUBS & SOCS</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-sans">99.8%</p>
                            <p className="text-xs font-mono text-slate-400">RSVP RELIABILITY</p>
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
                            <div key={n} className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : recentEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recentEvents.map((event) => (
                            <TicketCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                        <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-300 font-medium">No events scheduled right now.</p>
                        <p className="text-xs text-slate-500 mt-1">Be the first organizer to post what's happening!</p>
                        {isOrganizer && (
                            <Link
                                to="/events/create"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create First Event</span>
                            </Link>
                        )}
                    </div>
                )}
            </section>

            {/* HOW IT WORKS (3-STEP DIGITAL PASS SYSTEM) */}
            <section className="py-16 bg-[#0c121e]/80 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                            Digital Pass Engine
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-sans">
                            How EventHub Works
                        </h2>
                        <p className="text-slate-400 text-sm mt-3">
                            Say goodbye to messy group chats and lost paper flyers. Everything you need in 3 seamless steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-lg mb-6">
                                01
                            </div>
                            <h3 className="text-xl font-bold text-white font-sans">Discover</h3>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                Browse curated campus happenings, filter by date or interest, and check venue capacities in real time.
                            </p>
                        </div>

                        <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-lg mb-6">
                                02
                            </div>
                            <h3 className="text-xl font-bold text-white font-sans">Claim Pass</h3>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                One-tap RSVP reserves your spot and creates a digital perforated ticket pass directly in your wallet.
                            </p>
                        </div>

                        <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg mb-6">
                                03
                            </div>
                            <h3 className="text-xl font-bold text-white font-sans">Check In</h3>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                Present your verified digital pass at the entrance. Organizers track attendees effortlessly with zero hassle.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ORGANIZER CTA BANNER */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-white/15 p-8 sm:p-12 lg:p-16 text-center">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950 uppercase">
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
                                    className="px-6 py-3.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5 stroke-[2.5]" />
                                    <span>Create Event Now</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="px-6 py-3.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
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
