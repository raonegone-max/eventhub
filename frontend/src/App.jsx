import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventsList from "./pages/EventsList"
import EventDetail from "./pages/EventDetail"
import CreateEvent from "./pages/CreateEvent"
import EditEvent from "./pages/EditEvent"
import MyEvents from "./pages/MyEvents"
import MyRSVPs from "./pages/MyRSVPs"
import ProtectedRoute from "./api/ProtectedRoute"
import { useAuth } from "./api/AuthContext"

function Home() {
    const { user, isLoggedIn, isOrganizer, loading, logout } = useAuth()

    if (loading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    return (
        <div className="max-w-sm mx-auto mt-16 text-center">
            <h1 className="text-2xl font-bold">EventHub</h1>

            {isLoggedIn ? (
                <div className="mt-4">
                    <p>Logged in as {user.name} ({user.role})</p>
                    {isOrganizer && <p className="text-green-600">You can create events</p>}
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded mt-3"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <p className="mt-4 text-gray-500">Not logged in</p>
            )}

            <div className="flex flex-col gap-2 mt-6">
                <Link to="/events" className="text-blue-600">
                    Browse Events →
                </Link>

                {isOrganizer && (
                    <>
                        <Link to="/events/create" className="text-blue-600">
                            + Create an Event
                        </Link>
                        <Link to="/my-events" className="text-blue-600">
                            My Events (organizer)
                        </Link>
                    </>
                )}

                {isLoggedIn && !isOrganizer && (
                    <Link to="/my-rsvps" className="text-blue-600">
                        My RSVPs
                    </Link>
                )}
            </div>
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />

            <Route
                path="/events/create"
                element={
                    <ProtectedRoute requireOrganizer>
                        <CreateEvent />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/events/:id/edit"
                element={
                    <ProtectedRoute requireOrganizer>
                        <EditEvent />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-events"
                element={
                    <ProtectedRoute requireOrganizer>
                        <MyEvents />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-rsvps"
                element={
                    <ProtectedRoute>
                        <MyRSVPs />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App