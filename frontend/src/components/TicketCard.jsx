import { Link } from "react-router-dom"
import { Calendar, MapPin, Users, ArrowRight, UserCheck, Sparkles } from "lucide-react"
import { getEventCategory } from "../utils/eventTheme"

export default function TicketCard({ event, compact = false }) {
    if (!event) return null

    const category = getEventCategory(event)
    const dateObj = new Date(event.date)
    const isValidDate = !isNaN(dateObj.getTime())
    const day = isValidDate ? dateObj.getDate() : "—"
    const month = isValidDate ? dateObj.toLocaleString("default", { month: "short" }).toUpperCase() : "TBD"
    const weekday = isValidDate ? dateObj.toLocaleString("default", { weekday: "short" }).toUpperCase() : "DAY"
    const timeStr = isValidDate ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""

    return (
        <Link
            to={`/events/${event._id || event.id}`}
            className={`neon-card ${category.glowClass} group relative flex flex-col sm:flex-row min-h-42.5 overflow-hidden transition-all duration-300`}
        >
            {/* Left Date Stub */}
            <div className="relative flex sm:flex-col items-center justify-between sm:justify-center p-4 sm:p-6 bg-linear-to-br from-white/4 to-transparent sm:w-32 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 group-hover:from-white/[0.07] transition-colors">
                <div className="flex sm:flex-col items-center gap-2 sm:gap-0 text-center">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors">
                        {weekday}
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight my-0.5">
                        {day}
                    </span>
                    <span className="text-xs font-mono font-semibold tracking-wider text-slate-400">
                        {month}
                    </span>
                </div>

                <div className="sm:mt-3 px-2.5 py-0.5 rounded-full bg-white/6 border border-white/10 text-[10px] font-mono text-slate-300">
                    {timeStr || "ALL DAY"}
                </div>

                {/* Perforation Scallop Notches on Desktop */}
                <div className="hidden sm:block absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#06080e] border border-white/10 z-10" />
                <div className="hidden sm:block absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#06080e] border border-white/10 z-10" />
            </div>

            {/* Perforation Dashed Line */}
            <div className="hidden sm:block ticket-perforation-v my-3 opacity-30 group-hover:opacity-60 transition-opacity" />

            {/* Right / Main Content */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                    {/* Top Row Tags */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${category.badge}`}>
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                        </span>

                        {event.capacity !== null && event.capacity !== undefined ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span>Cap: {event.capacity}</span>
                            </span>
                        ) : (
                            <span className="text-[10px] font-mono font-semibold text-emerald-400">
                                Open Entry
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-sans">
                        {event.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>

                    {/* Description preview if not compact */}
                    {!compact && event.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Bottom Row Footer */}
                <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                            {event.organizer?.name?.[0] || "H"}
                        </div>
                        <span className="truncate max-w-35 font-medium text-slate-300">
                            {event.organizer?.name || "Campus Host"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold text-white/90 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                        <span>Get Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
