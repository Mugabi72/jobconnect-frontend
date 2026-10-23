# JobConnect Frontend

This repository contains the React frontend for JobConnect, a learning project that shows students how to build a role-based job marketplace user interface with React, React Router, Axios, Bootstrap, and Vite.

The backend lives in a separate repository named `jobconnect-backend`.

## What This Frontend Teaches

- How React components are organized into pages, layouts, and reusable UI pieces.
- How React Router creates public and protected routes.
- How Axios calls a backend API and attaches a JWT automatically.
- How React Context stores authentication state.
- How role-based navigation changes for admin, employer, and job seeker users.
- How forms send normal JSON and file uploads with `FormData`.
- How Bootstrap can be combined with custom CSS for a responsive interface.

## Folder Structure

```text
jobconnect-frontend/
  src/
    components/            # Reusable UI components
    context/               # AuthContext for login state
    layouts/               # Shared dashboard layout
    pages/                 # Route-level screens
    services/              # Axios API client
    utils/                 # Small shared helpers
    App.jsx                # Route definitions
    main.jsx               # React entry point
    styles.css             # App-specific styling
  index.html
  vite.config.js
  package.json
  .env.example
```

## How The Frontend Works

1. `main.jsx` renders the app and wraps it in `BrowserRouter` and `AuthProvider`.
2. `AuthContext.jsx` restores the saved JWT and user from `localStorage`.
3. `api.js` attaches the JWT to API requests with an Axios interceptor.
4. `App.jsx` defines public routes and protected role-specific route groups.
5. Pages load data from the backend and render forms, tables, cards, and dashboards.

Requirements

- Node.js 18 or newer
- npm
- Running JobConnect backend at `http://localhost:5000`

Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Default `.env` value:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

Default Login Accounts

The backend seed data provides these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@jobconnect.com` | `password123` |
| Employer | `employer1@jobconnect.com` | `password123` |
| Employer | `employer2@jobconnect.com` | `password123` |
| Job Seeker | `seeker1@jobconnect.com` | `password123` |
| Job Seeker | `seeker2@jobconnect.com` | `password123` |

Main Screens

Public:

- Home
- Browse Jobs
- Job Details
- Login
- Register

Job seeker:

- Dashboard
- Profile and CV upload
- Apply for a job
- My Applications

Employer:

- Dashboard
- Company Profile
- Post Job
- My Jobs
- View Applicants

Admin:

- Dashboard
- Manage Users
- Manage Jobs
- Manage Applications

 Student Exercises

- Add client-side form validation messages for every required field.
- Add pagination and sorting to job browsing.
- Add a profile photo upload.
- Add toast notifications instead of inline alert messages.
- Add tests for protected route redirects.

 JobConnect Frontend: Additional Notes

 1. Key Concepts with Code

Axios interceptor (attaches the JWT)**
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Protected route with role check**
```jsx
function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
```

File upload (CV) with `FormData`
```js
const form = new FormData();
form.append("cv", file);
await api.post("/profile/cv", form); // Axios sets the multipart header itself
```

2. Request Flow

```text
Login form → POST /auth/login → backend returns { token, user }
→ AuthContext saves both in localStorage
→ interceptor adds the token to every later request
→ protected routes check user.role before rendering
```

## 3. Important Notes

- **Vite env variables** must start with `VITE_`, and you must restart `npm run dev` after editing `.env`.
- **Never commit `.env`**. Commit only `.env.example`.
- **Backend must run first**, otherwise every API call fails.
- **CORS**: the backend must allow `http://localhost:5173`.
- **Seed accounts** are for learning only. Change them in any real deployment.

 4. Security Notes

- Storing a JWT in `localStorage` is simple but exposed to XSS attacks. Production apps often use httpOnly cookies.
- Hiding a route in the frontend is not security. The backend must also check roles on every endpoint.
- Handle `401` responses globally by clearing the token and redirecting to login.
- Validate file type and size on both the client and the server.

5. Common Problems and Fixes

| Problem | Likely cause | Fix |
| --- | --- | --- |
| Network Error | Backend not running | Start `jobconnect-backend` on port 5000 |
| CORS error | Origin not allowed | Enable CORS for `localhost:5173` on the backend |
| Logged out on refresh | Auth state not restored | Read the token and user from `localStorage` in `AuthContext` |
| 401 Unauthorized | Missing or expired token | Log in again and check the interceptor |
| `undefined` env value | Missing `VITE_` prefix | Rename the variable and restart Vite |
| Blank page after deploy | Router refresh issue | Configure a SPA fallback to `index.html` |

 6. Best Practices

- Keep API calls in `services/`, not inside components.
- Show loading and error states for every request.
- Use `try/catch` around Axios calls and show friendly messages.
- Keep components small and reusable (cards, tables, forms).
- Use `useEffect` cleanup or abort controllers to avoid state updates after unmount.

 7. Deployment Tips

- Run `npm run build` and deploy the `dist/` folder (Vercel, Netlify).
- Set `VITE_API_URL` to the deployed backend URL in the host's environment settings.
- Add a rewrite rule so all routes serve `index.html`.

 8. More Exercises

- Auto-logout when the JWT expires.
- Add search and filters (location, job type, salary) to Browse Jobs.
- Add a "Save job" or bookmark feature for job seekers.
- Add application status badges (Pending, Reviewed, Accepted, Rejected).
- Use `React.lazy` and `Suspense` to code-split each role's pages.
- Add a dark mode toggle with Context.
- Write tests with Vitest and React Testing Library.

I can also turn this into a Word document or expand any section, such as a full `AuthContext` walkthrough or exam-style Q&A on the project.

 Useful Checks

```bash
npm run build
npm audit --omit=dev
```
