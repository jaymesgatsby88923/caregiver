/// <reference types="vite/client" />

// Tells TypeScript that VITE_API_URL exists on import.meta.env.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
