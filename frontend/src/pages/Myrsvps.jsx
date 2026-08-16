import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyRSVPs, cancelRSVP } from "../api/axios"
import { useAuth } from "../api/AuthContext"

function MyRSVPs() {
    const { isLoggedIn, loading: authLoading } = useAuth()
    const [rsvps, setRsvps] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)

    useEffect(() => {
        async function loadRSVPs() {
            const data = await getMyRSVPs()

            if (data && data.rsvps) {
                setRsvps(data.rsvps)
            }

            setLoading(false)
        }

        if (isLoggedIn) {
            loadRSVPs()
        } else {
            setLoading(false)
        }
    }, [isLoggedIn])

    async function handleCancel(eventId) {
        setCancellingId(eventId)

        const data = await cancelRSVP(eventId)

        if (data && data.rsvp) {
            // remove it from the list locally, no need to re-fetch everything
            setRsvps((prev) => prev.filter((r) => r.event._id !== eventId))
        }

        setCancellingId(null)
    }

    if (authLoading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    if (!isLoggedIn) {
        return <p className="text-center mt-16 text-gray-500">You must be logged in to view this page.</p>
    }

    if (loading) {
        return <p className="text-center mt-16">Loading your RSVPs...</p>
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">My RSVPs</h1>

            {rsvps.length === 0 ? (
                <p className="text-gray-500">You haven't RSVP'd to any events yet.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {rsvps.map((rsvp) => (
                        <div key={rsvp._id} className="border rounded-lg p-4">
                            <Link to={`/events/${rsvp.event._id}`}>
                                <h2 className="text-lg font-semibold">{rsvp.event.title}</h2>
                                <p className="text-sm text-gray-500">
                                    {new Date(rsvp.event.date).toLocaleDateString()} · {rsvp.event.location}
                                </p>
                            </Link>

                            <button
                                onClick={() => handleCancel(rsvp.event._id)}
                                disabled={cancellingId === rsvp.event._id}
                                className="text-red-600 text-sm mt-2 disabled:opacity-50"
                            >
                                {cancellingId === rsvp.event._id ? "Cancelling..." : "Cancel RSVP"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyRSVPs