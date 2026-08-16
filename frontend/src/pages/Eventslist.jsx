import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { getEvents } from "../api/axios"
import { useAuth } from "../api/AuthContext"
import TicketCard from "../components/TicketCard"
import {
    Search,
    Filter,
    Calendar,
    Sparkles,
    Plus,
    X,
    Compass,
    SlidersHorizontal,
    Clock
} from "lucide-react"

export default function EventsList() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const { isOrganizer } = useAuth()

    const initialSearch = searchParams.get("search") || ""
    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [selectedTab, setSelectedTab] = useState("all") // all, upcoming, today
    const [sortBy, setSortBy] = useState("soonest") // soonest, latest, title

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getEvents()
                if (data && data.events) {
                    setEvents(data.events)
                }
            } catch (err) {
                console.error("Failed to load events:", err)
            } finally {
                setLoading(false)
            }
        }
        loadEvents()
    }, [])

    // Filter and Sort Logic
    const filteredEvents = useMemo(() => {
        return events
            .filter((event) => {
                const query = searchTerm.toLowerCase().trim()
                const matchesSearch =
                    !query ||
                    event.title?.toLowerCase().includes(query) ||
                    event.location?.toLowerCase().includes(query) ||
                    event.description?.toLowerCase().includes(query) ||
                    event.organizer?.name?.toLowerCase().includes(query)

                if (!matchesSearch) return false

                if (selectedTab === "upcoming") {
                    const eventDate = new Date(event.date)
                    const now = new Date()
                    return eventDate >= now
                }

                if (selectedTab === "today") {
                    const eventDate = new Date(event.date)
                    const now = new Date()
                    return (
                        eventDate.getDate() === now.getDate() &&
                        eventDate.getMonth() === now.getMonth() &&
                        eventDate.getFullYear() === now.getFullYear()
                    )
                }

                return true
            })
            .sort((a, b) => {
                if (sortBy === "soonest") {
                    return new Date(a.date) - new Date(b.date)
                }
                if (sortBy === "latest") {
                    return new Date(b.date) - new Date(a.date)
                }
                if (sortBy === "title") {
                    return (a.title || "").localeCompare(b.title || "")
                }
                return 0
            })
    }, [events, searchTerm, selectedTab, sortBy])

    function handleSearchChange(e) {
        const val = e.target.value
        setSearchTerm(val)
        if (val) {
            setSearchParams({ search: val })
        } else {
            setSearchParams({})
        }
    }

    function clearSearch() {
        setSearchTerm("")
        setSearchParams({})
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-3">
                        <Compass className="w-3.5 h-3.5" />
                        <span>CAMPUS EVENT FEED</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                        Explore Events
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-2">
                        Browse, filter, and claim your digital ticket passes for everything happening across campus.
                    </p>
                </div>

                {isOrganizer && (
                    <Link
                        to="/events/create"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition self-start md:self-auto shrink-0"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Host New Event</span>
                    </Link>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Search Input */}
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by title, venue, or host..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#141b2b] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Time Filter Tabs */}
                    <div className="md:col-span-4 flex items-center bg-[#141b2b] p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setSelectedTab("all")}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                                selectedTab === "all"
                                    ? "bg-amber-500 text-slate-950 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            All Events
                        </button>
                        <button
                            onClick={() => setSelectedTab("upcoming")}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                                selectedTab === "upcoming"
                                    ? "bg-amber-500 text-slate-950 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setSelectedTab("today")}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                                selectedTab === "today"
                                    ? "bg-amber-500 text-slate-950 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Today
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="md:col-span-2 relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full py-3 px-3.5 rounded-xl bg-[#141b2b] border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-amber-400/60 transition cursor-pointer appearance-none"
                        >
                            <option value="soonest">Sort: Soonest</option>
                            <option value="latest">Sort: Latest</option>
                            <option value="title">Sort: Title (A-Z)</option>
                        </select>
                        <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Filter Meta Info */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                    <span>
                        SHOWING {filteredEvents.length} {filteredEvents.length === 1 ? "EVENT" : "EVENTS"}
                    </span>
                    {(searchTerm || selectedTab !== "all") && (
                        <button
                            onClick={() => {
                                clearSearch()
                                setSelectedTab("all")
                            }}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* Events Grid */}
            <div className="mt-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-44 rounded-2xl bg-[#131b2c]/50 animate-pulse border border-white/5"
                            />
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEvents.map((event) => (
                            <TicketCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans">No Events Found</h3>
                        <p className="text-slate-400 text-sm mt-2">
                            We couldn't find any events matching your current search criteria.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    clearSearch()
                                    setSelectedTab("all")
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10"
                            >
                                Clear Filters
                            </button>
                            {isOrganizer && (
                                <Link
                                    to="/events/create"
                                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950"
                                >
                                    + Post This Event
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}