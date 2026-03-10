# Travel Itinerary Planner - React Frontend

A modern, responsive travel itinerary planning application built with React, TypeScript, and Vite.

## Features

✨ **Core Features:**
- Create and manage multiple travel itineraries
- Add accommodations with booking details
- Plan activities with categories and scheduling
- Track transportation between locations
- Visual progress tracking for trip planning
- Real-time countdown to trip dates
- Responsive design for mobile and desktop

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with modern features

## Project Structure

```
frontend-react/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout with header/footer
│   │   ├── ItineraryCard.tsx
│   │   ├── ItineraryForm.tsx
│   │   ├── AccommodationList.tsx
│   │   ├── ActivityList.tsx
│   │   ├── TransportList.tsx
│   │   └── ProgressTracker.tsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard view
│   │   ├── CreateItinerary.tsx
│   │   ├── EditItinerary.tsx
│   │   └── ItineraryDetail.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useItinerary.ts  # Itinerary data management
│   ├── services/            # API service layer
│   │   └── api.ts           # Axios configuration and API calls
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Domain models and DTOs
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (default: `http://localhost:8000`)

## Getting Started

### 1. Install Dependencies

```bash
cd frontend-react
npm install
# or
yarn install
```

### 2. Configure Environment

The app is configured to proxy API requests to `http://localhost:8000` by default. 
If your backend runs on a different port, update `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
    },
  },
}
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

Built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## API Integration

The frontend expects the following API endpoints:

### Itineraries
- `GET /api/itineraries` - List all itineraries
- `GET /api/itineraries/:id` - Get single itinerary
- `POST /api/itineraries` - Create itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

### Accommodations
- `GET /api/itineraries/:id/accommodations` - List accommodations
- `POST /api/accommodations` - Create accommodation
- `PUT /api/accommodations/:id` - Update accommodation
- `DELETE /api/accommodations/:id` - Delete accommodation

### Activities
- `GET /api/itineraries/:id/activities` - List activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Transport
- `GET /api/itineraries/:id/transports` - List transport
- `POST /api/transports` - Create transport
- `PUT /api/transports/:id` - Update transport
- `DELETE /api/transports/:id` - Delete transport

## Key Components

### Dashboard
Main landing page showing all itineraries in a grid layout with quick actions.

### ItineraryDetail
Detailed view of a single itinerary with:
- Itinerary information
- Accommodations list
- Activities timeline
- Transportation details
- Progress tracker sidebar

### ItineraryForm
Reusable form component for creating/editing itineraries with validation.

### ProgressTracker
Visual component showing:
- Planning completion percentage
- Statistics (accommodations, activities, transport counts)
- Countdown to trip date
- Planning checklist

## Custom Hooks

### useItineraries
Manages list of itineraries with CRUD operations:
```typescript
const { itineraries, loading, error, createItinerary, deleteItinerary } = useItineraries();
```

### useItinerary
Manages single itinerary with all related data:
```typescript
const { itinerary, accommodations, activities, transports, updateItinerary } = useItinerary(id);
```

## Styling

The app uses vanilla CSS with:
- CSS custom properties for theming
- Dark/light mode support via `prefers-color-scheme`
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR for fast development. Changes appear immediately without full page reload.

### TypeScript Strict Mode
The project uses strict TypeScript for better type safety. All API responses and component props are fully typed.

### Code Linting
```bash
npm run lint
# or
yarn lint
```

## Troubleshooting

### API Connection Issues
- Verify backend is running on the configured port
- Check browser console for CORS errors
- Ensure proxy configuration in `vite.config.ts` is correct

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors
- Run type checking: `npx tsc --noEmit`
- Ensure all dependencies have type definitions

## Future Enhancements

- [ ] Add authentication and user management
- [ ] Implement real-time collaboration
- [ ] Add map integration for locations
- [ ] Export itinerary to PDF
- [ ] Add budget tracking and expense management
- [ ] Implement offline support with PWA
- [ ] Add photo gallery for activities
- [ ] Calendar integration for syncing dates

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Vite
