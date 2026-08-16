import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../api/AuthContext"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        const success = await login({ email, password })

        if (success) {
            navigate("/")
        } else {
            setError("Invalid email or password")
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login