import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItinerary } from '../hooks/useItinerary';
import AccommodationList from '../components/AccommodationList';
import ActivityList from '../components/ActivityList';
import TransportList from '../components/TransportList';
import ProgressTracker from '../components/ProgressTracker';
import './ItineraryDetail.css';

const ItineraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itinerary, accommodations, activities, transports, loading, error } = useItinerary(id!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: '#gray',
      confirmed: '#4CAF50',
      completed: '#2196F3',
      cancelled: '#f44336',
    };
    return colors[status as keyof typeof colors] || '#gray';
  };

  if (loading) {
    return (
      <div className="itinerary-detail">
        <div className="loading">Loading itinerary details...</div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="itinerary-detail">
        <div className="error">
          <h2>Error loading itinerary</h2>
          <p>{error?.message || 'Itinerary not found'}</p>
          <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="itinerary-detail">
      <div className="detail-header">
        <div className="header-main">
          <h1>{itinerary.title}</h1>
          <span 
            className="status-badge" 
            style={{ backgroundColor: getStatusColor(itinerary.status) }}
          >
            {itinerary.status}
          </span>
        </div>
        <div className="header-info">
          <p className="destination">📍 {itinerary.destination}</p>
          <p className="dates">
            📅 {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
          </p>
        </div>
        {itinerary.description && (
          <p className="description">{itinerary.description}</p>
        )}
        {itinerary.budget && (
          <p className="budget">
            💰 Budget: {itinerary.currency || '$'}{itinerary.budget.toLocaleString()}
          </p>
        )}
        <div className="header-actions">
          <Link to={`/itineraries/${id}/edit`} className="btn btn-edit">
            Edit Itinerary
          </Link>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="main-section">
          <section className="section">
            <h2>🏨 Accommodations</h2>
            <AccommodationList accommodations={accommodations} />
          </section>

          <section className="section">
            <h2>🎯 Activities</h2>
            <ActivityList activities={activities} />
          </section>

          <section className="section">
            <h2>🚆 Transport</h2>
            <TransportList transports={transports} />
          </section>
        </div>

        <aside className="sidebar">
          <ProgressTracker
            itinerary={itinerary}
            accommodationCount={accommodations.length}
            activityCount={activities.length}
            transportCount={transports.length}
          />
        </aside>
      </div>
    </div>
  );
};

export default ItineraryDetail;
