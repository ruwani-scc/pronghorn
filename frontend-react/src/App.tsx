import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ItineraryDetail from './pages/ItineraryDetail'
import CreateItinerary from './pages/CreateItinerary'
import EditItinerary from './pages/EditItinerary'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="itineraries/new" element={<CreateItinerary />} />
        <Route path="itineraries/:id" element={<ItineraryDetail />} />
        <Route path="itineraries/:id/edit" element={<EditItinerary />} />
      </Route>
    </Routes>
  )
}

export default App
