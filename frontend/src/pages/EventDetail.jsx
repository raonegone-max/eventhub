import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getEventById, createRSVP, deleteEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"
import {
    Calendar,
    MapPin,
    Users,
    ArrowLeft,
    Share2,
    Check,
    Edit3,
    Trash2,
    Sparkles,
    ShieldCheck,
    Ticket,
    CheckCircle2,
    AlertCircle,
    Clock,
    QrCode
} from "lucide-react"

export default function EventDetail() {
    const { id } = useParams()
    const { user, isLoggedIn } = useAuth()
    const navigate = useNavigate()
    
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rsvpMessage, setRsvpMessage] = useState("")
    const [isSuccessRsvp, setIsSuccessRsvp] = useState(false)
    const [rsvpLoading, setRsvpLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEventById(id)
                if (data && data.event) {
                    setEvent(data.event)
                }
            } catch (err) {
                console.error("Failed to load event:", err)
            } finally {
                setLoading(false)
            }
        }
        loadEvent()
    }, [id])

    async function handleRSVP() {
        setRsvpLoading(true)
        setRsvpMessage("")
        setIsSuccessRsvp(false)

        try {
            const data = await createRSVP(id)
            if (data && data.rsvp) {
                setIsSuccessRsvp(true)
                setRsvpMessage("Your digital pass has been confirmed and added to your wallet!")
            } else if (data && data.message) {
                setIsSuccessRsvp(data.message.toLowerCase().includes("success") || data.message.toLowerCase().includes("going"))
                setRsvpMessage(data.message)
            } else {
                setRsvpMessage("Unable to complete RSVP. Please try again.")
            }
        } catch (e) {
            setRsvpMessage("Something went wrong while securing your pass.")
        } finally {
            setRsvpLoading(false)
        }
    }

    async function handleDeleteConfirm() {
        setDeleting(true)
        try {
            const data = await deleteEvent(id)
            if (data && data.message === "Event deleted successfully") {
                navigate("/my-events")
            } else {
                alert(data?.message || "Failed to delete event.")
                setDeleting(false)
                setShowDeleteModal(false)
            }
        } catch (e) {
            alert("Error deleting event.")
            setDeleting(false)
            setShowDeleteModal(false)
        }
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-mono text-sm">Loading event details...</p>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
                <p className="text-slate-400 text-sm mt-2">
                    This event may have been cancelled or removed by the organizer.
                </p>
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to All Events</span>
                </Link>
            </div>
        )
    }

    const isOwner = isLoggedIn && (user?.id === event.organizer?._id || user?._id === event.organizer?._id)
    const dateObj = new Date(event.date)
    const isValidDate = !isNaN(dateObj.getTime())
    const day = isValidDate ? dateObj.getDate() : "—"
    const month = isValidDate ? dateObj.toLocaleString("default", { month: "short" }).toUpperCase() : "TBD"
    const year = isValidDate ? dateObj.getFullYear() : "2026"
    const fullDateStr = isValidDate ? dateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "Date TBD"

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Events Feed</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copied ? "Link Copied!" : "Share Pass"}</span>
                    </button>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/events/${event._id}/edit`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Split Showcase Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Event Details */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* Header Banner */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>CAMPUS EVENT</span>
                            </span>
                            {event.capacity !== null && event.capacity !== undefined && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>CAPACITY: {event.capacity} ATTENDEES</span>
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
                            {event.title}
                        </h1>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center font-bold text-slate-950 uppercase shadow-md">
                                {event.organizer?.name?.[0] || "O"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Hosted by {event.organizer?.name || "Campus Organizer"}
                                </p>
                                <p className="text-xs font-mono text-amber-400 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> VERIFIED ORGANIZER
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Info Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#131b2c]/80 border border-white/10 backdrop-blur-md">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-slate-400 uppercase">Date & Time</p>
                                <p className="text-sm font-semibold text-white mt-0.5">{fullDateStr}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-slate-400 uppercase">Venue Location</p>
                                <p className="text-sm font-semibold text-white mt-0.5">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                            <span>About This Gathering</span>
                        </h2>
                        <div className="p-6 rounded-2xl bg-[#131b2c]/40 border border-white/5 text-slate-300 text-base leading-relaxed whitespace-pre-line">
                            {event.description}
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Digital Pass Card & RSVP Box */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* VIP DIGITAL TICKET PASS */}
                    <div className="relative rounded-3xl bg-gradient-to-b from-[#18233a] to-[#121826] border border-white/15 p-6 sm:p-8 shadow-2xl shadow-black/40 overflow-hidden">
                        
                        {/* Top Perforation Notches */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0b0f17] border border-white/15 z-10" />

                        <div className="text-center pb-6 border-b border-dashed border-white/20">
                            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase font-bold">
                                OFFICIAL CAMPUS PASS
                            </span>
                            <h3 className="text-2xl font-extrabold text-white mt-2 font-sans line-clamp-1">
                                {event.title}
                            </h3>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                PASS-ID: {event._id ? event._id.slice(-8).toUpperCase() : "2026-CAMPUS"}
                            </p>
                        </div>

                        {/* Middle Pass Details */}
                        <div className="py-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-mono text-xs">EVENT DATE</span>
                                <span className="font-semibold text-white">{month} {day}, {year}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-mono text-xs">LOCATION</span>
                                <span className="font-semibold text-white truncate max-w-[180px]">{event.location}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-mono text-xs">STATUS</span>
                                <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active Entry
                                </span>
                            </div>
                        </div>

                        {/* Perforation Divider Line */}
                        <div className="ticket-perforation-h my-2 opacity-50" />

                        {/* RSVP Action Trigger */}
                        <div className="pt-6 space-y-4">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={handleRSVP}
                                        disabled={rsvpLoading}
                                        className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Ticket className="w-5 h-5" />
                                        <span>{rsvpLoading ? "CLAIMING PASS…" : "RSVP & GET DIGITAL PASS"}</span>
                                    </button>

                                    {rsvpMessage && (
                                        <div
                                            className={`p-4 rounded-xl text-xs font-mono flex items-start gap-2.5 ${
                                                isSuccessRsvp
                                                    ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                                                    : "bg-amber-950/60 border border-amber-800 text-amber-300"
                                            }`}
                                        >
                                            {isSuccessRsvp ? (
                                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                                            )}
                                            <span>{rsvpMessage}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                    <p className="text-xs text-slate-300">
                                        Log in to secure your spot and receive your pass barcode.
                                    </p>
                                    <Link
                                        to="/login"
                                        state={{ from: { pathname: `/events/${id}` } }}
                                        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-amber-500 text-slate-950 shadow-md transition hover:bg-amber-400"
                                    >
                                        <span>Sign In to RSVP</span>
                                    </Link>
                                </div>
                            )}

                            {/* Simulated Pass Barcode Stamp */}
                            <div className="pt-4 flex flex-col items-center opacity-60">
                                <div className="flex gap-1 h-8 items-center">
                                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map((w, i) => (
                                        <div
                                            key={i}
                                            className="bg-slate-300 h-full rounded-sm"
                                            style={{ width: `${w * 2}px` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-1">
                                    EVENTHUB DIGITAL VERIFIED PASS
                                </span>
                            </div>
                        </div>

                        {/* Bottom Perforation Notch */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0b0f17] border border-white/15 z-10" />
                    </div>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#161f30] border border-white/15 shadow-2xl text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans">Delete Event?</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="text-white font-medium">"{event.title}"</span>? All attendee RSVPs and digital passes will be revoked permanently.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition disabled:opacity-50"
                            >
                                {deleting ? "Deleting…" : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}