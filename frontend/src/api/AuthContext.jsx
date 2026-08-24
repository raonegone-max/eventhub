import { createContext, useContext, useState, useEffect } from "react"
import api, { login as apiLogin, register as apiRegister, logout as apiLogout, googleAuth as apiGoogleAuth } from "./axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // on first load, ask the backend "is there a valid session cookie?"
    // this is what keeps you logged in after a page refresh
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await api.get("/auth/me")
                setUser(response.data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkSession()
    }, [])

    async function login(credentials) {
        const data = await apiLogin(credentials)

        if (data && data.user) {
            setUser(data.user)
            return true
        }

        return false
    }

    async function register(details) {
        const data = await apiRegister(details)

        if (data && data.user) {
            setUser(data.user)
            return true
        }

        return false
    }

    async function loginWithGoogle(credential, role) {
        const data = await apiGoogleAuth(credential, role)

        if (data && data.user) {
            setUser(data.user)
            return true
        }

        return false
    }

    async function logout() {
        await apiLogout()
        setUser(null)
    }

    const value = {
        user,
        loading,
        isLoggedIn: !!user,
        isOrganizer: user?.role === "organizer",
        login,
        register,
        loginWithGoogle,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook so components just do: const { user, isLoggedIn } = useAuth()
export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider")
    }

    return context
}