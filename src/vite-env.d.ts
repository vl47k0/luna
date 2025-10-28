/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_BACKEND_RTMS: string;
  readonly VITE_BACKEND_RESOURCE: string;
  readonly VITE_SOD_SEC: string;
  readonly VITE_AUTHORITY: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_SCOPE: string;
  readonly VITE_RESPONSE_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
