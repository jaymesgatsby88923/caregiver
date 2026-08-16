// One place to read frontend config. Vite only exposes vars that start with VITE_.
// Local `npm run dev` uses .env (localhost). `vite build` / Cloudflare uses .env.production (Render).

function getApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL;

  // Production builds must have this set, otherwise the live site would call localhost.
  if (import.meta.env.PROD && !raw) {
    throw new Error("VITE_API_URL is missing. Set it in .env.production or Cloudflare.");
  }

  // Local default so you can still run the app without creating a .env file.
  return (raw ?? "http://127.0.0.1:8000").replace(/\/$/, "");
}

export const env = {
  apiUrl: getApiUrl(),
};
