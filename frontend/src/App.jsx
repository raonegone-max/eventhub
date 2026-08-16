import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
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
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default App