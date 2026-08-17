import axios from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

export async function register({ name, email, password, role }) {

    try {
        const response = await api.post('/auth/register', {
            name, email, password, role
        })

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.post("/auth/logout")

        return response.data

    } catch (err) {
        console.log(err)
    }
}

export async function getEvents() {
    try {
        const response = await api.get("/events")
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function getEventById(id) {
    try {
        const response = await api.get(`/events/${id}`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function createRSVP(eventId) {
    try {
        const response = await api.post("/rsvp", { eventId })
        return response.data
    } catch (err) {
        console.log(err)
        return err.response?.data
    }
}

export async function createEvent({ title, description, date, location, capacity }) {
    try {
        const response = await api.post("/events", {
            title, description, date, location, capacity
        })
        return response.data
    } catch (err) {
        console.log(err)
        return err.response?.data
    }
}

export async function getMyEvents() {
    try {
        const response = await api.get("/events/mine")
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function getMyRSVPs() {
    try {
        const response = await api.get("/rsvp/my")
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function cancelRSVP(eventId) {
    try {
        const response = await api.delete(`/rsvp/${eventId}`)
        return response.data
    } catch (err) {
        console.log(err)
        return err.response?.data
    }
}

export async function updateEvent(id, { title, description, date, location, capacity }) {
    try {
        const response = await api.put(`/events/${id}`, {
            title, description, date, location, capacity
        })
        return response.data
    } catch (err) {
        console.log(err)
        return err.response?.data
    }
}

export async function deleteEvent(id) {
    try {
        const response = await api.delete(`/events/${id}`)
        return response.data
    } catch (err) {
        console.log(err)
        return err.response?.data
    }
}

export default api