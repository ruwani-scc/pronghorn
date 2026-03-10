import { useItineraries } from '../hooks/useItinerary';
import ItineraryCard from '../components/ItineraryCard';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { itineraries, loading, error, deleteItinerary } = useItineraries();

  const handleDelete = async (id: string) => {
    try {
      await deleteItinerary(id);
    } catch (err) {
      console.error('Failed to delete itinerary:', err);
      alert('Failed to delete itinerary. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your itineraries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <h2>Error loading itineraries</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Travel Itineraries</h1>
        <p>Plan and manage all your trips in one place</p>
      </div>

      {itineraries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <h2>No itineraries yet</h2>
          <p>Start planning your next adventure!</p>
          <Link to="/itineraries/new" className="btn btn-primary">
            Create Your First Itinerary
          </Link>
        </div>
      ) : (
        <div className="itineraries-grid">
          {itineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
