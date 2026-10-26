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


Your README already covers the main ideas, so I've added new sections that continue from section 8 without repeating it. You can paste them in directly.

---

## 9. Key Files Explained

**`src/services/api.js`: the API client with a global 401 handler**
```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // from .env
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
```

**`src/context/AuthContext.jsx`: login state shared across the app**
```jsx
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Restore the saved session on page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**`src/App.jsx`: route groups by role**
```jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Job seeker */}
  <Route path="/seeker" element={
    <ProtectedRoute roles={["jobseeker"]}><DashboardLayout /></ProtectedRoute>
  }>
    <Route index element={<SeekerDashboard />} />
    <Route path="applications" element={<MyApplications />} />
  </Route>

  {/* Employer and admin follow the same pattern */}
</Routes>
```

## 10. Typical API Endpoints Used

| Action | Method and endpoint |
| --- | --- |
| Register | `POST /auth/register` |
| Login | `POST /auth/login` |
| List jobs | `GET /jobs` |
| Job details | `GET /jobs/:id` |
| Post a job (employer) | `POST /jobs` |
| Apply for a job | `POST /applications` |
| My applications | `GET /applications/me` |
| Upload CV | `POST /profile/cv` |
| Manage users (admin) | `GET /admin/users` |

Check your backend repository for the exact paths, because they may differ slightly.

## 11. Role Permissions at a Glance

| Feature | Visitor | Job Seeker | Employer | Admin |
| --- | :-: | :-: | :-: | :-: |
| Browse jobs | ✅ | ✅ | ✅ | ✅ |
| Apply for jobs | ❌ | ✅ | ❌ | ❌ |
| Upload CV | ❌ | ✅ | ❌ | ❌ |
| Post and manage own jobs | ❌ | ❌ | ✅ | ✅ |
| View applicants | ❌ | ❌ | ✅ | ✅ |
| Manage all users and jobs | ❌ | ❌ | ❌ | ✅ |

## 12. Form Validation Example (Exercise Starter)

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const e = {};
  if (!email.trim()) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
  if (password.length < 6) e.password = "Password must be at least 6 characters";
  setErrors(e);
  return Object.keys(e).length === 0;
};

const handleSubmit = async (ev) => {
  ev.preventDefault();
  if (!validate()) return;
  // call the API here
};
```
Show each message under its field with `{errors.email && <small className="text-danger">{errors.email}</small>}`.

## 13. Loading and Error Pattern

```jsx
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const controller = new AbortController();
  api.get("/jobs", { signal: controller.signal })
    .then((res) => setJobs(res.data))
    .catch((err) => {
      if (err.name !== "CanceledError") setError("Could not load jobs.");
    })
    .finally(() => setLoading(false));
  return () => controller.abort(); // cleanup on unmount
}, []);
```

## 14. Testing Protected Routes (Vitest)

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

test("redirects guests to login", () => {
  render(
    <MemoryRouter initialEntries={["/seeker"]}>
      {/* AuthContext with user = null, then <App /> */}
    </MemoryRouter>
  );
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
```
Run with `npx vitest`.

## 15. Glossary

| Term | Meaning |
| --- | --- |
| **JWT** | A signed token that proves who the user is, sent with each request |
| **Context** | React's way to share data (like the logged-in user) without passing props |
| **Interceptor** | Axios code that runs on every request or response |
| **Protected route** | A page that only certain logged-in roles can open |
| **SPA** | Single-page app: one HTML file, with React Router changing the view |
| **FormData** | Browser object for sending files and form fields together |
| **CORS** | Browser rule controlling which origins may call the backend |

## 16. Quick Revision Questions

1. Why does the frontend store the JWT, and where is it stored?
2. What does an Axios interceptor do, and why use one for the token?
3. Why is hiding a route in the frontend not real security?
4. Why must Vite environment variables start with `VITE_`?
5. How does `FormData` differ from sending a normal JSON body?
6. What causes "logged out on refresh", and how is it fixed?

---

I can also put the complete README, with all sections merged and the heading formatting fixed, into a Word document. A few headings in your pasted text are missing their `##` markers, so I'd tidy those at the same time.

 Useful Checks

```bash
npm run build
npm audit --omit=dev
```
