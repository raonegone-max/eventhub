import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"

// wrap any route element in this to require login (and optionally a specific role)
// usage: <Route path="/my-events" element={<ProtectedRoute requireOrganizer><MyEvents /></ProtectedRoute>} />
function ProtectedRoute({ children, requireOrganizer = false }) {
    const { isLoggedIn, isOrganizer, loading } = useAuth()
    const location = useLocation()

    // wait for the initial /auth/me check to finish — otherwise we'd redirect
    // to login for a split second even on a valid, already-logged-in session
    if (loading) {
        return <p className="text-center mt-16">Loading...</p>
    }

    if (!isLoggedIn) {
        // 'state' carries WHERE they were trying to go, so Login can send them
        // back afterwards instead of always dropping them on the home page
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requireOrganizer && !isOrganizer) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute