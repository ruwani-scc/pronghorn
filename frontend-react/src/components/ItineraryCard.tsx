import { Link } from 'react-router-dom';
import type { Itinerary } from '../types';
import './ItineraryCard.css';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onDelete?: (id: string) => void;
}

const ItineraryCard = ({ itinerary, onDelete }: ItineraryCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      onDelete?.(itinerary.id);
    }
  };

  return (
    <div className="itinerary-card">
      <div className="card-header">
        <h3>{itinerary.title}</h3>
        <span 
          className="status-badge" 
          style={{ backgroundColor: getStatusColor(itinerary.status) }}
        >
          {itinerary.status}
        </span>
      </div>
      <div className="card-body">
        <p className="destination">📍 {itinerary.destination}</p>
        <p className="dates">
          📅 {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
        </p>
        {itinerary.description && (
          <p className="description">{itinerary.description}</p>
        )}
        {itinerary.budget && (
          <p className="budget">
            💰 Budget: {itinerary.currency || '$'}{itinerary.budget.toLocaleString()}
          </p>
        )}
      </div>
      <div className="card-actions">
        <Link to={`/itineraries/${itinerary.id}`} className="btn btn-view">
          View Details
        </Link>
        <Link to={`/itineraries/${itinerary.id}/edit`} className="btn btn-edit">
          Edit
        </Link>
        {onDelete && (
          <button onClick={handleDelete} className="btn btn-delete">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ItineraryCard;
