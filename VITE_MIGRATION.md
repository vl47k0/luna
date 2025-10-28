# Migration from Create React App to Vite - Summary

## Completed Changes

### 1. Build Configuration Files

#### Created `vite.config.ts`

- Configured React plugin
- Set base path to `/luna/`
- Dev server port: 3001
- Build output directory: `build/`

#### Updated `tsconfig.json`

- Changed module resolution to `bundler`
- Updated target to `ES2020`
- Added `allowImportingTsExtensions`
- Removed CRA-specific settings

#### Updated `tsconfig.node.json`

- Changed module resolution to `bundler`
- Added `include` for vite.config.ts

#### Created `index.html` (root level)

- Moved from `public/index.html`
- Updated to use Vite's entry point: `<script type="module" src="/src/index.tsx"></script>`
- Removed `%PUBLIC_URL%` placeholders

### 2. Environment Variables

#### Created new `.env.*` files with VITE\_ prefix:

- `.env.local` - for local development
- `.env.mars` - for mars.georgievski.net deployment
- `.env.production` - for production (api.sod.com)

#### Updated all environment variable references:

- **Old**: `process.env.REACT_APP_*`
- **New**: `import.meta.env.VITE_*`

Files updated:

- `src/services/AuthService.ts`
- `src/utils/oidc.ts`

#### Created `src/vite-env.d.ts`

- TypeScript definitions for Vite environment variables
- Includes all required VITE\_\* variables

### 3. Package Dependencies

#### Removed:

- `react-scripts`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@types/jest`

#### Added:

- `vite@^5.4.0`
- `@vitejs/plugin-react@^4.3.1`
- `@mui/system` (explicit dependency for build)

#### Updated:

- `typescript`: ^4.9.5 → ^5.5.3
- `@types/node`: ^16.18.78 → ^20.14.10

### 4. Package.json Scripts

**Old:**

```json
{
  "start": "PORT=3001 react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test"
}
```

**New:**

```json
{
  "dev": "vite",
  "start": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

### 5. Type Definitions

- Updated `src/react-app-env.d.ts`: Changed from `react-scripts` to `vite/client`
- Created `src/vite-env.d.ts` with Vite-specific types

### 6. Test Files

- Removed `src/App.test.tsx` (Jest-based test)
- Removed `src/setupTests.ts`
- Testing migration to Vitest marked as TODO

### 7. Build Output

- Build output directory remains `build/` (configured in vite.config.ts)
- Dockerfile unchanged (already compatible)
- Nginx configuration unchanged (serves from same directory)

### 8. Documentation

Updated `.github/copilot-instructions.md`:

- Documented Vite as build tool
- Updated environment variable naming convention
- Added note about `import.meta.env` usage
- Updated build and dev commands
- Added Vitest migration TODO

## Installation Commands

```bash
# Remove old dependencies and install new ones
npm install --legacy-peer-deps

# Build for production
npm run build

# Start development server
npm start  # or npm run dev
```

## Key Migration Points

1. **Environment Variables**: All `REACT_APP_*` → `VITE_*` and `process.env` → `import.meta.env`
2. **Module Resolution**: Changed from `node` to `bundler` in tsconfig
3. **Entry Point**: HTML file moved from `public/` to root with module script
4. **Dev Server**: Still runs on port 3001 as configured
5. **Build Output**: Still outputs to `build/` directory for Docker compatibility

## Benefits of Vite

- **Faster dev server**: Instant HMR with native ESM
- **Faster builds**: Using esbuild and Rollup
- **Better DX**: Improved error messages and clearer output
- **Modern defaults**: ES modules, better tree-shaking
- **Smaller bundle**: More efficient code splitting

## Testing the Migration

```bash
# Development
npm start
# Visit: http://localhost:3001/luna/

# Production build
npm run build
# Preview: npm run preview

# Docker build (unchanged)
docker build -t luna .
```

## Known Issues / TODOs

1. **Testing**: Need to migrate from Jest to Vitest
2. **Bundle Size Warning**: Consider code-splitting for chunks >500KB
3. **Old .env files**: Can remove `*.env` files with `REACT_APP_*` prefix after migration is verified

## Rollback Plan

If issues arise, revert these commits and run:

```bash
git checkout HEAD~1 package.json package-lock.json
npm install
```

Keep the old environment files (localhost.env, etc.) until fully migrated.
