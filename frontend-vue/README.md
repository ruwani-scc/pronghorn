# VacationPlan - Vue.js 3 Frontend

A modern, feature-rich Vue.js 3 frontend for the Trip Itinerary Manager application.

## 🚀 Features

- ⚡️ **Vue 3** - Composition API with `<script setup>` syntax
- 🔷 **TypeScript** - Full type safety across the application
- 🎨 **Modern UI** - Clean, responsive design with custom components
- 🛣️ **Vue Router** - Client-side routing with lazy loading
- 📦 **Vite** - Lightning fast development and optimized builds
- 🔌 **API Integration** - Axios-based HTTP client with interceptors
- 🎯 **Composables** - Reusable state management logic
- 📱 **Responsive** - Mobile-first design approach

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, or pnpm
- Backend API running on `http://localhost:3000` (or configure via `.env`)

## 🛠️ Installation

1. Navigate to the frontend-vue directory:

```bash
cd frontend-vue
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
VITE_API_BASE_URL=http://localhost:7001/api/v1
```

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

The application will automatically reload when you make changes to the source files.

## 🏗️ Build

Build the project for production:

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

## 👀 Preview

Preview the production build locally:

```bash
npm run preview
```

## 🧪 Testing

Run tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📁 Project Structure

```
frontend-vue/
├── public/              # Static assets
├── src/
│   ├── api/            # API service layer
│   │   ├── client.ts   # Axios client with interceptors
│   │   ├── itineraries.ts
│   │   └── items.ts
│   ├── assets/         # Styles and static resources
│   │   └── main.css    # Global styles
│   ├── components/     # Reusable Vue components
│   │   ├── AccommodationList.vue
│   │   ├── ActivityList.vue
│   │   ├── ItineraryCard.vue
│   │   ├── ItineraryForm.vue
│   │   ├── ProgressTracker.vue
│   │   └── TransportList.vue
│   ├── composables/    # Composition API composables
│   │   ├── useItinerary.ts
│   │   └── useItineraryItems.ts
│   ├── pages/          # Route pages
│   │   ├── Dashboard.vue
│   │   ├── CreateItinerary.vue
│   │   ├── EditItinerary.vue
│   │   ├── ItineraryDetail.vue
│   │   └── NotFound.vue
│   ├── router/         # Vue Router configuration
│   │   └── index.ts
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🎯 Key Components

### Pages

- **Dashboard** - Display all itineraries with search functionality
- **Create Itinerary** - Form to create a new trip itinerary
- **Edit Itinerary** - Form to update existing itinerary
- **Itinerary Detail** - Comprehensive view with accommodations, activities, and transport
- **Not Found** - 404 error page

### Components

- **ItineraryCard** - Summary card for displaying itinerary in grid
- **ItineraryForm** - Reusable form for create/edit operations
- **AccommodationList** - Manage accommodation items with CRUD operations
- **ActivityList** - Manage activity items with CRUD operations
- **TransportList** - Manage transport items with CRUD operations
- **ProgressTracker** - Visual progress indicator with category breakdown

### Composables

- **useItinerary** - State management for itineraries (CRUD operations)
- **useItineraryItems** - State management for itinerary items

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `/api/v1`)

### Vite Configuration

The Vite configuration includes:
- Vue plugin for SFC support
- Path aliases (`@` → `src`)
- Development server on port 5174
- API proxy to backend (port 3000)
- Code splitting for vendor libraries

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured
- Vue SFC type support

## 🌐 API Integration

The application communicates with the backend API using Axios. The API client includes:

- **Authentication**: Automatic token injection from localStorage
- **Error Handling**: Global error interceptor with user-friendly messages
- **Type Safety**: Full TypeScript support for requests and responses

### API Endpoints

```typescript
// Itineraries
GET    /api/v1/itineraries           # List all itineraries
POST   /api/v1/itineraries           # Create new itinerary
GET    /api/v1/itineraries/:id       # Get single itinerary
PUT    /api/v1/itineraries/:id       # Update itinerary
DELETE /api/v1/itineraries/:id       # Delete itinerary

// Items
GET    /api/v1/itineraries/:id/items # List items for itinerary
POST   /api/v1/itineraries/:id/items # Add item to itinerary
PUT    /api/v1/items/:id              # Update item
DELETE /api/v1/items/:id              # Delete item
PATCH  /api/v1/items/:id              # Toggle completion status
POST   /api/v1/items/bulk             # Bulk operations (reorder)
```

## 🎨 Styling

The application uses scoped CSS with:
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Utility classes for common patterns
- Component-scoped styles to prevent conflicts

### Color Palette

- Primary: `#42b983` (Green)
- Secondary: `#6c757d` (Gray)
- Success: `#28a745` (Green)
- Warning: `#ffc107` (Yellow)
- Danger: `#dc3545` (Red)
- Info: `#17a2b8` (Cyan)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
   - Build the project
   - Deploy the `dist/` directory
   - Configure environment variables in hosting platform

2. **Docker**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **CDN**
   - Build the project
   - Upload `dist/` contents to CDN
   - Configure cache headers

## 🔒 Security

- Authentication tokens stored in localStorage
- CSRF protection via backend
- Input sanitization on all forms
- XSS prevention through Vue's template system
- HTTPS required in production

## 📚 Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 👥 Authors

VacationPlan Team

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Community contributors
- Open source libraries used in this project
