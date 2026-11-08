import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is the development server and build tool for the React app.
export default defineConfig({
  // The React plugin enables JSX transformation and React Fast Refresh in development.
  plugins: [react()],
  server: {
    // Keep the frontend port predictable for the backend CORS setting.
    port: 5173
  }
});
Here's the same config with more explanation and a few commonly useful options added. I took "more information" to mean more comments and settings, so tell me if you meant something else.

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is the development server and build tool for the React app.
// It serves files instantly during development and bundles them
// into optimized static files for production (npm run build).
export default defineConfig({
  // Plugins extend Vite's behavior.
  // The React plugin enables JSX transformation and
  // React Fast Refresh (edits appear in the browser without a full reload).
  plugins: [react()],

  // Development server settings (used by `npm run dev`).
  server: {
    // Keep the frontend port predictable so the backend's CORS
    // setting can allow requests from http://localhost:5173.
    port: 5173,

    // Fail with an error if 5173 is busy, instead of silently
    // switching to another port (which would break the CORS setting).
    strictPort: true,

    // Open the app in the browser automatically on startup.
    open: true,

    // Forward API calls to the backend during development.
    // A request to /api/movies is sent to http://localhost:5000/api/movies,
    // which avoids CORS issues. Change the target to your backend's port.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  // Production build settings (used by `npm run build`).
  build: {
    // Folder where the final files are generated (this is what Vercel deploys).
    outDir: 'dist',

    // Generate source maps so errors in production can be traced to the original code.
    sourcemap: true
  },

  // Settings for `npm run preview`, which serves the built app locally
  // so you can test it before deploying.
  preview: {
    port: 4173
  }
});
```

**What each section does**
- **plugins**: adds React support (JSX and Fast Refresh).
- **server**: controls the dev server, including the fixed port, auto-open, and the proxy to your backend.
- **build**: controls how the production bundle is created and where it goes.
- **preview**: runs the production build locally for testing.

**Notes**
- Remove the `proxy` block if your frontend calls external APIs directly (such as TMDB) or if you have no backend.
- If you use a proxy, call `/api/...` in your code instead of the full backend URL.
- Environment variables (such as API keys) go in a `.env` file and must start with `VITE_` to be readable in your code, for example `import.meta.env.VITE_API_KEY`.

Would you like me to add the same level of explanation to your other project files, such as `package.json` or `main.jsx`?

  # More on `vite.config.js`

Continuing the numbering from the earlier notes.

## 35. Extra Options Worth Knowing

```js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env files; the '' prefix loads ALL variables, not just VITE_ ones.
  // Use this only inside this config file, never expose the result to browser code.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // Base public path. Use '/' for Vercel/Netlify.
    // For GitHub Pages use '/repo-name/'.
    base: '/',

    resolve: {
      alias: {
        // Lets you write import Navbar from '@/components/Navbar'
        '@': path.resolve(__dirname, './src')
      }
    },

    server: {
      port: 5173,
      strictPort: true,
      host: true, // expose on your local network (test on a phone)
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      // Warn when a file is larger than 800 kB
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Split big libraries into separate files for better caching
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  };
});
```

Note: because `package.json` has `"type": "module"`, `__dirname` is not defined by default in some setups. If you get an error, use:

```js
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

## 36. Object vs Function Config

| Style | Use when |
|---|---|
| `defineConfig({ ... })` | Settings are the same in every mode |
| `defineConfig(({ mode }) => ({ ... }))` | Settings change between `development` and `production`, or you need `loadEnv` |

## 37. Vite Modes and `.env` Files

| File | Loaded when |
|---|---|
| `.env` | Always |
| `.env.local` | Always, ignored by Git (for personal values) |
| `.env.development` | `npm run dev` |
| `.env.production` | `npm run build` |

Check the mode in code with `import.meta.env.MODE`, `import.meta.env.DEV`, or `import.meta.env.PROD`.

## 38. Proxy vs Direct API Calls

| Approach | How it works | Best for |
|---|---|---|
| Proxy | Code calls `/api/...`, Vite forwards it | Your own backend in development |
| Direct call | Code uses the full URL from `VITE_API_URL` | External APIs (e.g. TMDB), or production |

The proxy only works during `npm run dev` and `npm run preview`. In production, the deployed app needs the real backend URL, and the backend must allow your site in its CORS settings.

## 39. Adding Vitest Testing

```js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true // use describe, it, expect without importing
  }
});
```

If your editor or Vitest complains about the `test` key, put `/// <reference types="vitest" />` at the very top of the file, or import `defineConfig` from `'vitest/config'` instead.

## 40. Common Config Problems

| Problem | Likely cause and fix |
|---|---|
| Blank page after deploying | Wrong `base` value; use `'/'` for most hosts |
| `404` when refreshing a route | Host needs a rewrite to `index.html` |
| Proxy not working | Request URL does not start with `/api`, or the backend is not running |
| `Port 5173 is already in use` | Another dev server is running; close it (`strictPort: true` causes this error on purpose) |
| `import.meta.env.X` is `undefined` | Variable missing the `VITE_` prefix, or the dev server was not restarted after editing `.env` |
| Config changes not applied | Restart `npm run dev`; config is read only at startup |

## 41. Revision Questions

13. What does `strictPort: true` do, and why is it useful here?
14. What problem does the `proxy` setting solve?
15. What does `resolve.alias` allow you to write?
16. What is the difference between `loadEnv` and `import.meta.env`?
17. Why does the proxy not work in production?
18. What does the `base` option control?
19. Why split `react` and `react-dom` into a `vendor` chunk?

### Answers

13. It makes Vite fail instead of choosing another port, so the backend's CORS setting (which expects 5173) keeps working.
14. It forwards API requests through the dev server, avoiding browser CORS errors.
15. Shorter import paths such as `@/components/Navbar` instead of `../../components/Navbar`.
16. `loadEnv` reads `.env` files inside the config file itself. `import.meta.env` is used in your app code and exposes only `VITE_` variables.
17. The proxy is a feature of the Vite dev/preview server. A deployed static site has no Vite server running.
18. The public path the app is served from, which affects how asset and script URLs are generated.
19. Libraries change rarely, so browsers can cache the vendor file while your own code changes between deployments.

I can combine these with the earlier `package.json` notes into one Word document if you'd like.
