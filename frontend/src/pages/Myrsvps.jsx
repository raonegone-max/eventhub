import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyRSVPs, cancelRSVP } from "../api/axios"
import {
    Ticket,
    Calendar,
    MapPin,
    ArrowRight,
    Compass,
    Sparkles,
    CheckCircle2,
    XCircle,
    QrCode
} from "lucide-react"

export default function MyRSVPs() {
    const [rsvps, setRsvps] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [cancelModalRsvp, setCancelModalRsvp] = useState(null)

    useEffect(() => {
        async function loadRSVPs() {
            try {
                const data = await getMyRSVPs()
                if (data && data.rsvps) {
                    setRsvps(data.rsvps)
                }
            } catch (err) {
                console.error("Failed to load user passes:", err)
            } finally {
                setLoading(false)
            }
        }
        loadRSVPs()
    }, [])

    async function handleCancelConfirm(eventId) {
        setCancellingId(eventId)
        try {
            const data = await cancelRSVP(eventId)
            if (data && data.rsvp) {
                setRsvps((prev) => prev.filter((r) => r.event?._id !== eventId))
                setCancelModalRsvp(null)
            } else {
                alert(data?.message || "Failed to cancel pass.")
            }
        } catch (err) {
            alert("Error cancelling pass.")
        } finally {
            setCancellingId(null)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-mono text-sm">Opening digital pass wallet...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-300 text-xs font-mono mb-3">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>STUDENT PASS WALLET</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                        My Digital Passes
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-2">
                        Your confirmed RSVP passes for upcoming campus gatherings. Present these at check-in.
                    </p>
                </div>

                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-amber-400/40 transition self-start md:self-auto shrink-0 cursor-pointer"
                >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Explore More Events</span>
                </Link>
            </div>

            {/* Pass Count Ribbon */}
            <div className="flex items-center justify-between mt-8 text-xs font-mono text-slate-400">
                <span>
                    ACTIVE PASSES: {rsvps.length}
                </span>
            </div>

            {/* Passes List / Grid */}
            <div className="mt-6">
                {rsvps.length === 0 ? (
                    <div className="text-center py-20 bg-[#0c101a]/60 border border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans">Pass Wallet Is Empty</h3>
                        <p className="text-slate-400 text-sm mt-2">
                            You haven't RSVP'd to any events yet. Explore the campus feed to claim your first pass!
                        </p>
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md transition hover:from-amber-400 hover:to-orange-400"
                        >
                            <Compass className="w-4 h-4" />
                            <span>Browse Campus Events</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rsvps.map((rsvp) => {
                            const event = rsvp.event
                            if (!event) return null

                            const dateObj = new Date(event.date)
                            const isValidDate = !isNaN(dateObj.getTime())
                            const day = isValidDate ? dateObj.getDate() : "—"
                            const month = isValidDate ? dateObj.toLocaleString("default", { month: "short" }).toUpperCase() : "TBD"
                            const weekday = isValidDate ? dateObj.toLocaleString("default", { weekday: "short" }).toUpperCase() : "DAY"

                            return (
                                <div
                                    key={rsvp._id}
                                    className="neon-card neon-glow-blue relative flex flex-col sm:flex-row min-h-[170px] overflow-hidden transition-all duration-300 group"
                                >
                                    {/* Left Stub */}
                                    <div className="p-6 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent sm:w-32 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 flex sm:flex-col items-center justify-between sm:justify-center text-center">
                                        <span className="text-[11px] font-mono font-bold tracking-widest text-blue-400">
                                            {weekday}
                                        </span>
                                        <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight my-0.5">
                                            {day}
                                        </span>
                                        <span className="text-xs font-mono font-semibold tracking-wider text-slate-300">
                                            {month}
                                        </span>
                                    </div>

                                    {/* Right Pass Details */}
                                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>CONFIRMED PASS</span>
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    PASS-{rsvp._id?.slice(-6).toUpperCase()}
                                                </span>
                                            </div>

                                            <Link
                                                to={`/events/${event._id}`}
                                                className="text-lg font-bold text-white hover:text-amber-300 transition font-sans line-clamp-1"
                                            >
                                                {event.title}
                                            </Link>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <Link
                                                to={`/events/${event._id}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-amber-300 transition"
                                            >
                                                <span>View Pass</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>

                                            <button
                                                onClick={() => setCancelModalRsvp(rsvp)}
                                                className="text-xs font-mono text-rose-400 hover:underline cursor-pointer"
                                            >
                                                Cancel RSVP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Custom Cancel Confirmation Modal */}
            {cancelModalRsvp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0c101a] border border-white/15 shadow-2xl text-center space-y-4 neon-glow-amber">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                            <Ticket className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans">Cancel Pass?</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Are you sure you want to cancel your pass for <span className="text-white font-medium">"{cancelModalRsvp.event?.title}"</span>? Your reserved spot will be released to other attendees.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3">
                            <button
                                onClick={() => setCancelModalRsvp(null)}
                                disabled={cancellingId === cancelModalRsvp.event?._id}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition cursor-pointer"
                            >
                                Keep Pass
                            </button>
                            <button
                                onClick={() => handleCancelConfirm(cancelModalRsvp.event?._id)}
                                disabled={cancellingId === cancelModalRsvp.event?._id}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition disabled:opacity-50 cursor-pointer"
                            >
                                {cancellingId === cancelModalRsvp.event?._id ? "Cancelling…" : "Yes, Cancel RSVP"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}