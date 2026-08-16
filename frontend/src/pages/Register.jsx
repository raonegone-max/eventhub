import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../api/AuthContext"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { register } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        const success = await register({ name, email, password })

        if (success) {
            navigate("/")
        } else {
            setError("Something went wrong. Try a different email.")
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Register</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

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
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register