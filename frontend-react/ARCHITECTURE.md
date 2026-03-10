# Frontend Architecture

## Overview

This React frontend follows a component-based architecture with clear separation of concerns and TypeScript for type safety.

## Architecture Principles

### 1. Component-Based Architecture
- **Presentational Components**: Focus on UI rendering (ItineraryCard, AccommodationList, etc.)
- **Container Components**: Handle data fetching and business logic (Dashboard, ItineraryDetail)
- **Layout Components**: Provide consistent page structure (Layout)

### 2. Separation of Concerns

```
┌─────────────────────────────────────────────┐
│              Pages (Routes)                 │
│  Dashboard, CreateItinerary, ItineraryDetail│
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Components (Presentation)            │
│   ItineraryCard, ItineraryForm, Lists      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Hooks (State Logic)                │
│      useItineraries, useItinerary           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Services (API Layer)                 │
│  itineraryApi, accommodationApi, etc.       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
              Backend API
```

### 3. Type Safety

All components, hooks, and API calls are fully typed:

```typescript
// Domain models
interface Itinerary { ... }
interface Accommodation { ... }

// DTOs for API
interface CreateItineraryDTO { ... }

// Component props
interface ItineraryCardProps { ... }
```

## Key Design Patterns

### Custom Hooks Pattern

Encapsulates data fetching and state management:

```typescript
const useItinerary = (id: string) => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch logic...
  
  return { itinerary, loading, error, updateItinerary };
};
```

**Benefits:**
- Reusable data fetching logic
- Consistent error handling
- Automatic refetching support
- Type-safe returns

### Service Layer Pattern

API calls abstracted into service modules:

```typescript
export const itineraryApi = {
  getAll: async (): Promise<Itinerary[]> => { ... },
  getById: async (id: string): Promise<Itinerary> => { ... },
  create: async (data: CreateItineraryDTO): Promise<Itinerary> => { ... },
};
```

**Benefits:**
- Single source of truth for API endpoints
- Easy to mock for testing
- Centralized error handling
- Type-safe requests/responses

### Composition Pattern

Components composed from smaller, reusable parts:

```typescript
<ItineraryDetail>
  <ProgressTracker />
  <AccommodationList />
  <ActivityList />
  <TransportList />
</ItineraryDetail>
```

## State Management

### Local Component State
Used for UI-specific state (form inputs, modals, etc.)

```typescript
const [formData, setFormData] = useState<CreateItineraryDTO>({ ... });
```

### Custom Hooks for Shared State
Used for data shared across components:

```typescript
const { itineraries, loading } = useItineraries();
```

### URL State (React Router)
Used for navigation and route parameters:

```typescript
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();
```

## Data Flow

### Read Flow (Fetching Data)

```
Component → Custom Hook → Service → API → Backend
                ↓
           State Update
                ↓
           Re-render
```

### Write Flow (Mutations)

```
User Action → Event Handler → Service → API → Backend
                                   ↓
                          Success/Error Response
                                   ↓
                           State Update/Navigation
```

## Routing Structure

```
/                          → Dashboard (list all itineraries)
/itineraries/new           → CreateItinerary form
/itineraries/:id           → ItineraryDetail view
/itineraries/:id/edit      → EditItinerary form
```

## Error Handling

### Three Levels of Error Handling:

1. **Service Level**: HTTP errors caught and propagated
2. **Hook Level**: Errors stored in state for component access
3. **Component Level**: Errors displayed to user with appropriate UI

```typescript
try {
  const data = await itineraryApi.create(formData);
  navigate(`/itineraries/${data.id}`);
} catch (err) {
  console.error('Failed to create:', err);
  alert('Failed to create itinerary. Please try again.');
}
```

## Performance Considerations

### Code Splitting
- React.lazy() for route-based splitting (future enhancement)
- Dynamic imports for large dependencies

### Memoization
- useCallback for stable function references
- useMemo for expensive computations (when needed)

### Network Optimization
- Axios interceptors for request/response handling
- Automatic retry logic (future enhancement)
- Request cancellation for unmounted components

## Styling Strategy

### CSS Modules Approach
- Component-specific CSS files
- No global namespace pollution
- Dark/light mode support via media queries

### Responsive Design
- Mobile-first approach
- CSS Grid for layouts
- Flexbox for component internals
- Media queries for breakpoints

## Testing Strategy (Future)

### Unit Tests
- Components with React Testing Library
- Hooks with @testing-library/react-hooks
- Services with Jest

### Integration Tests
- User flows with Cypress/Playwright
- API integration with MSW (Mock Service Worker)

### E2E Tests
- Critical paths (create itinerary, view details)
- Cross-browser testing

## Security Considerations

### XSS Prevention
- React's automatic escaping
- Sanitize user input when necessary

### CSRF Protection
- Token-based authentication (future)
- SameSite cookies

### API Security
- HTTPS only in production
- Authentication headers
- Rate limiting (backend)

## Build & Deployment

### Development
```bash
npm run dev  # Vite dev server with HMR
```

### Production
```bash
npm run build    # TypeScript compile + Vite build
npm run preview  # Preview production build
```

### Deployment Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFront, Cloudflare
- **Container**: Docker + Nginx

## Future Enhancements

### State Management
- Consider Zustand/Jotai for complex global state
- React Query for advanced server state management

### Performance
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Service Worker for offline support

### Developer Experience
- Storybook for component documentation
- Prettier for code formatting
- Husky for git hooks
- Automated testing pipeline

## References

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)
