import { Link } from "react-router-dom"
import { Ticket, Sparkles, Heart, Compass, ShieldCheck } from "lucide-react"

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/[0.08] bg-[#05070c] text-slate-400 mt-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-dark-grid opacity-20 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5 inline-flex focus:outline-none group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                                <Ticket className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                                Event<span className="gradient-text-amber">Hub</span>
                            </span>
                        </Link>
                        
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            The pulse of campus life. Discover hackathons, cultural fests, sports tourneys, and club gatherings with instant digital ticket passes.
                        </p>

                        <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-1.5 rounded-full w-fit">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Campus Network Active · Real-time RSVPs</span>
                        </div>
                    </div>

                    {/* Quick Explore */}
                    <div>
                        <h4 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase mb-4">
                            Explore
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/events" className="hover:text-amber-400 transition">
                                    All Upcoming Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/events?search=hackathon" className="hover:text-amber-400 transition">
                                    Tech &amp; Hackathons
                                </Link>
                            </li>
                            <li>
                                <Link to="/events?search=music" className="hover:text-amber-400 transition">
                                    Music &amp; Cultural Fests
                                </Link>
                            </li>
                            <li>
                                <Link to="/events?search=workshop" className="hover:text-amber-400 transition">
                                    Workshops &amp; Seminars
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Platform & Account */}
                    <div>
                        <h4 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/events/create" className="hover:text-amber-400 transition">
                                    Host an Event
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-rsvps" className="hover:text-amber-400 transition">
                                    My Ticket Passes
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-events" className="hover:text-amber-400 transition">
                                    Organizer Console
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-amber-400 transition">
                                    Create Student Account
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} EventHub. Built for student creators and campus organizers.</p>
                    <p className="flex items-center gap-1">
                        Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus communities.
                    </p>
                </div>
            </div>
        </footer>
    )
}
