import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../api/axios"
import { useAuth } from "../api/AuthContext"

function CreateEvent() {
    const { isLoggedIn, isOrganizer, loading } = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [capacity, setCapacity] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // wait for the auth check to finish before deciding what to show —
    // otherwise there's a flash where "not allowed" shows before we know the real role
    if (loading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    if (!isLoggedIn) {
        return <p className="text-center mt-16 text-gray-500">You must be logged in to create an event.</p>
    }

    if (!isOrganizer) {
        return <p className="text-center mt-16 text-gray-500">Only organizers can create events.</p>
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        const data = await createEvent({
            title,
            description,
            date,
            location,
            capacity: capacity === "" ? null : Number(capacity)
        })

        setSubmitting(false)

        if (data && data.event) {
            navigate(`/events/${data.event._id}`)
        } else {
            setError(data?.message || "Something went wrong creating the event.")
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Create Event</h1>

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
                    {submitting ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    )
}

export default CreateEvent