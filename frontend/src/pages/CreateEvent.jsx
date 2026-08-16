import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"
import TicketCard from "../components/TicketCard"
import {
    Plus,
    Calendar,
    MapPin,
    Users,
    AlignLeft,
    Type,
    Sparkles,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    Eye
} from "lucide-react"

export default function CreateEvent() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [capacity, setCapacity] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            const data = await createEvent({
                title,
                description,
                date,
                location,
                capacity: capacity === "" ? null : Number(capacity)
            })

            if (data && data.event) {
                navigate(`/events/${data.event._id}`)
            } else {
                setError(data?.message || "Failed to publish event. Please check your inputs.")
            }
        } catch (err) {
            setError("Something went wrong while publishing your event.")
        } finally {
            setSubmitting(false)
        }
    }

    // Mock object for live preview
    const previewEvent = {
        _id: "preview-id",
        title: title || "Your Event Title Goes Here",
        description: description || "Detailed description of what attendees can expect, schedule highlights, and key speaker info...",
        date: date || new Date().toISOString(),
        location: location || "Campus Auditorium / Hall 101",
        capacity: capacity === "" ? null : Number(capacity),
        organizer: {
            name: user?.name || "Your Organization"
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Events Feed</span>
                </Link>
                <span className="text-xs font-mono text-amber-400 tracking-wider">
                    ORGANIZER STUDIO
                </span>
            </div>

            {/* 2-Column Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Form */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#141b2b]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>NEW GATHERING</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                            Host a Campus Event
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Publish your event details. Attendee digital ticket passes are generated automatically.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
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
                                    placeholder="e.g. Annual Campus Hackathon 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition"
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
                                    placeholder="Explain the schedule, rules, target audience, and perks..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition resize-none leading-relaxed"
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
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition [color-scheme:dark]"
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
                                        placeholder="e.g. Science Block Amphitheater"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                                Capacity Cap <span className="text-slate-500 lowercase">(optional - leave blank for open entry)</span>
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    placeholder="e.g. 150"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    min="1"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1422] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                                <span>{submitting ? "PUBLISHING EVENT…" : "PUBLISH CAMPUS EVENT"}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Real-Time Live Ticket Preview */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-mono text-slate-400">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>LIVE TICKET PASS PREVIEW</span>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#101624]/60 border border-white/10 shadow-xl">
                        <TicketCard event={previewEvent} />
                        <p className="text-[11px] font-mono text-slate-500 text-center mt-3">
                            This is how your event pass appears in the campus discovery feed.
                        </p>
                    </div>

                    {/* Pro-tip card */}
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1.5">
                        <p className="font-bold font-sans text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Organizer Best Practices
                        </p>
                        <p>
                            • Specify clear check-in times and venue directions to avoid campus confusion.
                        </p>
                        <p>
                            • If your venue has limited seats, always set an accurate capacity cap.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}