import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getEventById, updateEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"
import TicketCard from "../components/TicketCard"
import {
    Edit3,
    Calendar,
    MapPin,
    Users,
    AlignLeft,
    Type,
    ArrowLeft,
    AlertCircle,
    Eye,
    Save,
    Sparkles
} from "lucide-react"

export default function EditEvent() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [capacity, setCapacity] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEventById(id)
                if (data && data.event) {
                    setTitle(data.event.title)
                    setDescription(data.event.description)
                    setDate(data.event.date ? data.event.date.slice(0, 10) : "")
                    setLocation(data.event.location)
                    setCapacity(data.event.capacity ?? "")
                }
            } catch (err) {
                console.error("Failed to load event for edit:", err)
            } finally {
                setLoading(false)
            }
        }
        loadEvent()
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            const data = await updateEvent(id, {
                title,
                description,
                date,
                location,
                capacity: capacity === "" ? null : Number(capacity)
            })

            if (data && data.event) {
                navigate(`/events/${id}`)
            } else {
                setError(data?.message || "Failed to update event.")
            }
        } catch (err) {
            setError("Something went wrong updating the event.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-mono text-sm">Loading event details for editing...</p>
            </div>
        )
    }

    // Mock object for live preview
    const previewEvent = {
        _id: id,
        title: title || "Your Event Title",
        description: description || "Event description preview...",
        date: date || new Date().toISOString(),
        location: location || "Venue Location",
        capacity: capacity === "" ? null : Number(capacity),
        organizer: {
            name: user?.name || "Organizer"
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
                <Link
                    to={`/events/${id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel Editing</span>
                </Link>
                <span className="text-xs font-mono text-amber-400 tracking-wider">
                    EDIT MODE
                </span>
            </div>

            {/* 2-Column Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Form */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0c101a]/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-400/10 text-blue-300 border border-blue-400/20 mb-2">
                            <Edit3 className="w-3 h-3 text-blue-400" />
                            <span>UPDATE EVENT PASS</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                            Edit Event Details
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Modify date, location, or capacity. Changes will sync immediately across all attendee passes.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Event Title *
                            </label>
                            <div className="relative">
                                <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Description *
                            </label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition resize-none leading-relaxed"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date & Location Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                    Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition [color-scheme:dark]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                    Venue / Hall Location *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Capacity Cap <span className="text-slate-500 lowercase">(optional - blank for unlimited)</span>
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    placeholder="Unlimited"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    min="1"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{submitting ? "SAVING CHANGES…" : "SAVE CHANGES"}</span>
                            </button>
                            <Link
                                to={`/events/${id}`}
                                className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right Column: Real-Time Live Ticket Preview */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-mono text-slate-400">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>LIVE TICKET PASS PREVIEW</span>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#0c101a]/80 border border-white/10 shadow-2xl">
                        <TicketCard event={previewEvent} />
                    </div>
                </div>
            </div>
        </div>
    )
}