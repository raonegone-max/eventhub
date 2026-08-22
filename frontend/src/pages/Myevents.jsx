import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyEvents, deleteEvent } from "../api/axios"
import {
    Calendar,
    Plus,
    Users,
    MapPin,
    Edit3,
    Trash2,
    ArrowRight,
    ExternalLink,
    Sparkles,
    ShieldCheck,
    Layers
} from "lucide-react"

export default function MyEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [deleteModalEvent, setDeleteModalEvent] = useState(null)

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getMyEvents()
                if (data && data.events) {
                    setEvents(data.events)
                }
            } catch (err) {
                console.error("Failed to load organizer events:", err)
            } finally {
                setLoading(false)
            }
        }
        loadEvents()
    }, [])

    async function handleDelete(eventId) {
        setDeletingId(eventId)
        try {
            const data = await deleteEvent(eventId)
            if (data && data.message === "Event deleted successfully") {
                setEvents((prev) => prev.filter((e) => e._id !== eventId))
                setDeleteModalEvent(null)
            } else {
                alert(data?.message || "Failed to delete event.")
            }
        } catch (e) {
            alert("Error deleting event.")
        } finally {
            setDeletingId(null)
        }
    }

    const totalCapacity = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0)

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-mono text-sm">Loading organizer console...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Header & Metrics */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-mono mb-3">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ORGANIZER COMMAND CONSOLE</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                        My Events
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-2">
                        Manage your published campus gatherings, update schedules, and track capacity.
                    </p>
                </div>

                <Link
                    to="/events/create"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition self-start md:self-auto shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Host New Event</span>
                </Link>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="p-6 rounded-3xl bg-[#0c101a]/80 border border-white/10">
                    <p className="text-xs font-mono text-slate-400 uppercase">Total Hosted</p>
                    <p className="text-3xl font-extrabold text-white mt-1 font-sans">{events.length}</p>
                </div>
                <div className="p-6 rounded-3xl bg-[#0c101a]/80 border border-white/10">
                    <p className="text-xs font-mono text-slate-400 uppercase">Cumulative Capacity</p>
                    <p className="text-3xl font-extrabold text-amber-400 mt-1 font-sans">
                        {totalCapacity > 0 ? totalCapacity : "Open Access"}
                    </p>
                </div>
                <div className="p-6 rounded-3xl bg-[#0c101a]/80 border border-white/10">
                    <p className="text-xs font-mono text-slate-400 uppercase">Console Status</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-sans flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Live
                    </p>
                </div>
            </div>

            {/* Event Management List */}
            <div className="mt-10">
                <h2 className="text-xl font-bold text-white font-sans mb-4">
                    Published Gatherings ({events.length})
                </h2>

                {events.length === 0 ? (
                    <div className="text-center py-16 bg-[#0c101a]/60 border border-white/5 rounded-3xl p-8 max-w-md mx-auto">
                        <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white">No Events Published Yet</h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Ready to organize your first workshop, hackathon, or cultural fest?
                        </p>
                        <Link
                            to="/events/create"
                            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950 shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Host Your First Event</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => {
                            const dateObj = new Date(event.date)
                            const dateStr = !isNaN(dateObj.getTime())
                                ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "Date TBD"

                            return (
                                <div
                                    key={event._id}
                                    className="p-5 sm:p-6 rounded-3xl bg-[#0c101a]/80 border border-white/10 hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(255,107,43,0.1)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                                                {dateStr}
                                            </span>
                                            {event.capacity && (
                                                <span className="text-xs font-mono text-slate-400">
                                                    Cap: {event.capacity}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            to={`/events/${event._id}`}
                                            className="text-lg font-bold text-white hover:text-amber-300 transition font-sans inline-block"
                                        >
                                            {event.title}
                                        </Link>

                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>View</span>
                                        </Link>

                                        <Link
                                            to={`/events/${event._id}/edit`}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </Link>

                                        <button
                                            onClick={() => setDeleteModalEvent(event)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteModalEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0c101a] border border-white/15 shadow-2xl text-center space-y-4 neon-glow-rose">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans">Delete Event?</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="text-white font-medium">"{deleteModalEvent.title}"</span>? This will permanently cancel all associated student passes.
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3">
                            <button
                                onClick={() => setDeleteModalEvent(null)}
                                disabled={deletingId === deleteModalEvent._id}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModalEvent._id)}
                                disabled={deletingId === deleteModalEvent._id}
                                className="py-3 px-4 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition disabled:opacity-50 cursor-pointer"
                            >
                                {deletingId === deleteModalEvent._id ? "Deleting…" : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}