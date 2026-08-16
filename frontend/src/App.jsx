import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventsList from "./pages/Eventslist"
import EventDetail from "./pages/EventDetail"
import CreateEvent from "./pages/CreateEvent"
import EditEvent from "./pages/EditEvent"
import MyEvents from "./pages/Myevents"
import MyRSVPs from "./pages/Myrsvps"
import ProtectedRoute from "./api/ProtectedRoute"

export default function App() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0b0f17] bg-ambient-mesh bg-grid-pattern text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
            <Navbar />
            <main className="flex-1 w-full">
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
            </main>
            <Footer />
        </div>
    )
}