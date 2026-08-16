import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getEvents } from "../api/axios"

function EventsList() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadEvents() {
            const data = await getEvents()

            if (data && data.events) {
                setEvents(data.events)
            }

            setLoading(false)
        }

        loadEvents()
    }, [])

    if (loading) {
        return <p className="text-center mt-16">Loading events...</p>
    }

    if (events.length === 0) {
        return <p className="text-center mt-16 text-gray-500">No events yet.</p>
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>

            <div className="flex flex-col gap-4">
                {events.map((event) => (
                    <Link
                        to={`/events/${event._id}`}
                        key={event._id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                        <h2 className="text-lg font-semibold">{event.title}</h2>
                        <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()} · {event.location}
                        </p>
                        <p className="text-sm text-gray-400">
                            Organized by {event.organizer?.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default EventsList