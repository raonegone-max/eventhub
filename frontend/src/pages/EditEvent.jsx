import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getEventById, updateEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"

function EditEvent() {
    const { id } = useParams()
    const { user, isLoggedIn, loading: authLoading } = useAuth()
    const navigate = useNavigate()

    const [event, setEvent] = useState(null)
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
            const data = await getEventById(id)

            if (data && data.event) {
                setEvent(data.event)
                setTitle(data.event.title)
                setDescription(data.event.description)
                // convert the ISO date string to yyyy-mm-dd for the <input type="date">
                setDate(data.event.date.slice(0, 10))
                setLocation(data.event.location)
                setCapacity(data.event.capacity ?? "")
            }

            setLoading(false)
        }

        loadEvent()
    }, [id])

    if (authLoading || loading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    if (!event) {
        return <p className="text-center mt-16 text-gray-500">Event not found.</p>
    }

    const isOwner = isLoggedIn && user?.id === event.organizer?._id

    if (!isOwner) {
        return <p className="text-center mt-16 text-gray-500">You're not allowed to edit this event.</p>
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        const data = await updateEvent(id, {
            title,
            description,
            date,
            location,
            capacity: capacity === "" ? null : Number(capacity)
        })

        setSubmitting(false)

        if (data && data.event) {
            navigate(`/events/${id}`)
        } else {
            setError(data?.message || "Something went wrong updating the event.")
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg">
            <Link to={`/events/${id}`} className="text-sm text-blue-600">
                ← Cancel
            </Link>

            <h1 className="text-2xl font-bold mb-4 mt-2">Edit Event</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    rows={3}
                    required
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    placeholder="Capacity (leave blank for unlimited)"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="border p-2 rounded"
                    min="1"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    )
}

export default EditEvent