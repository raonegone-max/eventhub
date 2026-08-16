import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyEvents } from "../api/axios"
import { useAuth } from "../api/AuthContext"

function MyEvents() {
    const { isLoggedIn, isOrganizer, loading: authLoading } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadEvents() {
            const data = await getMyEvents()

            if (data && data.events) {
                setEvents(data.events)
            }

            setLoading(false)
        }

        // only bother fetching once we know the user IS an organizer —
        // otherwise this would hit a 403 pointlessly
        if (isOrganizer) {
            loadEvents()
        } else {
            setLoading(false)
        }
    }, [isOrganizer])

    if (authLoading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    if (!isLoggedIn) {
        return <p className="text-center mt-16 text-gray-500">You must be logged in to view this page.</p>
    }

    if (!isOrganizer) {
        return <p className="text-center mt-16 text-gray-500">Only organizers have events to manage.</p>
    }

    if (loading) {
        return <p className="text-center mt-16">Loading your events...</p>
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                <Link to="/events/create" className="text-blue-600 text-sm">
                    + Create new
                </Link>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-500">You haven't created any events yet.</p>
            ) : (
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
                            {event.capacity !== null && (
                                <p className="text-sm text-gray-400">Capacity: {event.capacity}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyEvents