import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getEventById, createRSVP, deleteEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"

function EventDetail() {
    const { id } = useParams()
    const { user, isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rsvpMessage, setRsvpMessage] = useState("")
    const [rsvpLoading, setRsvpLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        async function loadEvent() {
            const data = await getEventById(id)

            if (data && data.event) {
                setEvent(data.event)
            }

            setLoading(false)
        }

        loadEvent()
    }, [id])

    async function handleRSVP() {
        setRsvpLoading(true)
        setRsvpMessage("")

        const data = await createRSVP(id)

        if (data && data.rsvp) {
            setRsvpMessage("You're going! ✅")
        } else if (data && data.message) {
            setRsvpMessage(data.message)
        } else {
            setRsvpMessage("Something went wrong. Try again.")
        }

        setRsvpLoading(false)
    }

    async function handleDelete() {
        const confirmed = window.confirm("Delete this event? This can't be undone.")

        if (!confirmed) {
            return
        }

        setDeleting(true)

        const data = await deleteEvent(id)

        if (data && data.message === "Event deleted successfully") {
            navigate("/my-events")
        } else {
            setDeleting(false)
            alert(data?.message || "Something went wrong deleting the event.")
        }
    }

    if (loading) {
        return <p className="text-center mt-16">Loading event...</p>
    }

    if (!event) {
        return <p className="text-center mt-16 text-gray-500">Event not found.</p>
    }

    // this event's organizer id, compared against the LOGGED-IN user's id —
    // not just "is this user an organizer", but "is this THEIR event"
    const isOwner = isLoggedIn && user?.id === event.organizer?._id

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <Link to="/events" className="text-sm text-blue-600">
                ← Back to events
            </Link>

            <div className="flex justify-between items-start mt-4">
                <h1 className="text-2xl font-bold">{event.title}</h1>

                {isOwner && (
                    <div className="flex gap-3">
                        <Link
                            to={`/events/${event._id}/edit`}
                            className="text-sm text-blue-600"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-sm text-red-600 disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>

            <p className="text-gray-500 mt-1">
                {new Date(event.date).toLocaleDateString()} · {event.location}
            </p>

            <p className="text-gray-400 text-sm mt-1">
                Organized by {event.organizer?.name}
            </p>

            {event.capacity !== null && (
                <p className="text-sm text-gray-400">Capacity: {event.capacity}</p>
            )}

            <p className="mt-4">{event.description}</p>

            <div className="mt-6">
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={handleRSVP}
                            disabled={rsvpLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {rsvpLoading ? "RSVPing..." : "RSVP to this event"}
                        </button>

                        {rsvpMessage && (
                            <p className="mt-2 text-sm">{rsvpMessage}</p>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-gray-500">
                        <Link to="/login" className="text-blue-600">Log in</Link> to RSVP.
                    </p>
                )}
            </div>
        </div>
    )
}

export default EventDetail