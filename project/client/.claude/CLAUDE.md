# Digital Coloring App (PWA) Context

## Project Overview

A senior-friendly Digital Coloring Progressive Web App (PWA) built with Next.js 14. Focus on accessibility, offline capabilities (IndexedDB), and smooth canvas interactions using the HTML Canvas API and Flood Fill algorithm.

## Critical Rules

### 1. Senior-First UX/UI (Strict)

- **Touch Targets:** Minimum 44x44pt (60x60pt preferred for primary actions).
- **Typography:** Minimum 16px font size. High contrast ratios.
- **Feedback:** Visual feedback for ALL interactions (active states, loading).
- **Simplicity:** No hidden gestures. Always show "Help" and "Undo" buttons.

### 2. PWA & Performance

- **Offline-First:** Critical features (Coloring, Saving) must work offline via Service Workers.
- **Loading:** First Contentful Paint < 1.5s.
- **Canvas:** Optimize rendering using `requestAnimationFrame`.
- **Assets:** Use WebP for images. Lazy load non-critical assets.

### 3. Code Style & Organization

- **Structure:** Feature-based directories (e.g., `features/canvas`, `features/gallery`).
- **State:** Use `Zustand` for global state (palette, history). Avoid complex Context chains.
- **Immutability:** Never mutate state directly.
- **Type Safety:** Strict TypeScript. No `any`. Use Zod for validation.

### 4. Supabase & Data

- **Security:** RLS (Row Level Security) enabled for all tables.
- **Storage:** Handle large image uploads via Supabase Storage, not DB fields.
- **Local:** Use IndexedDB for auto-saving drafts before syncing.

## File Structure

```text
src/
|-- app/                    # Next.js App Router
|   |-- (routes)/           # Route groups
|   |-- layout.tsx          # Root layout with PWA config
|-- components/
|   |-- ui/                 # shadcn/ui generic components
|   |-- canvas/             # Canvas-specific components
|   |-- layout/             # Header, Footer, Navigation
|-- lib/
|   |-- canvas/             # Core logic (Flood Fill, Zoom)
|   |-- supabase/           # Client/Server clients
|   |-- db/                 # IndexedDB utilities
|-- store/                  # Zustand stores (useColorStore, etc.)
|-- types/                  # Global type definitions

```

## Key Patterns

### Canvas Operation (Ref Pattern)

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  // Implementation...
}, []);
```

### Zustand State Management

```typescript
interface ColorState {
  selectedColor: string;
  history: string[]; // Undo stack
  setColor: (color: string) => void;
}

export const useColorStore = create<ColorState>(set => ({
  selectedColor: '#000000',
  history: [],
  setColor: color => set({ selectedColor: color }),
}));
```

### Supabase Data Fetching

```typescript
// Use typed client
const supabase = createClient();
const { data, error } = await supabase
  .from('templates')
  .select('*')
  .eq('difficulty', 'easy');

if (error) handleUserFriendlyError(error);
```

## Environment Variables

```bash
# App & PWA
NEXT_PUBLIC_APP_URL=[https://coloring-app.vercel.app](https://coloring-app.vercel.app)

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional
NEXT_PUBLIC_ANALYTICS_ID=

```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (checks PWA generation)
- `npm run test` - Run Vitest unit tests
- `npm run lint` - Check linting & formatting

## Git Workflow

- **Commits:** Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `perf:`)
- **Branches:** `feature/name` or `fix/issue`. No direct push to main.
- **Checklist:**
- [ ] Component accessibility checked (contrast/size)
- [ ] PWA manifest valid?
- [ ] Mobile viewport tested?
