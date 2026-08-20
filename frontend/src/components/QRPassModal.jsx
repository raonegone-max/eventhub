import { X, Calendar, MapPin, ShieldCheck, Sparkles, Printer } from "lucide-react"
import { getEventCategory, downloadCalendarEvent } from "../utils/eventTheme"

export default function QRPassModal({ rsvp, event, user, onClose }) {
    if (!rsvp && !event) return null

    const targetEvent = event || rsvp?.event
    if (!targetEvent) return null

    const category = getEventCategory(targetEvent)
    const dateObj = new Date(targetEvent.date)
    const isValidDate = !isNaN(dateObj.getTime())
    const fullDate = isValidDate
        ? dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
        : "Date TBA"
    const timeStr = isValidDate
        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "10:00 AM"

    const passId = (rsvp?._id || targetEvent._id || "EH2026").slice(-8).toUpperCase()
    const attendeeName = user?.name || rsvp?.user?.name || "Verified Student"

    function handlePrint() {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition"
                    aria-label="Close pass modal"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Top Holographic Strip */}
                <div className={`relative px-6 pt-6 pb-5 bg-gradient-to-br ${category.bg} border-b border-white/10 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${category.badge}`}>
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED ENTRY
                        </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-white font-sans line-clamp-1 pr-6">
                        {targetEvent.title}
                    </h2>
                    <p className="text-xs font-mono text-slate-300/80 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{targetEvent.location}</span>
                    </p>
                </div>

                {/* Middle Pass Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Key Metrics Strip */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#090d16]/80 border border-white/10 text-xs">
                        <div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Attendee Name</span>
                            <p className="font-bold text-white mt-0.5 truncate">{attendeeName}</p>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Pass Code</span>
                            <p className="font-mono font-bold text-amber-400 mt-0.5">#{passId}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
                            <div>
                                <span className="font-mono text-[10px] text-slate-400 uppercase">Schedule</span>
                                <p className="font-semibold text-white mt-0.5">{fullDate} • {timeStr}</p>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Container with Laser Scan Animation */}
                    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-slate-950 shadow-inner overflow-hidden">
                        {/* Glowing Laser Scanline */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_12px_#f59e0b] animate-scanline pointer-events-none" />

                        {/* Simulated Authentic High-Res QR SVG */}
                        <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                            {/* Position Detection Patterns (Top-Left, Top-Right, Bottom-Left) */}
                            <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                            <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                            <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                            
                            {/* Inner Data Cells */}
                            <rect x="35" y="5" width="5" height="5" />
                            <rect x="45" y="5" width="10" height="5" />
                            <rect x="60" y="5" width="5" height="5" />
                            <rect x="35" y="15" width="10" height="5" />
                            <rect x="50" y="15" width="5" height="5" />
                            <rect x="60" y="15" width="5" height="5" />
                            <rect x="35" y="25" width="5" height="5" />
                            <rect x="45" y="25" width="15" height="5" />

                            {/* Middle Matrix */}
                            <rect x="5" y="35" width="15" height="5" />
                            <rect x="25" y="35" width="10" height="5" />
                            <rect x="40" y="35" width="20" height="5" />
                            <rect x="65" y="35" width="15" height="5" />
                            <rect x="85" y="35" width="10" height="5" />

                            <rect x="5" y="45" width="5" height="5" />
                            <rect x="15" y="45" width="15" height="5" />
                            <rect x="35" y="45" width="5" height="5" />
                            <rect x="45" y="45" width="10" height="5" />
                            <rect x="60" y="45" width="15" height="5" />
                            <rect x="80" y="45" width="15" height="5" />

                            <rect x="5" y="55" width="25" height="5" />
                            <rect x="35" y="55" width="15" height="5" />
                            <rect x="55" y="55" width="5" height="5" />
                            <rect x="65" y="55" width="10" height="5" />
                            <rect x="80" y="55" width="15" height="5" />

                            {/* Bottom Matrix */}
                            <rect x="35" y="70" width="10" height="5" />
                            <rect x="50" y="70" width="15" height="5" />
                            <rect x="70" y="70" width="5" height="5" />
                            <rect x="80" y="70" width="15" height="5" />

                            <rect x="35" y="80" width="5" height="5" />
                            <rect x="45" y="80" width="20" height="5" />
                            <rect x="70" y="80" width="10" height="5" />
                            <rect x="85" y="80" width="10" height="5" />

                            <rect x="35" y="90" width="15" height="5" />
                            <rect x="55" y="90" width="10" height="5" />
                            <rect x="70" y="90" width="25" height="5" />
                        </svg>

                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-slate-800 uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Scan at Gate Check-in</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => downloadCalendarEvent(targetEvent)}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
                        >
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>Add to Cal (.ics)</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md font-sans transition"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print / Save Pass</span>
                        </button>
                    </div>
                </div>

                {/* Scalloped Perforation Footer */}
                <div className="px-6 py-3 bg-[#090d16] border-t border-white/10 text-center">
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                        EVENTHUB DIGITAL PASS ENGINE • NON-TRANSFERABLE
                    </span>
                </div>
            </div>
        </div>
    )
}
