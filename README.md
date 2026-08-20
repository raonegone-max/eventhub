# EventHub 🎟️

A full-stack campus event management and RSVP platform. Organizers post events; students discover them, RSVP, and manage their passes — all with role-based access, capacity limits, and a real production deployment.

**Live site:** https://eventhub-khaki-five.vercel.app
**Backend API:** https://eventhub-1m24.onrender.com

---

## What it does

- **Two user roles, chosen at signup** — Students browse and RSVP to events; Organizers create, edit, and manage events they host.
- **Full event lifecycle** — create, browse, search/filter/sort, view details, edit, delete — all scoped so organizers can only modify their own events.
- **RSVP system** — join an event, cancel, and re-join later; capacity limits are enforced server-side, and duplicate RSVPs are blocked.
- **Secure authentication** — JWT-based sessions stored in HTTP-only cookies, with real logout via token blacklisting (not just clearing the cookie client-side).
- **Protected routes** — pages requiring login or organizer status redirect automatically, and send the user back to where they were headed after logging in.
- **Personal dashboards** — "My Events" for organizers, "My RSVPs" for students.

## Tech stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, lucide-react
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

## Architecture

```
eventhub/
├── backend/
│   └── src/
│       ├── config/        # database connection
│       ├── controllers/   # request handlers (auth, event, rsvp)
│       ├── middlewares/   # JWT auth + role-based access control
│       ├── models/        # Mongoose schemas (User, Event, RSVP, BlacklistToken)
│       └── routes/        # Express route definitions
└── frontend/
    └── src/
        ├── api/           # axios instance, AuthContext, ProtectedRoute
        ├── components/    # Navbar, Footer, TicketCard
        └── pages/         # route-level views
```

### Data model

Three core collections, with `RSVP` modeled as its own collection (not an array on `Event`) to properly support the many-to-many relationship between users and events, avoid unbounded array growth, and allow per-RSVP metadata (status, timestamps).

```
User (organizer) ──creates──> Event
User (student)   ──RSVPs to──> Event   (via RSVP collection)
```

### Auth flow

1. Register/login issues a JWT, stored as an HTTP-only cookie (never exposed to JavaScript, protecting against XSS token theft).
2. Every protected request passes through `authUser` middleware, which verifies the token and checks it against a blacklist (populated on logout) — meaning logout genuinely invalidates the session rather than just deleting a cookie the browser could still resend.
3. Role-gated routes (creating/editing events) add an `isOrganizer` middleware layer on top.
4. In production, the cookie is set with `Secure` and `SameSite=None`, since frontend and backend are deployed on different domains — required for the cookie to survive cross-site requests at all.

## Running locally

**Backend**
```bash
cd backend
npm install
# create a .env file with:
#   MONGO_URI=your_mongodb_connection_string
#   JWT_SECRET=any_long_random_string
#   PORT=3000
#   FRONTEND_URL=http://localhost:5173
node server.js
```

**Frontend**
```bash
cd frontend
npm install
# create a .env file with:
#   VITE_API_URL=http://localhost:3000
npm run dev
```

## What I'd add next

- Email notifications when RSVPing or when an event you're attending is updated
- Image uploads for event banners
- Waitlist support once an event hits capacity
- Attendee check-in via QR code scan at the event

---

Built by [Aryan Gupta](https://github.com/raonegonemax) as a first solo full-stack project — designed, built, debugged, and deployed end to end.
