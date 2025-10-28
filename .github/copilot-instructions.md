# Luna Project - AI Coding Agent Instructions

## Project Overview

Luna is a React + TypeScript issue/process management SPA with OIDC authentication, WebSocket-based real-time updates (RTMS), and multi-backend service integration. The app is deployed via Docker/nginx with environment-based configuration.

## Architecture

### Service Layer Pattern

All backend communication follows a consistent service class pattern:

- **Instance per auth context**: Services are instantiated with `baseURL` and `token` in component refs (e.g., `useRef<SolutionService | null>(null)`)
- **Lazy initialization**: Services initialize in `useEffect` after user auth, checking `if (!serviceRef.current && user)`
- **Token-based**: All services receive `user.access_token` from OIDC `authService.getUser()`
- **Cleanup on unmount**: Set `serviceRef.current = null` in cleanup functions

**Service examples:**

- `SolutionService`: Issues/processes CRUD (`src/services/SolutionsService.ts`)
- `BookmarkService`: Bookmarks/units management (`src/services/BookmarkService.ts`)
- `CoreMasterService`: Core master data (agreements, duties, roles) (`src/services/CoreMasterService.ts`)
- `RTMSService`: WebSocket real-time messaging (`src/services/RTMSService.ts`)
- `DigitalAssetService`: Blob uploads with custom headers (`src/services/DigitalAssetService.ts`)

### Authentication Flow (OIDC)

- **OIDC client**: `oidc-client-ts` configured in `src/utils/oidc.ts`
- **Auth service**: Singleton `authService` handles sign-in, token renewal, silent refresh
- **Token renewal**: Automatic silent renewal via iframe (`/luna/silent-refresh.html`), triggers 5 min before expiry
- **Protected routes**: `ProtectedRoutes.tsx` checks auth, redirects to `authService.signIn()` if unauthenticated
- **Auth callback**: `/token` route handled by `Authenticate.tsx` component

### Real-Time Updates (RTMS)

- **WebSocket service**: `RTMSService` manages WSS connection to `wss://mars.georgievski.net/rtms/event`
- **Channel-based**: Instantiate with `new RTMSService(channel, token)`
- **Event handling**: Components register data listeners: `rtmsService.onData((events) => {...})`
- **Auto-reconnect**: Built-in exponential backoff (1s → 16s max delay)
- **Heartbeat**: Sends keepalive every 30 minutes

### Component-Service Integration

**Standard pattern** (see `IssueDetail.tsx`, `ProcessCardDetail.tsx`):

```tsx
const solutionBackendRef = useRef<SolutionService | null>(null);
const rtmsServiceRef = useRef<RTMSService | null>(null);

useEffect(() => {
  if (!solutionBackendRef.current && user) {
    solutionBackendRef.current = new SolutionService(
      baseURL,
      user.access_token
    );
  }
  return () => {
    solutionBackendRef.current = null;
  };
}, [user]);
```

### Environment Configuration

- **Build tool**: Vite (migrated from Create React App)
- **Multi-environment**: `.env.*` files for different deployments (`.env.local`, `.env.mars`, `.env.production`)
- **Required vars**: `VITE_BACKEND_API_URL`, `VITE_AUTHORITY`, `VITE_CLIENT_ID`, `VITE_REDIRECT_URI`, `VITE_SOD_SEC`
- **Env var access**: Use `import.meta.env.VITE_*` (not `process.env.REACT_APP_*`)
- **Runtime port**: Dev server runs on port 3001 (configured in `vite.config.ts`)

## Development Workflows

### Running Locally

```bash
npm install
npm start  # or npm run dev - starts Vite dev server on port 3001
```

### Building for Production

```bash
npm run build  # TypeScript check + Vite build to 'build' directory
npm run preview  # Preview production build locally
docker build -t luna .  # Multi-stage build: node → nginx
```

### Docker Deployment

- **Multi-stage Dockerfile**: Node build → nginx:stable-alpine runtime
- **Build output**: Vite builds to `build/` directory (configured in `vite.config.ts`)
- **Nginx config**: Serves SPA at `/luna/` path with fallback to `index.html`
- **Port**: Container listens on port 8000

### Linting

```bash
npm run lint  # ESLint 9 with flat config (eslint.config.js)
```

## Key Conventions

### Code Style

- **No comments**: Do not add comments to source code
- **No documentation strings**: Avoid JSDoc or inline documentation
- **Self-documenting code**: Use clear variable/function names instead

### TypeScript Strictness

- **TypeScript 5.6**: Latest stable version
- **Strict mode enabled**: `strict: true`, `strictNullChecks: true`
- **Explicit typing**: All service interfaces defined (e.g., `Issue`, `Process`, `Contact`)
- **Null handling**: Use `Type | null | undefined` and guard checks

### Async Patterns

- **Void promises**: Use `void fetchData()` for fire-and-forget async
- **Error boundaries**: Try-catch in components, log to console, set error state
- **Loading states**: Always pair async operations with `loading` state variable

### React Patterns

- **React 18.3**: Latest stable version with functional components
- **Functional components**: All components are `React.FC`
- **Refs for services**: Use `useRef` for service instances (not state)
- **Effect cleanup**: Return cleanup functions for services and subscriptions
- **Pagination**: Components manage `page`, `count`, `next`/`previous` state

### MUI Components

- **Design system**: Material-UI v5 (`@mui/material`, `@mui/icons-material`)
- **Tree views**: `@mui/x-tree-view` for hierarchical data (`IssueTreeComponent`, `ProcessTreeComponent`)
- **Data grids**: `@mui/x-data-grid` for tabular displays

### Routing

- **React Router v6**: Defined in `Routing.tsx`
- **Protected wrapper**: All main routes under `<ProtectedRoutes />` → `<Content />` wrapper
- **Default redirect**: Authenticated users redirect to `/issues` (handled in `App.tsx`)
- **Basename**: App served at `/luna` path (see `package.json` homepage)

## Critical Integration Points

### Issue-Process Hierarchy

- **Bi-directional links**: Issues contain processes, processes link back to parent issue
- **Tree visualization**: Use `fetchIssueTree(issueId)` and `fetchProcessTree(processId)` for ancestry
- **Constraints**: Issues support key-value constraints for filtering/cloning

### Digital Assets

- **Upload endpoint**: `DigitalAssetService.putBlob(container, {path, blobId}, data, headers)`
- **Custom headers**: Use `x-a2b-blob-content-disposition` and `x-a2b-blob-logical-name` for metadata
- **Hook pattern**: `useDigitalAssetService()` returns initialized service or null

### Bookmark System

- **Nested units**: Hierarchical units with `parent` relationships
- **Grouped links**: `fetchGroupedLinks()` returns units with their associated links
- **Per-unit view**: `fetchGroupedLinksForUnit(unitId)` for filtered context

## Common Pitfalls

1. **Service initialization**: Always check `if (!serviceRef.current)` before creating new instances
2. **Token expiry**: Don't cache tokens; always call `authService.getUser()` for fresh tokens
3. **RTMS cleanup**: Disconnect WebSocket in cleanup: `rtmsService.disconnect()`
4. **Pagination**: Extract page numbers from `next`/`previous` URLs using regex
5. **Environment vars**: All Vite env vars must start with `VITE_` and accessed via `import.meta.env.VITE_*`
6. **Module resolution**: Use ES modules syntax; Vite uses native ESM

## Testing

- **Test runner**: Vitest (TODO: migrate from Jest)
- **Testing library**: `@testing-library/react` for component tests
- **Coverage**: Run tests in watch mode during development
