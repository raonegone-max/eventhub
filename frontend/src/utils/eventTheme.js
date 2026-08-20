// Helper to intelligently detect category and theme for events
export const EVENT_CATEGORIES = [
    {
        id: "all",
        label: "All Gatherings",
        icon: "✨",
        color: "amber",
        glowClass: "glow-bottom-amber",
        badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
        accent: "#ff6b00"
    },
    {
        id: "tech",
        label: "Tech & Hackathons",
        icon: "💻",
        keywords: ["hackathon", "tech", "code", "coding", "ai", "web", "developer", "cyber", "robotics", "dev", "data", "cloud"],
        color: "blue",
        glowClass: "glow-bottom-blue",
        badge: "bg-blue-400/10 text-blue-300 border-blue-400/20",
        accent: "#0070f3"
    },
    {
        id: "cultural",
        label: "Music & Cultural",
        icon: "🎵",
        keywords: ["music", "concert", "fest", "cultural", "dance", "dj", "night", "gala", "band", "singing", "drama", "theatre", "art"],
        color: "rose",
        glowClass: "glow-bottom-rose",
        badge: "bg-rose-400/10 text-rose-300 border-rose-400/20",
        accent: "#f43f5e"
    },
    {
        id: "workshop",
        label: "Workshops & Talks",
        icon: "💡",
        keywords: ["workshop", "talk", "seminar", "speaker", "career", "bootcamp", "class", "masterclass", "lecture", "summit", "finance", "design"],
        color: "emerald",
        glowClass: "glow-bottom-emerald",
        badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
        accent: "#00e676"
    },
    {
        id: "sports",
        label: "Sports & Gaming",
        icon: "🏆",
        keywords: ["sports", "game", "gaming", "esports", "football", "cricket", "tournament", "chess", "badminton", "basketball", "athletics", "fifa", "valorant"],
        color: "amber",
        glowClass: "glow-bottom-amber",
        badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
        accent: "#ff6b00"
    },
    {
        id: "social",
        label: "Social & Clubs",
        icon: "🤝",
        keywords: ["meetup", "social", "club", "party", "freshers", "gathering", "fair", "orientation", "mixer", "alumni"],
        color: "purple",
        glowClass: "glow-bottom-purple",
        badge: "bg-purple-400/10 text-purple-300 border-purple-400/20",
        accent: "#8b5cf6"
    }
]

export function getEventCategory(event) {
    if (!event) return EVENT_CATEGORIES[1]
    const text = `${event.title || ""} ${event.description || ""}`.toLowerCase()

    for (let i = 1; i < EVENT_CATEGORIES.length; i++) {
        const cat = EVENT_CATEGORIES[i]
        if (cat.keywords && cat.keywords.some((kw) => text.includes(kw))) {
            return cat
        }
    }

    // Default fallback
    return EVENT_CATEGORIES[1]
}

// Generate an iCal (.ics) file to download
export function downloadCalendarEvent(event) {
    if (!event) return

    const eventDate = new Date(event.date)
    const isValid = !isNaN(eventDate.getTime())
    const startDate = isValid ? eventDate : new Date()
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

    function formatDate(d) {
        return d.toISOString().replace(/-|:|\.\d+/g, '')
    }

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//EventHub Campus//NONSGML v1.0//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:${event.title || "Campus Event"}`,
        `DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}`,
        `LOCATION:${event.location || "Campus"}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `STATUS:CONFIRMED`,
        `URL:${window.location.origin}/events/${event._id || ""}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute("download", `${(event.title || "event").toLowerCase().replace(/[^a-z0-9]/gi, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
